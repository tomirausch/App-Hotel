import styles from "../../styles/ReservarHabitacion.module.css"
import Head from 'next/head';
import { useState, useMemo } from "react";
import { obtenerEstadoHabitaciones, crearReserva } from "@/services/reservaService";
import { fechasEntreFechas, formatearFecha, obtenerNombreDia, formatearFechaHora } from "@/utils/dates";
import Modal from "@/components/Modal";

export default function ReservarHabitacion() {

  const [habitaciones, setHabitaciones] = useState([]);
  const [seleccionadoInicio, setSeleccionadoInicio] = useState([]);
  const [seleccionadoFin, setSeleccionadoFin] = useState([]);
  const [reservasAcumuladas, setReservasAcumuladas] = useState([]);
  const [mostrandoLista, setMostrandoLista] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [mostrandoFormularioHuesped, setMostrandoFormularioHuesped] = useState(false);
  const [errores, setErrores] = useState({});
  
  const [modalConfig, setModalConfig] = useState({ 
    visible: false, tipo: "", titulo: "", mensaje: "", acciones: [] 
  });

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

  const seleccionadaReserva = useMemo(() => {
    if (seleccionadoInicio.length === 0) return [];
    if (seleccionadoFin.length === 0) return [seleccionadoInicio];
    const dias = fechasEntreFechas(seleccionadoInicio[0], seleccionadoFin[0]);
    return dias.map(fecha => [fecha, seleccionadoInicio[1]]);
  }, [seleccionadoInicio, seleccionadoFin]);

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
    try {
      const data = await obtenerEstadoHabitaciones(fechaDesde, fechaHasta);
      setHabitaciones(data);
    } catch (e) { 
      console.error(e);
      mostrarError("Error al conectar con el servidor.");
    } finally { 
      setCargando(false); 
    }
  };

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

    camposObligatorios.forEach((campo) => {
      const valor = formData.get(campo);
      if (!valor || valor.toString().trim() === "") {
        const key = campo.charAt(0).toUpperCase() + campo.slice(1);
        nuevosErrores[key] = "Este campo es obligatorio";
      }
    });
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
    const payload = { detalles: detalles, datosHuesped: datosHuesped };

    setCargando(true); 
    
    try {
      const respuesta = await crearReserva({ detalles, datosHuesped });
      
      setModalConfig({
          visible: true, tipo: "exito", titulo: "¡Reserva Exitosa!", 
          mensaje: `La reserva se ha creado exitosamente.`,
          acciones: [{
            texto: "Aceptar", estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              setHabitaciones([]); setReservasAcumuladas([]);
              setMostrandoLista(false); setMostrandoFormularioHuesped(false);
              setFechaDesde(""); setFechaHasta(""); setErrores({});
            }
          }]
        });

    } catch (e) {
      setModalConfig({
        visible: true, tipo: "error", titulo: "Error al reservar", mensaje: e.message,
        acciones: [{ texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal }]
      });
    } finally { setCargando(false); }
  }

  const mostrarLista = () => {
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
                    <div className={styles.pListaContainer}><p>{formatearFechaHora(fila.Ingreso, "12:00")}</p></div>
                    <div className={styles.pListaContainer}><p>{formatearFechaHora(fila.Egreso, "10:00")}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.botonesListaContainer} style={{ marginTop: '30px' }}>
              <input type="button" value="Volver" className={styles.btnCancelar} onClick={() => setMostrandoLista(false)} />
              <input type="button" value="Continuar" className={styles.btnSiguiente} 
                onClick={() => { setMostrandoFormularioHuesped(true); setErrores({}); }} 
              />
            </div>
          </>
        ) : (
          <div className={`${styles.formulario} ${styles.formularioReservaContainer}`}>
          <fieldset className={styles.fieldset}>
            <div className={styles.legend} style={{paddingTop:"20px"}}>Datos del titular</div>
            
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
      <Modal {...modalConfig} />
    </>
  )
}