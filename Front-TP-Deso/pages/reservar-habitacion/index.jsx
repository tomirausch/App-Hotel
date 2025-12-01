  import styles from "../../styles/ReservarHabitacion.module.css"
  import Head from 'next/head';
  import { useState, useMemo, use } from "react";

  export default function ReservarHabitacion() {

    const [habitaciones, setHabitaciones] = useState([]);
    const [seleccionadoInicio, setSeleccionadoInicio] = useState([]);
    const [seleccionadoFin, setSeleccionadoFin] = useState([]);
    const [reservasAcumuladas, setReservasAcumuladas] = useState([]);
    const [mostrandoLista, setMostrandoLista] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const fechasEntreFechas = (fechaA, fechaB) => {
        const fechas = [];
        let fechaActual = new Date(fechaA);
        const fechaFinal = new Date(fechaB);

        while (fechaActual <= fechaFinal) {
            fechas.push(fechaActual.toISOString().split('T')[0]);
            fechaActual.setDate(fechaActual.getDate() + 1);
        }

        return fechas;
    }

    const seleccionReserva = () =>{
      let seleccion = [];
      if(seleccionadoInicio[1] !== seleccionadoFin[1]){
        setSeleccionadoInicio(seleccionadoFin);
        setSeleccionadoFin([]);
      }else{
        seleccion.push(seleccionadoInicio);
        fechasEntreFechas(seleccionadoInicio[0], seleccionadoFin[0]).forEach((fecha)=>{
          seleccion.push([fecha, seleccionadoInicio[1]]);
        })
        seleccion.push(seleccionadoFin);
      }
      return seleccion;
    }

    const formatearFecha = (fechaString) => {
      if (!fechaString) return "";
      return fechaString.split('-').reverse().join('-'); 
    };

    // --- NUEVA LÓGICA AUTOMÁTICA (Reemplaza al useEffect y al useState extra) ---
    const seleccionadaReserva = useMemo(() => {
      // 1. Si no hay nada seleccionado
      if (seleccionadoInicio.length === 0) return [];

      // 2. Si solo hay inicio seleccionado
      if (seleccionadoFin.length === 0) return [seleccionadoInicio];

      // 3. Si hay RANGO COMPLETO (Inicio y Fin), calculamos los días del medio
      const dias = fechasEntreFechas(seleccionadoInicio[0], seleccionadoFin[0]);
      
      // Devolvemos array de arrays: [ [fecha, id], [fecha, id], ... ]
      return dias.map(fecha => [fecha, seleccionadoInicio[1]]);

    }, [seleccionadoInicio, seleccionadoFin]);

    const handleAtras = () => {
      setSeleccionadoInicio([]);
      setSeleccionadoFin([]);
      setReservasAcumuladas([]);
      console.log("Se han limpiado todas las selecciones.");
    };

    const handleAgregarSeleccion = () => {
      if (seleccionadaReserva.length === 0) return;
      if (seleccionadaReserva.length < 2) {
      alert("⚠️ La estancia mínima es de 2 días (una noche). Por favor selecciona fecha de entrada y salida.");
      return;
      }
    const hayNoDisponibles = seleccionadaReserva.some((item) => {
            const [fecha, idColumna] = item;
            const estadoCelda = ordenarDatos[idColumna]?.estados[fecha];
            return estadoCelda !== 'DISPONIBLE'; 
          });

          if (hayNoDisponibles) {
            alert("⛔ Error: Has seleccionado fechas que NO están disponibles (Reservadas, Ocupadas o en Mantenimiento).");
            return;
          }
      setReservasAcumuladas((prev) => [...prev, ...seleccionadaReserva]);
      setSeleccionadoInicio([]);
      setSeleccionadoFin([]);
    };

    const enviarDatos = async (e) => {
      setHabitaciones([]);
      e.preventDefault();
      setCargando(true);
      const formData = new FormData(e.target);

      const datos = {
        Desde: formData.get('Desde'),
        Hasta: formData.get('Hasta')
      };

      const query = `http://localhost:8080/api/habitaciones/estado?desde=${datos.Desde}&hasta=${datos.Hasta}`;

      try {
        const respuesta = await fetch(query, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (respuesta.ok) {
          const contenido = await respuesta.json();
          console.log("1. Crudo: ", contenido);
          setHabitaciones(contenido);
        } else {
          console.error("Error respuesta");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setCargando(false);
      }
    };

    const ordenarDatos = useMemo(() => {
      if (!habitaciones) return [];

      const habitacionesOrdenadas = [...habitaciones].sort((a, b) => {
        const tipoA = a.tipoHabitacion.toString().toLowerCase();
        const tipoB = b.tipoHabitacion.toString().toLowerCase();

        if (tipoA < tipoB) return -1;
        if (tipoA > tipoB) return 1;

        const numA = parseInt(a.numero);
        const numB = parseInt(b.numero);

        if (numA < numB) return -1;
        if (numA > numB) return 1;

        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);

        return fechaA - fechaB;
      });

      const columnas = {};

      habitacionesOrdenadas.forEach(h => {
        if (!columnas[h.id]) {
          columnas[h.id] = {
            id: h.id,
            tipo: h.tipoHabitacion,
            numero: h.numero,
            estados: {} // fecha → estado
          };
        }
        columnas[h.id].estados[h.fecha] = h.estado;
      });
      return columnas
    }, [habitaciones]);

    const mostrarResultados = () => {
      const columnas = ordenarDatos;
      console.log("2. ", columnas);
      // Creo array de fechas únicas
      const fechas = new Set();
      habitaciones.forEach(hab => {
        fechas.add(hab.fecha);
      });
      const fechasArray = Array.from(fechas).sort();

    const manejarClick = (fecha, idColumna) => {
        
        // 1. DESELECCIONAR (Si hace click en la misma celda de inicio)
        const esMismoInicio = seleccionadoInicio.length > 0 && 
                              seleccionadoInicio[0] === fecha && 
                              seleccionadoInicio[1] === idColumna;

        if (esMismoInicio) {
          setSeleccionadoInicio([]);
          setSeleccionadoFin([]);
          console.log("Reseteado todo");
          return;
        }

        // 2. PRIMER CLICK (Marcar Inicio)
        if (seleccionadoInicio.length === 0) {
          setSeleccionadoInicio([fecha, idColumna]);
          console.log("Inicio marcado");
        
        // 3. SEGUNDO CLICK (Decidir si es Fin o SWAP)
        } else if (seleccionadoFin.length === 0) {
          
          // A. Verificar que sea la misma habitación
          if (seleccionadoInicio[1] !== idColumna) {
            // Si cambia de habitación, olvidamos lo anterior y empezamos aquí
            setSeleccionadoInicio([fecha, idColumna]);
            console.log("Cambio de habitación -> Nuevo Inicio");
            return;
          }

          // B. Lógica del SWAP (Intercambio)
          const dInicio = new Date(seleccionadoInicio[0]);
          const dClick = new Date(fecha);

          if (dClick < dInicio) {
            // EL SWAP: Click actual (menor) pasa a ser Inicio. Inicio viejo pasa a ser Fin.
            setSeleccionadoFin(seleccionadoInicio); 
            setSeleccionadoInicio([fecha, idColumna]); 
            console.log("SWAP: Fechas invertidas automáticamente");
          } else {
            // NORMAL: Click actual (mayor) es el Fin.
            setSeleccionadoFin([fecha, idColumna]);
            console.log("Fin marcado normal");
          }

        // 4. TERCER CLICK (Ya había un rango completo, empezamos uno nuevo)
        } else {
          setSeleccionadoInicio([fecha, idColumna]);
          setSeleccionadoFin([]);
          console.log("Reinicio -> Nuevo Inicio");
        }
      };

      const obtenerClaseSeleccion = (fechaCelda, idColumna, estadoOriginal) => {
        // 1. Clase base + color del estado (Disponible/Reservado)
        let clases = `${styles.celdaEstado} ${styles[`estado${estadoOriginal}`] || ''}`;

        const estaAcumulada = reservasAcumuladas.some(item => item[0] === fechaCelda && item[1] === idColumna);

        if (estaAcumulada) {
          return `${clases} ${styles.estadoAgregado}`;
        }
        // 2. Si no hay nada seleccionado, devolvemos la base
        if (seleccionadoInicio.length === 0) return clases;

        // 3. Si la selección es en OTRA habitación, no pintamos nada en esta columna
        // Recuerda: seleccionadoInicio = [fecha, id]
        if (seleccionadoInicio[1] !== idColumna) return clases;

        const fechaCeldaTime = new Date(fechaCelda).getTime();
        const fechaInicioTime = new Date(seleccionadoInicio[0]).getTime();
        
        // CASO A: Es la celda de INICIO
        if (fechaCeldaTime === fechaInicioTime) {
          return `${clases} ${styles.seleccionInicio}`;
        }

        // Si no hay fecha fin seleccionada, terminamos aquí
        if (seleccionadoFin.length === 0) return clases;

        const fechaFinTime = new Date(seleccionadoFin[0]).getTime();

        // CASO B: Es la celda de FIN
        if (fechaCeldaTime === fechaFinTime) {
          return `${clases} ${styles.seleccionFin}`;
        }

        // CASO C: Está en el RANGO (Mayor que inicio Y Menor que fin)
        if (fechaCeldaTime > fechaInicioTime && fechaCeldaTime < fechaFinTime) {
          return `${clases} ${styles.seleccionRango}`;
        }

        return clases;
      };
      return (
        <>
        <div className={styles.resultadosContainer}>
          <div className={styles.columnaEstaticaContainer}>

            <div className={styles.celdaTituloEstatico}>Tipo</div>
            <div className={styles.celdaTituloEstatico}>Número</div>

            {fechasArray.map((fecha, index) => (
              <div key={index} data-debug-key={index} className={styles.celdaFecha}>
                {formatearFecha(fecha)}
              </div>
            ))}
          </div>

          {/* --- COLUMNAS DERECHA (SCROLLABLES) --- */}
          {Object.values(columnas).map((columna) => (
            <div key={columna.id} data-debug-key={columna.id} className={styles.columnaHabitacion}>
              
              {/* Cabeceras de Habitación */}
              <div className={styles.celdaHeaderHabitacion} title={columna.tipo}>
                {columna.tipo}
              </div>
              <div className={styles.celdaHeaderNumero}>
                {columna.numero}
              </div>

              {/* Filas de Estados */}
              {Object.values(columna.estados).map((estado, i) => (
                <div key={fechasArray[i]} data-debug-key={fechasArray[i]}
                onClick={() =>{
                    manejarClick(fechasArray[i], columna.id);
                    console.log("seleccionadaReserva: ",seleccionadaReserva);
                }}
                  className={`${styles.celdaEstado} ${obtenerClaseSeleccion(fechasArray[i], columna.id, estado)}`}>
                  <p className={`${styles.estado} ${styles[`estado${estado}`]}`}>{estado}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.botonesRespuestaContainer}>
          <input type="button" value="Atrás" className={styles.btnCancelar}
          onClick={
            handleAtras
          }
          />
          <input type="button" value="Agregar Selección" className={styles.btnSiguiente} style={{backgroundColor: "#3b82f6"}}
          onClick={
            handleAgregarSeleccion
          }
          />
          <input type="button" value={`Confirmar (${reservasAcumuladas.length})`} className={`${styles.btnSiguiente} ${reservasAcumuladas.length === 0 ? styles.desactivado : null}`} 
          onClick={
           () => {setMostrandoLista(true); console.log("Reservas Acumuladas: ", reservasAcumuladas)}
          }
          disabled={reservasAcumuladas.length === 0}
          />
        </div>
        </>
      );
    };

    const mostrarLista = () => {
    
    const obtenerFormatoCompleto = (fechaString, horaFija) => {
      if (!fechaString) return "-";

      // 1. Crear objeto fecha seguro (evitando problemas de zona horaria)
      // fechaString viene como "2025-12-31"
      const [anio, mes, dia] = fechaString.split('-');
      const fechaObj = new Date(anio, mes - 1, dia); // Mes en JS empieza en 0

      // 2. Obtener nombre del día
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const nombreDia = diasSemana[fechaObj.getDay()];

      // 3. Retornar string final
      return `${nombreDia}, ${dia}/${mes}/${anio}, ${horaFija}`;
    };

    const generarResumenReservas = (listaReservas) => {
        // 1. Agrupamos las fechas por ID de habitación
        // Resultado intermedio: { "1": ["2025-12-13", "2025-12-14"], "3": [...] }
        const agrupado = {};

        listaReservas.forEach((item) => {
          const [fecha, id] = item;
          if (!agrupado[id]) {
            agrupado[id] = [];
          }
          agrupado[id].push(fecha);
        });

        // 2. Convertimos ese grupo en el array de objetos que necesitas
        const resumen = Object.keys(agrupado).map((id) => {
          const fechas = agrupado[id].sort(); // Ordenamos cronológicamente para asegurar min y max

          // Buscamos el TIPO usando tu variable 'ordenarDatos' que tiene toda la info
          // Usamos ?. por si acaso el ID no se encuentra
          const infoHabitacion = ordenarDatos[id]; 

          return {
            Habitacion: infoHabitacion.numero,
            Tipo: infoHabitacion?.tipo || "Desconocido",
            
            // Usamos la función auxiliar con las horas fijas que pediste
            Ingreso: obtenerFormatoCompleto(fechas[0], "12:00hs"),
            
            Egreso: obtenerFormatoCompleto(fechas[fechas.length - 1], "10:00hs")
          };
        });

        return resumen;
      };

      const datosTabla = generarResumenReservas(reservasAcumuladas);

      return (
      <>
      <div className={styles.listaContainer}>
        <div className={styles.headerLista}>
          <div className={styles.tituloHeaderLista}>
            <h3>Habitacion</h3>
          </div>

          <div className={styles.tituloHeaderLista}>
            <h3>Tipo</h3>
          </div>

          <div className={styles.tituloHeaderLista}>
            <h3>Ingreso</h3>
          </div>

          <div className={styles.tituloHeaderLista}>
            <h3>Egreso</h3>
          </div>
        </div>

          <div className={styles.contenidoListaContainer}>
            {datosTabla.map((fila, index) => (
              <div className={styles.filaListaContainer}>
                <div className={styles.pListaContainer}>
                  <p>{fila.Habitacion}</p>
                </div>

                <div className={styles.pListaContainer}>
                  <p>{fila.Tipo}</p>
                </div>

                <div className={styles.pListaContainer}>
                  <p>{fila.Ingreso}</p>
                </div>

                <div className={styles.pListaContainer}>
                  <p>{fila.Egreso}</p>
                </div>
              </div>
            ))}
          </div>
      </div>

      <div className={styles.botonesListaContainer}>
            <input type="button" value="Rechazar" className={styles.btnCancelar}
            onClick={()=> {
              setMostrandoLista(false);
              setSeleccionadoInicio([]);
              setSeleccionadoFin([]);
              setReservasAcumuladas([]);
            }}
            />
            <input type="button" value="Aceptar" className={styles.btnSiguiente}/>
      </div>
      </>
    );
    };

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/hotel-icon.ico?v=2" />
          <link rel="icon" href="/hotel-icon.ico?v=2" />
        </Head>

        <div className={styles.contenedorPrincipal}>
          <form onSubmit={enviarDatos} className={styles.formulario} id="formulario">
            <fieldset className={styles.fieldset}>
              <div className={styles.legend}>Ingrese las fechas</div>
              <div className={styles.allInputContainer}>
                <div className={styles.inputContainer}>
                  <label htmlFor="Desde">Desde</label>
                  <input 
                    type="date"
                    name="Desde" 
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label htmlFor="Hasta"> Hasta</label>
                  <input 
                    type="date" 
                    name="Hasta" 
                    value={fechaHasta} 
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
          </form>

          <div className={styles.formButtons}>
            <input
              type="reset"
              value="Cancelar"
              form="formulario"
              className={styles.btnCancelar} 
              onClick={() => {
                setHabitaciones([]);
                setSeleccionadoInicio([]);
                setSeleccionadoFin([]);
                setReservasAcumuladas([]);
                setMostrandoLista(false);
              }}
            />

            <input
              type="submit"
              value={cargando ? "Buscando..." : "Buscar"}
              disabled={cargando || !fechaDesde || !fechaHasta || (fechaHasta < fechaDesde)}
              form="formulario"
              className={styles.btnSiguiente} 
              onClick={ ()=>{
                setSeleccionadoInicio([]);
                setSeleccionadoFin([]);
                setReservasAcumuladas([]);
                setMostrandoLista(false)
              }}
            />
          </div>

          {/* Solo mostrar si hay datos */}
          {habitaciones.length > 0 ? (
            <div className={styles.containerResponse}>
              {mostrandoLista ? mostrarLista() : mostrarResultados()}
            </div>
          ) : 
          <div className={styles.containerNullResponse}>
            {cargando ? "Buscando..." : "Realice una búsqueda..."}
          </div>
          }
        </div>
      </>
    )
  }