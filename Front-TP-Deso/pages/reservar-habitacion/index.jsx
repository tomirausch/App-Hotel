import styles from "../../styles/ReservarHabitacion.module.css"
import Head from 'next/head';
import { useState, useMemo } from "react";

export default function ReservarHabitacion() {

  const [habitaciones, setHabitaciones] = useState([]);
  const [seleccionadoInicio, setSeleccionadoInicio] = useState([]);
  const [seleccionadoFin, setSeleccionadoFin] = useState([]);
  const [reservasAcumuladas, setReservasAcumuladas] = useState([]);
  const [mostrandoLista, setMostrandoLista] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  
  // Estado Modal
  const [modalConfig, setModalConfig] = useState({ 
    visible: false, tipo: "", titulo: "", mensaje: "", acciones: [] 
  });

  const [mostrandoFormularioHuesped, setMostrandoFormularioHuesped] = useState(false);
  
  // Inicializamos errores vacío
  const [errores, setErrores] = useState({});

  // Helpers
  const cerrarModal = () => setModalConfig(prev => ({ ...prev, visible: false }));
  
  const mostrarError = (mensaje) => {
    setModalConfig({
      visible: true, type: "error", titulo: "¡Atención!", mensaje: mensaje,
      acciones: [{ texto: "Entendido", estilo: "cancelar", onClick: cerrarModal }]
    });
  };

  const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
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

    const obtenerNombreDia = (fechaObj) => {
      // Obtenemos el nombre del día en español (ej: "lunes")
      const nombre = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
      // Lo capitalizamos para que quede mejor (ej: "Lunes")
      return nombre.charAt(0).toUpperCase() + nombre.slice(1);
    };

    const formatearFechaIngreso = (fechaString) => {
      if (!fechaString) return "";
      
      // Desarmamos el string 'aaaa-mm-dd' para evitar errores de zona horaria
      const [anio, mes, dia] = fechaString.split('-');
      
      // Creamos la fecha (recordar que en JS el mes empieza en 0, por eso restamos 1)
      const fechaObj = new Date(anio, mes - 1, dia);
      
      const nombreDia = obtenerNombreDia(fechaObj);
      
      // Retornamos con el formato solicitado y hora fija 12:00hs
      return `${nombreDia}, ${dia}/${mes}/${anio}, 12:00hs`;
    };

    const formatearFechaEgreso = (fechaString) => {
      if (!fechaString) return "";
      
      const [anio, mes, dia] = fechaString.split('-');
      const fechaObj = new Date(anio, mes - 1, dia);
      
      const nombreDia = obtenerNombreDia(fechaObj);
      
      // Retornamos con el formato solicitado y hora fija 10:00hs
      return `${nombreDia}, ${dia}/${mes}/${anio}, 10:00hs`;
    };

  const seleccionadaReserva = useMemo(() => {
    if (seleccionadoInicio.length === 0) return [];
    if (seleccionadoFin.length === 0) return [seleccionadoInicio];
    const dias = fechasEntreFechas(seleccionadoInicio[0], seleccionadoFin[0]);
    return dias.map(fecha => [fecha, seleccionadoInicio[1]]);
  }, [seleccionadoInicio, seleccionadoFin]);

  const handleAtras = () => {
    setSeleccionadoInicio([]);
    setSeleccionadoFin([]);
    setReservasAcumuladas([]);
  };

  const handleAgregarSeleccion = () => {
    if (seleccionadaReserva.length === 0) return;
    if (seleccionadaReserva.length < 2) {
      mostrarError("La estancia mínima es de 2 días. Selecciona fecha de entrada y salida.");
      return;
    }
    const hayNoDisponibles = seleccionadaReserva.some((item) => {
      const [fecha, idColumna] = item;
      const estadoCelda = ordenarDatos[idColumna]?.estados[fecha];
      return estadoCelda !== 'DISPONIBLE';
    });

    if (hayNoDisponibles) {
      mostrarError("La habitación no se encuentra DISPONIBLE para las fechas seleccionadas.");
      return;
    }
    setReservasAcumuladas((prev) => [...prev, ...seleccionadaReserva]);
    setSeleccionadoInicio([]);
    setSeleccionadoFin([]);
  };

  const enviarDatos = async (e) => {
    setHabitaciones([]);
    e.preventDefault();
    const anioMinimo = 2024;
    const anioDesde = parseInt(fechaDesde.split('-')[0]);
    const anioHasta = parseInt(fechaHasta.split('-')[0]);

    if (anioDesde < anioMinimo || anioHasta < anioMinimo) {
      mostrarError(`Las fechas no pueden ser anteriores al año ${anioMinimo}.`);
      return;
    }
    const dDesde = new Date(fechaDesde);
    const dHasta = new Date(fechaHasta);
    const fechaLimite = new Date(dDesde);
    fechaLimite.setFullYear(fechaLimite.getFullYear() + 1);

    if (dHasta > fechaLimite) {
      mostrarError("El rango de fechas no puede ser mayor a 1 año.");
      return;
    }
    setCargando(true);
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

  const ordenarDatos = useMemo(() => {
    if (!habitaciones) return [];
    const habitacionesOrdenadas = [...habitaciones].sort((a, b) => {
      const dateA = new Date(a.fecha); const dateB = new Date(b.fecha);
      if(dateA - dateB !== 0) return dateA - dateB;
      return parseInt(a.numero) - parseInt(b.numero);
    });
    const columnas = {};
    habitacionesOrdenadas.forEach(h => {
      if (!columnas[h.id]) {
        columnas[h.id] = { id: h.id, tipo: h.tipoHabitacion, numero: h.numero, estados: {} };
      }
      columnas[h.id].estados[h.fecha] = h.estado;
    });
    return columnas;
  }, [habitaciones]);

  const mostrarResultados = () => {
    const columnas = ordenarDatos;
    const fechas = new Set();
    habitaciones.forEach(hab => fechas.add(hab.fecha));
    const fechasArray = Array.from(fechas).sort();

    const manejarClick = (fecha, idColumna) => {
      const esMismoInicio = seleccionadoInicio.length > 0 && seleccionadoInicio[0] === fecha && seleccionadoInicio[1] === idColumna;
      if (esMismoInicio) { setSeleccionadoInicio([]); setSeleccionadoFin([]); return; }
      if (seleccionadoInicio.length === 0) { setSeleccionadoInicio([fecha, idColumna]); } 
      else if (seleccionadoFin.length === 0) {
        if (seleccionadoInicio[1] !== idColumna) { setSeleccionadoInicio([fecha, idColumna]); return; }
        const dInicio = new Date(seleccionadoInicio[0]); const dClick = new Date(fecha);
        if (dClick < dInicio) { setSeleccionadoFin(seleccionadoInicio); setSeleccionadoInicio([fecha, idColumna]); } else { setSeleccionadoFin([fecha, idColumna]); }
      } else { setSeleccionadoInicio([fecha, idColumna]); setSeleccionadoFin([]); }
    };

    const obtenerClaseSeleccion = (f, id, e) => {
      let c = `${styles.celdaEstado} ${styles[`estado${e}`] || ''}`;
      if (reservasAcumuladas.some(i => i[0] === f && i[1] === id)) return `${c} ${styles.estadoAgregado}`;
      if (seleccionadoInicio.length === 0) return c;
      if (seleccionadoInicio[1] !== id) return c;
      const tC = new Date(f).getTime(); const tI = new Date(seleccionadoInicio[0]).getTime();
      if (tC === tI) return `${c} ${styles.seleccionInicio}`;
      if (seleccionadoFin.length === 0) return c;
      const tF = new Date(seleccionadoFin[0]).getTime();
      if (tC === tF) return `${c} ${styles.seleccionFin}`;
      if (tC > tI && tC < tF) return `${c} ${styles.seleccionRango}`;
      return c;
    };

    return (
      <>
        <div className={styles.resultadosContainer}>
          <div className={styles.columnaEstaticaContainer}>
            <div className={styles.celdaTituloEstatico}>Tipo</div><div className={styles.celdaTituloEstatico}>Número</div>
            {fechasArray.map((f, i) => <div key={i} className={styles.celdaFecha}>{formatearFecha(f)}</div>)}
          </div>
          {Object.values(columnas).map((col) => (
            <div key={col.id} className={styles.columnaHabitacion}>
              <div className={styles.celdaHeaderHabitacion} title={col.tipo}>{col.tipo}</div><div className={styles.celdaHeaderNumero}>{col.numero}</div>
              {Object.values(col.estados).map((est, i) => (
                <div key={fechasArray[i]} onClick={() => manejarClick(fechasArray[i], col.id)} className={`${styles.celdaEstado} ${obtenerClaseSeleccion(fechasArray[i], col.id, est)}`}>
                  <p className={`${styles.estado} ${styles[`estado${est}`]}`}>{est}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.botonesRespuestaContainer}>
          <input type="button" value="Atrás" className={styles.btnCancelar} onClick={handleAtras} />
          <input type="button" value="Agregar Selección" className={styles.btnSiguiente} style={{ backgroundColor: "#3b82f6" }} onClick={handleAgregarSeleccion} />
          <input type="button" value={`Confirmar (${reservasAcumuladas.length})`} className={`${styles.btnSiguiente} ${reservasAcumuladas.length === 0 ? styles.desactivado : null}`}
            onClick={() => { setMostrandoLista(true); }} disabled={reservasAcumuladas.length === 0} />
        </div>
      </>
    );
  };

  const enviarReserva = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const camposObligatorios = ["apellido", "nombre", "tipoDocumento", "numeroDocumento", "telefono"];
    const nuevosErrores = {};

    // Validación de vacíos
    camposObligatorios.forEach((campo) => {
      const valor = formData.get(campo);
      if (!valor || valor.toString().trim() === "") {
        // Usamos la primera letra mayúscula para la key del error para coincidir con tu JSX
        const key = campo.charAt(0).toUpperCase() + campo.slice(1);
        nuevosErrores[key] = "Este campo es obligatorio";
      }
    });

    // Validación de letras
    const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;
    const nombreVal = formData.get("nombre");
    if (nombreVal && !regexSoloLetras.test(nombreVal.toString())) nuevosErrores["Nombre"] = "Solo letras y espacios";
    const apellidoVal = formData.get("apellido");
    if (apellidoVal && !regexSoloLetras.test(apellidoVal.toString())) nuevosErrores["Apellido"] = "Solo letras y espacios";

    // Si hay errores, los mostramos y cortamos la ejecución
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    
    // Si pasa, limpiamos errores
    setErrores({});

    const detalles = reservasAcumuladas.map((reserva) => ({ idHabitacion: reserva[1], fecha: reserva[0] }));
    const datos = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      tipoDocumento: formData.get("tipoDocumento"),
      numeroDocumento: formData.get("numeroDocumento"),
      telefono: formData.get("telefono"),
    };
    const payload = { detalles: detalles, datosHuesped: datos };

    setCargando(true); 
    
    try {
      const respuesta = await fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        setModalConfig({
          visible: true, tipo: "exito", titulo: "¡Reserva Exitosa!", mensaje: "La reserva ha sido registrada correctamente.",
          acciones: [{
            texto: "Aceptar", estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              setHabitaciones([]);
              setReservasAcumuladas([]);
              setMostrandoLista(false);
              setMostrandoFormularioHuesped(false);
              setFechaDesde("");
              setFechaHasta("");
              setErrores({}); // Limpiamos errores al finalizar
            }
          }]
        });
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        setModalConfig({
          visible: true, tipo: "error", titulo: "Error al reservar", mensaje: errorData.message || "No se pudo procesar la reserva.",
          acciones: [{ texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal }]
        });
      }
    } catch (e) {
      setModalConfig({
        visible: true, tipo: "error", titulo: "Error de Conexión", mensaje: "No se pudo conectar con el servidor.",
        acciones: [{ texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal }]
      });
    } finally { setCargando(false); }
  }

  const mostrarLista = () => {
    const obtenerFormatoCompleto = (f, h) => { /* ... lógica simplificada ... */ return f ? f.split('-').reverse().join('/') + ' ' + h : '-'; };
    const generarResumenReservas = (lista) => { 
        const agrupado = {}; lista.forEach(i => { if(!agrupado[i[1]]) agrupado[i[1]]=[]; agrupado[i[1]].push(i[0]) });
        return Object.keys(agrupado).map(id => ({Habitacion: ordenarDatos[id].numero, Tipo: ordenarDatos[id].tipo, Ingreso: agrupado[id].sort()[0], Egreso: agrupado[id].sort()[agrupado[id].length-1]}));
    };
    const datosTabla = generarResumenReservas(reservasAcumuladas);

    return (
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        {!mostrandoFormularioHuesped ? (
          <>
            <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '20px' }}>Confirmar Selección ({reservasAcumuladas.length} noches)</h2>
            <div className={styles.listaContainer}>
              <div className={styles.headerLista}>
                <div className={styles.tituloHeaderLista}><h3>Habitacion</h3></div>
                <div className={styles.tituloHeaderLista}><h3>Tipo</h3></div>
                <div className={styles.tituloHeaderLista}><h3>Ingreso</h3></div>
                <div className={styles.tituloHeaderLista}><h3>Egreso</h3></div>
              </div>
              <div className={styles.contenidoListaContainer}>
                {datosTabla.map((fila, index) => (
                  <div key={index} className={styles.filaListaContainer}>
                    <div className={styles.pListaContainer}><p>{fila.Habitacion}</p></div>
                    <div className={styles.pListaContainer}><p>{fila.Tipo}</p></div>
                    <div className={styles.pListaContainer}><p>{formatearFechaIngreso(fila.Ingreso)}</p></div>
                    <div className={styles.pListaContainer}><p>{formatearFechaEgreso(fila.Egreso)}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.botonesListaContainer} style={{ marginTop: '30px' }}>
              <input type="button" value="Volver" className={styles.btnCancelar} onClick={() => setMostrandoLista(false)} />
              {/* --- CORRECCIÓN: Limpiamos errores al entrar al form --- */}
              <input type="button" value="Continuar" className={styles.btnSiguiente} 
                onClick={() => { setMostrandoFormularioHuesped(true); setErrores({}); }} 
              />
            </div>
          </>
        ) : (
          <div className={`${styles.formulario} ${styles.formularioReservaContainer}`}>
          <fieldset className={styles.fieldset}>
            <div className={styles.legend} style={{paddingTop:"20px"}}>Datos del titular</div>
            
            {/* CORRECCIÓN: Quitamos className={styles.fieldset} del form */}
            <form onSubmit={enviarReserva} id="formDatosHuesped" style={{width: '100%'}}>
              <div className={styles.formReservaInputsContainer}>

                <div className={styles.filaInputs}>
                    <div className={styles.inputContainer}>
                    <label>Apellido*</label>
                    <input type="text" name="apellido" placeholder="Apellido" className={`${errores.Apellido ? styles.inputError : ''}`} onInput={(e) => e.target.value = e.target.value.toUpperCase()} onChange={() => setErrores({ ...errores, Apellido: null })} />
                    {errores.Apellido && <span className={styles.mensajeError}>{errores.Apellido}</span>}
                    </div>

                    <div className={styles.inputContainer}>
                    <label>Nombre*</label>
                    <input type="text" name="nombre" placeholder="Nombre" onInput={(e) => e.target.value = e.target.value.toUpperCase()} className={`${errores.Nombre ? styles.inputError : ''}`} onChange={() => setErrores({ ...errores, Nombre: null })} />
                    {errores.Nombre && <span className={styles.mensajeError}>{errores.Nombre}</span>}
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
                    <input type="text" name="numeroDocumento" placeholder="Número" onChange={() => setErrores({ ...errores, NumeroDocumento: null })} className={`${errores.NumeroDocumento ? styles.inputError : ''}`} />
                    {errores.NumeroDocumento && <span className={styles.mensajeError}>{errores.NumeroDocumento}</span>}
                    </div>
                </div>

                <div className={styles.filaInputs}>
                    <div className={styles.inputContainer}>
                    <label>Teléfono*</label>
                    <input type="text" name="telefono" placeholder="Teléfono" onChange={() => setErrores({ ...errores, Telefono: null })} className={`${errores.Telefono ? styles.inputError : ''}`} onInput={soloNumeros} />
                    {errores.Telefono && <span className={styles.mensajeError}>{errores.Telefono}</span>}
                    </div>
                    <div className={styles.inputContainer}></div>
                </div>

              </div>
            </form>
          </fieldset>

            <div className={styles.botonesListaContainer}>
              {/* --- CORRECCIÓN: Limpiamos errores al salir del form --- */}
              <input type="button" value="Atrás" className={styles.btnCancelar} 
                onClick={() => { setMostrandoFormularioHuesped(false); setErrores({}); }} 
              />
              
              <input 
                type="submit" 
                form="formDatosHuesped" 
                value={cargando ? "Enviando..." : "Confirmar Reserva"} 
                className={`${styles.btnSiguiente} ${cargando ? styles.desactivado : ''}`}
                disabled={cargando}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head><title>Reservar Habitación</title></Head>
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
              setHabitaciones([]); setSeleccionadoInicio([]); setSeleccionadoFin([]); setReservasAcumuladas([]);
              setMostrandoLista(false); setFechaDesde(""); setFechaHasta(""); setMostrandoFormularioHuesped(false);
            }}
          />
          <input type="submit" value={cargando ? "Buscando..." : "Buscar"} 
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
            {cargando ? "Buscando..." : "Realice una búsqueda..."}
          </div>
        )}
      </div>

      {modalConfig.visible && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles[modalConfig.tipo]}`}>
            <span className={styles.modalIcon}>{modalConfig.tipo === 'exito' && '✅'}{modalConfig.tipo === 'error' && '⛔'}{modalConfig.tipo === 'advertencia' && '⚠️'}</span>
            <h3 className={styles.modalTitulo}>{modalConfig.titulo}</h3>
            <p className={styles.modalMensaje}>{modalConfig.mensaje}</p>
            <div className={styles.botonesContainer}>
              {modalConfig.acciones && modalConfig.acciones.map((accion, index) => (
                <button key={index} className={`${styles.btnModal} ${styles[accion.estilo]}`} onClick={accion.onClick}>{accion.texto}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}