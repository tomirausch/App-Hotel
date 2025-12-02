import styles from "../../styles/OcuparHabitacion.module.css"
import Head from 'next/head';
import { useState, useMemo } from "react";

export default function OcuparHabitacion() {

  // --- ESTADOS ---
  const [habitaciones, setHabitaciones] = useState([]);
  
  // Selección
  const [seleccionadoInicio, setSeleccionadoInicio] = useState([]);
  const [seleccionadoFin, setSeleccionadoFin] = useState([]);
  const [reservasAcumuladas, setReservasAcumuladas] = useState([]);
  const [mostrandoLista, setMostrandoLista] = useState(false);
  const [mostrandoFormularioHuesped, setMostrandoFormularioHuesped] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [errores, setErrores] = useState({});
  const [modalConfig, setModalConfig] = useState({ 
    visible: false, tipo: "", titulo: "", mensaje: "", acciones: [] 
  });

  const cerrarModal = () => setModalConfig(prev => ({ ...prev, visible: false }));
  
  const mostrarError = (mensaje) => {
    setModalConfig({
      visible: true,
      tipo: "error",
      titulo: "No se puede ocupar",
      mensaje: mensaje,
      acciones: [{ texto: "Entendido", estilo: "cancelar", onClick: cerrarModal }]
    });
  };

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

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "";
    return fechaString.split('-').reverse().join('-');
  };

  // --- LÓGICA DE SELECCIÓN ---
  const seleccionadaReserva = useMemo(() => {
    if (seleccionadoInicio.length === 0) return [];
    if (seleccionadoFin.length === 0) return [seleccionadoInicio];
    const dias = fechasEntreFechas(seleccionadoInicio[0], seleccionadoFin[0]);
    return dias.map(fecha => [fecha, seleccionadoInicio[1]]);
  }, [seleccionadoInicio, seleccionadoFin]);

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
      return new Date(a.fecha) - new Date(b.fecha);
    });

    const columnas = {};
    habitacionesOrdenadas.forEach(h => {
      if (!columnas[h.id]) {
        columnas[h.id] = {
          id: h.id,
          tipo: h.tipoHabitacion,
          numero: h.numero,
          estados: {}
        };
      }
      columnas[h.id].estados[h.fecha] = h.estado;
    });
    return columnas;
  }, [habitaciones]);


  // --- HANDLERS ACCIONES ---
  const handleAtras = () => {
    setSeleccionadoInicio([]);
    setSeleccionadoFin([]);
    setReservasAcumuladas([]);
  };

  // --- LÓGICA ESPECÍFICA DE OCUPAR ---
  const handleAgregarSeleccion = () => {
    if (seleccionadaReserva.length === 0) return;
    
    if (seleccionadaReserva.length < 2) {
      mostrarError("La estancia mínima es de 2 días (una noche).");
      return;
    }
    
    let hayBloqueo = false; // Ocupada, Mantenimiento
    let hayReserva = false; // Reservada (Advertencia)

    seleccionadaReserva.forEach((item) => {
      const [fecha, idColumna] = item;
      const estadoCelda = ordenarDatos[idColumna]?.estados[fecha];
      
      if (estadoCelda === 'OCUPADA' || estadoCelda === 'MANTENIMIENTO' || estadoCelda === 'FUERA_DE_SERVICIO') {
        hayBloqueo = true;
      }
      if (estadoCelda === 'RESERVADA') {
        hayReserva = true;
      }
    });

    // 1. Bloqueo total
    if (hayBloqueo) {
      mostrarError("Seleccionaste fechas donde la habitación ya está OCUPADA o en MANTENIMIENTO.");
      return;
    }

    // Función interna para ejecutar la agregación
    const ejecutarAgregar = () => {
        setReservasAcumuladas((prev) => [...prev, ...seleccionadaReserva]);
        setSeleccionadoInicio([]);
        setSeleccionadoFin([]);
        cerrarModal();
    };

    // 2. Advertencia de Reserva (Lógica del punto 3.D del CU)
    if (hayReserva) {
        setModalConfig({
            visible: true,
            tipo: "advertencia",
            titulo: "Habitación Reservada",
            mensaje: "Las fechas seleccionadas figuran como RESERVADAS. ¿Desea realizar la ocupación de todas formas?",
            acciones: [
                { texto: "Cancelar", estilo: "cancelar", onClick: cerrarModal },
                { texto: "Ocupar Igual", estilo: "aceptar", onClick: ejecutarAgregar }
            ]
        });
        return;
    }

    // 3. Todo libre, agregar directo
    ejecutarAgregar();
  };

  // --- API CALLS ---
  const enviarDatos = async (e) => {
    setHabitaciones([]);
    e.preventDefault();
    setCargando(true);
    
    // Limpiamos todo al buscar de nuevo
    setSeleccionadoInicio([]);
    setSeleccionadoFin([]);
    setReservasAcumuladas([]);
    setMostrandoLista(false);

    const formData = new FormData(e.target);
    const datos = { Desde: formData.get('Desde'), Hasta: formData.get('Hasta') };
    const query = `http://localhost:8080/api/habitaciones/estado?desde=${datos.Desde}&hasta=${datos.Hasta}`;

    try {
      const respuesta = await fetch(query, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (respuesta.ok) {
        const contenido = await respuesta.json();
        setHabitaciones(contenido);
      } else {
        console.error("Error respuesta");
      }
    } catch (e) { console.log(e); } finally { setCargando(false); }
  };

  const enviarOcupacion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Validaciones Formulario
    const camposObligatorios = ["apellido", "nombre", "tipoDocumento", "numeroDocumento", "telefono"];
    const nuevosErrores = {};

    camposObligatorios.forEach((campo) => {
      const valor = formData.get(campo);
      if (!valor || valor.toString().trim() === "") nuevosErrores[campo] = "Campo obligatorio";
    });

    const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;
    if (formData.get("nombre") && !regexSoloLetras.test(formData.get("nombre"))) nuevosErrores["nombre"] = "Solo letras";
    if (formData.get("apellido") && !regexSoloLetras.test(formData.get("apellido"))) nuevosErrores["apellido"] = "Solo letras";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    setErrores({});

    const detalles = reservasAcumuladas.map((reserva) => ({ idHabitacion: reserva[1], fecha: reserva[0] }));
    const datosHuesped = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      tipoDocumento: formData.get("tipoDocumento"),
      numeroDocumento: formData.get("numeroDocumento"),
      telefono: formData.get("telefono"),
    };
    const payload = { detalles, datosHuesped };

    setCargando(true);
    
    try {
      // CAMBIO DE ENDPOINT PARA OCUPACIONES
      const respuesta = await fetch("http://localhost:8080/api/ocupaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        setModalConfig({
          visible: true, tipo: "exito", titulo: "¡Check-in Exitoso!", mensaje: "La ocupación ha sido registrada correctamente.",
          acciones: [{
            texto: "Aceptar", estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              // Reset Total
              setHabitaciones([]); setReservasAcumuladas([]); setMostrandoLista(false); setMostrandoFormularioHuesped(false);
              setFechaDesde(""); setFechaHasta(""); setSeleccionadoInicio([]); setSeleccionadoFin([]);
            }
          }]
        });
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        mostrarError(errorData.message || "No se pudo procesar la ocupación.");
      }
    } catch (e) {
      mostrarError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  // --- SUB-RENDERIZADOS ---
  const mostrarLista = () => {
    const obtenerFormatoCompleto = (fechaString, horaFija) => {
      if (!fechaString) return "-";
      const [anio, mes, dia] = fechaString.split('-');
      const fechaObj = new Date(anio, mes - 1, dia);
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return `${diasSemana[fechaObj.getDay()]}, ${dia}/${mes}/${anio}, ${horaFija}`;
    };

    const generarResumenReservas = (listaReservas) => {
      const agrupado = {};
      listaReservas.forEach((item) => {
        const [fecha, id] = item;
        if (!agrupado[id]) agrupado[id] = [];
        agrupado[id].push(fecha);
      });
      return Object.keys(agrupado).map((id) => {
        const fechas = agrupado[id].sort();
        const infoHabitacion = ordenarDatos[id];
        return {
          Habitacion: infoHabitacion?.numero || id,
          Tipo: infoHabitacion?.tipo || "Desconocido",
          Ingreso: obtenerFormatoCompleto(fechas[0], "12:00hs"),
          Egreso: obtenerFormatoCompleto(fechas[fechas.length - 1], "10:00hs")
        };
      });
    };

    const datosTabla = generarResumenReservas(reservasAcumuladas);

    return (
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        {!mostrandoFormularioHuesped ? (
          /* VISTA 2: LISTA RESUMEN */
          <>
            <h2 className={styles.tituloSeccion}>Confirmar Ocupación ({reservasAcumuladas.length} noches)</h2>
            <div className={styles.listaContainer}>
              <div className={styles.headerLista}>
                <div className={styles.tituloHeaderLista}><h3>Habitación</h3></div>
                <div className={styles.tituloHeaderLista}><h3>Tipo</h3></div>
                <div className={styles.tituloHeaderLista}><h3>Ingreso</h3></div>
                <div className={styles.tituloHeaderLista}><h3>Egreso</h3></div>
              </div>
              <div className={styles.contenidoListaContainer}>
                {datosTabla.map((fila, index) => (
                  <div key={index} className={styles.filaListaContainer}>
                    <div className={styles.pListaContainer}><p style={{fontWeight:'bold'}}>{fila.Habitacion}</p></div>
                    <div className={styles.pListaContainer}><p>{fila.Tipo}</p></div>
                    <div className={styles.pListaContainer}><p>{fila.Ingreso}</p></div>
                    <div className={styles.pListaContainer}><p>{fila.Egreso}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.botonesListaContainer}>
              <input type="button" value="Volver" className={styles.btnCancelar} onClick={() => setMostrandoLista(false)} />
              <input type="button" value="Continuar al Check-in" className={styles.btnSiguiente} style={{backgroundColor: '#22c55e'}} onClick={() => setMostrandoFormularioHuesped(true)} />
            </div>
          </>
        ) : (
          /* VISTA 3: FORMULARIO HUÉSPED */
          <div className={styles.formularioReservaContainer}>
            <div className={styles.cardFormulario}>
                <h3 className={styles.legend}>Datos del Titular (Check-in)</h3>
                <form onSubmit={enviarOcupacion} id="formDatosHuesped">
                <div className={styles.formReservaInputsContainer}>
                    
                    <div className={styles.filaInputs}>
                        <div className={styles.inputContainer}>
                            <label>Nombre*</label>
                            <input type="text" name="nombre" placeholder="Nombre"
                                className={errores.nombre ? styles.inputError : ''} 
                                onInput={(e) => e.target.value = e.target.value.toUpperCase()} 
                                onChange={() => setErrores({ ...errores, nombre: null })} 
                            />
                            {errores.nombre && <span className={styles.mensajeError}>{errores.nombre}</span>}
                        </div>
                        <div className={styles.inputContainer}>
                            <label>Apellido*</label>
                            <input type="text" name="apellido" placeholder="Apellido"
                                className={`${errores.apellido ? styles.inputError : ''}`}
                                onInput={(e) => e.target.value = e.target.value.toUpperCase()} 
                                onChange={() => setErrores({ ...errores, apellido: null })} 
                            />
                            {errores.apellido && <span className={styles.mensajeError}>{errores.apellido}</span>}
                        </div>
                    </div>

                    <div className={styles.filaInputs}>
                        <div className={styles.inputContainer}>
                            <label>Tipo Doc.*</label>
                            <select name="tipoDocumento">
                                <option value="DNI">DNI</option>
                                <option value="PASAPORTE">Pasaporte</option>
                                <option value="LE">LE</option>
                                <option value="LC">LC</option>
                                <option value="OTRO">Otro</option>
                            </select>
                        </div>
                        <div className={styles.inputContainer}>
                            <label>Nro. Documento*</label>
                            <input type="text" name="numeroDocumento" placeholder="Numero Documento"
                                className={errores.numeroDocumento ? styles.inputError : ''} 
                                onChange={() => setErrores({ ...errores, numeroDocumento: null })} 
                            />
                            {errores.numeroDocumento && <span className={styles.mensajeError}>{errores.numeroDocumento}</span>}
                        </div>
                    </div>
                </div>
                </form>
                
                <div className={styles.botonesListaContainer} style={{marginTop:'30px', marginBottom:'0'}}>
                    <input type="button" value="Atrás" className={styles.btnCancelar} onClick={() => setMostrandoFormularioHuesped(false)} />
                    <input type="submit" form="formDatosHuesped" value={cargando ? "Buscando..." : "Buscar"} 
                        className={`${styles.btnSiguiente} ${cargando ? styles.desactivado : ''}`} disabled={cargando} 
                        style={{backgroundColor: '#22c55e'}}
                    />
                </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const mostrarResultados = () => {
    const columnas = ordenarDatos;
    const fechas = new Set();
    habitaciones.forEach(hab => fechas.add(hab.fecha));
    const fechasArray = Array.from(fechas).sort();

    const manejarClick = (fecha, idColumna) => {
      const esMismoInicio = seleccionadoInicio.length > 0 && seleccionadoInicio[0] === fecha && seleccionadoInicio[1] === idColumna;
      if (esMismoInicio) { setSeleccionadoInicio([]); setSeleccionadoFin([]); return; }

      if (seleccionadoInicio.length === 0) {
        setSeleccionadoInicio([fecha, idColumna]);
      } else if (seleccionadoFin.length === 0) {
        if (seleccionadoInicio[1] !== idColumna) { setSeleccionadoInicio([fecha, idColumna]); return; }
        const dInicio = new Date(seleccionadoInicio[0]);
        const dClick = new Date(fecha);
        if (dClick < dInicio) { setSeleccionadoFin(seleccionadoInicio); setSeleccionadoInicio([fecha, idColumna]); } 
        else { setSeleccionadoFin([fecha, idColumna]); }
      } else {
        setSeleccionadoInicio([fecha, idColumna]); setSeleccionadoFin([]);
      }
    };

    const obtenerClaseSeleccion = (fechaCelda, idColumna, estadoOriginal) => {
      let clases = `${styles.celdaEstado} ${styles[`estado${estadoOriginal}`] || ''}`;
      const estaAcumulada = reservasAcumuladas.some(item => item[0] === fechaCelda && item[1] === idColumna);
      if (estaAcumulada) return `${clases} ${styles.estadoAgregado}`;
      if (seleccionadoInicio.length === 0) return clases;
      if (seleccionadoInicio[1] !== idColumna) return clases;
      const fechaCeldaTime = new Date(fechaCelda).getTime();
      const fechaInicioTime = new Date(seleccionadoInicio[0]).getTime();
      if (fechaCeldaTime === fechaInicioTime) return `${clases} ${styles.seleccionInicio}`;
      if (seleccionadoFin.length === 0) return clases;
      const fechaFinTime = new Date(seleccionadoFin[0]).getTime();
      if (fechaCeldaTime === fechaFinTime) return `${clases} ${styles.seleccionFin}`;
      if (fechaCeldaTime > fechaInicioTime && fechaCeldaTime < fechaFinTime) return `${clases} ${styles.seleccionRango}`;
      return clases;
    };

    return (
      <>
        <div className={styles.resultadosContainer}>
          <div className={styles.columnaEstaticaContainer}>
            <div className={styles.celdaTituloEstatico}>Tipo</div>
            <div className={styles.celdaTituloEstatico}>Número</div>
            {fechasArray.map((fecha, index) => (
              <div key={index} className={styles.celdaFecha}>{formatearFecha(fecha)}</div>
            ))}
          </div>
          {Object.values(columnas).map((columna) => (
            <div key={columna.id} className={styles.columnaHabitacion}>
              <div className={styles.celdaHeaderHabitacion} title={columna.tipo}>{columna.tipo}</div>
              <div className={styles.celdaHeaderNumero}>{columna.numero}</div>
              {Object.values(columna.estados).map((estado, i) => (
                <div key={fechasArray[i]}
                  onClick={() => manejarClick(fechasArray[i], columna.id)}
                  className={`${styles.celdaEstado} ${obtenerClaseSeleccion(fechasArray[i], columna.id, estado)}`}>
                  <p className={`${styles.estado} ${styles[`estado${estado}`]}`}>{estado}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.botonesRespuestaContainer}>
          <input type="button" value="Atrás" className={styles.btnCancelar} onClick={handleAtras} />
          <input type="button" value="Agregar Selección" className={styles.btnSiguiente} style={{ backgroundColor: "#3b82f6" }} onClick={handleAgregarSeleccion} />
          <input type="button" value={`Confirmar Ocupación (${reservasAcumuladas.length})`} className={`${styles.btnSiguiente} ${reservasAcumuladas.length === 0 ? styles.desactivado : null}`}
            style={{backgroundColor: '#22c55e'}}
            onClick={() => { setMostrandoLista(true); }}
            disabled={reservasAcumuladas.length === 0}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Ocupar Habitación (Check-in)</title>
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
                <input type="date" name="Desde" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
              </div>
              <div className={styles.inputContainer}>
                <label htmlFor="Hasta"> Hasta</label>
                <input type="date" name="Hasta" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
              </div>
            </div>
          </fieldset>
        </form>

        <div className={styles.formButtons}>
          <input type="reset" value="Cancelar" form="formulario" className={styles.btnCancelar}
            onClick={() => {
              setHabitaciones([]);
              setSeleccionadoInicio([]);
              setSeleccionadoFin([]);
              setReservasAcumuladas([]);
              setMostrandoLista(false);
              setFechaDesde("");
              setFechaHasta("");
              setMostrandoFormularioHuesped(false);
            }}
          />
          <input type="submit" value={cargando ? "Buscando..." : "Buscar Disponibilidad"} 
            disabled={cargando || !fechaDesde || !fechaHasta || (fechaDesde === fechaHasta) || (fechaHasta < fechaDesde)} 
            form="formulario" 
            className={`${styles.btnSiguiente} ${cargando || !fechaDesde || !fechaHasta || (fechaDesde === fechaHasta) || (fechaHasta < fechaDesde) ? styles.desactivado : null}`} 
            onClick={() => { setSeleccionadoInicio([]); setSeleccionadoFin([]); setReservasAcumuladas([]); setMostrandoLista(false) }} />
        </div>

        {habitaciones.length > 0 ? (
          <div className={styles.containerResponse}>
            {mostrandoLista ? mostrarLista() : mostrarResultados()}
          </div>
        ) : (
          <div className={styles.containerNullResponse}>
            {cargando ? "Buscando..." : "Realice una búsqueda para comenzar el Check-in..."}
          </div>
        )}
      </div>

      {modalConfig.visible && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles[modalConfig.tipo]}`}>
            <span className={styles.modalIcon}>
              {modalConfig.tipo === 'exito' && '✅'}
              {modalConfig.tipo === 'error' && '⛔'}
              {modalConfig.tipo === 'advertencia' && '⚠️'}
            </span>
            <h3 className={styles.modalTitulo}>{modalConfig.titulo}</h3>
            <p className={styles.modalMensaje}>{modalConfig.mensaje}</p>
            <div className={styles.botonesContainer}>
              {modalConfig.acciones && modalConfig.acciones.map((accion, index) => (
                <button
                  key={index}
                  className={`${styles.btnModal} ${styles[accion.estilo]}`}
                  onClick={accion.onClick}
                >
                  {accion.texto}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}