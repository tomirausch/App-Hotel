import styles from "../../styles/OcuparHabitacion.module.css"
import Head from 'next/head';
import { useState, useMemo } from "react";
import { useRouter } from "next/router"; // Agregado para redirecciones si hace falta

export default function OcuparHabitacion() {
  const router = useRouter();
  let endpoint;

  // --- ESTADOS ORIGINALES ---
  const [habitaciones, setHabitaciones] = useState([]);
  const [seleccionadoInicio, setSeleccionadoInicio] = useState([]);
  const [seleccionadoFin, setSeleccionadoFin] = useState([]);
  const [reservasAcumuladas, setReservasAcumuladas] = useState([]);
  const [mostrandoLista, setMostrandoLista] = useState(false);
  const [mostrandoFormularioHuesped, setMostrandoFormularioHuesped] = useState(false);
  const [errores, setErrores] = useState();
  const [cargando, setCargando] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [modalConfig, setModalConfig] = useState({ 
    visible: false, tipo: "", titulo: "", mensaje: "", acciones: [] 
  });

  // --- NUEVOS ESTADOS PARA BÚSQUEDA DE HUÉSPED ---
  const [huespedesEncontrados, setHuespedesEncontrados] = useState([]);
  const [huespedSeleccionado, setHuespedSeleccionado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [columnaHuesped, setColumnaHuesped] = useState("apellido");
  const [ordenHuesped, setOrdenHuesped] = useState("asc");

  const [acompananteEncontrado, setAcompananteEncontrado] = useState({});
  const [acompanantes, setAcompanantes] = useState([]);

  const [buscando, setBuscando] = useState("huesped");

  // --- HELPERS ORIGINALES ---
  const cerrarModal = () => setModalConfig(prev => ({ ...prev, visible: false }));
  
  const mostrarError = (mensaje) => {
    setModalConfig({
      visible: true, type: "error", titulo: "No se puede ocupar", mensaje: mensaje,
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

  // --- LÓGICA DE SELECCIÓN HABITACIONES (Original) ---
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
      if (!columnas[h.id]) { columnas[h.id] = { id: h.id, tipo: h.tipoHabitacion, numero: h.numero, estados: {} }; }
      columnas[h.id].estados[h.fecha] = h.estado;
    });
    return columnas;
  }, [habitaciones]);

  // --- LÓGICA DE ORDENAMIENTO HUÉSPEDES (Traída de BuscarHuesped) ---
  const manejarOrdenamientoHuesped = (columna) => {
    if (buscando === "huesped") setHuespedSeleccionado(null); // Deseleccionar al reordenar
    if (columnaHuesped !== columna) {
      setColumnaHuesped(columna);
      setOrdenHuesped("asc");
    } else {
      setOrdenHuesped(ordenHuesped === "asc" ? "des" : "asc");
    }
  };

  const huespedesOrdenados = useMemo(() => {
    if (!ordenHuesped || !columnaHuesped) return huespedesEncontrados;
    const copia = [...huespedesEncontrados];
    copia.sort((a, b) => {
      const valorA = a[columnaHuesped]?.toString().toLowerCase() || "";
      const valorB = b[columnaHuesped]?.toString().toLowerCase() || "";
      if (valorA < valorB) return ordenHuesped === "asc" ? -1 : 1;
      if (valorA > valorB) return ordenHuesped === "asc" ? 1 : -1;
      return 0;
    });
    return copia;
  }, [huespedesEncontrados, ordenHuesped, columnaHuesped]);

  // --- HANDLERS ACCIONES ---
  const handleAtras = () => { setSeleccionadoInicio([]); setSeleccionadoFin([]); setReservasAcumuladas([]);}

  const handleAgregarSeleccion = () => {
    if (seleccionadaReserva.length === 0) return;
    if (seleccionadaReserva.length < 2) { mostrarError("La estancia mínima es de 2 días (una noche)."); return; }
    
    let hayBloqueo = false; let hayReserva = false;
    seleccionadaReserva.forEach((item) => {
      const [fecha, idColumna] = item;
      const estadoCelda = ordenarDatos[idColumna]?.estados[fecha];
      if (['OCUPADA', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'].includes(estadoCelda)) hayBloqueo = true;
      if (estadoCelda === 'RESERVADA') hayReserva = true;
    });

    if (hayBloqueo) { mostrarError("Seleccionaste fechas no disponibles."); return; }

    const ejecutarAgregar = () => {
        setReservasAcumuladas((prev) => [...prev, ...seleccionadaReserva]);
        setSeleccionadoInicio([]); setSeleccionadoFin([]); cerrarModal();
    };

    if (hayReserva) {
        setModalConfig({
            visible: true, tipo: "advertencia", titulo: "Habitación Reservada",
            mensaje: "¿Desea realizar la ocupación sobre una reserva existente?",
            acciones: [
                { texto: "Cancelar", estilo: "cancelar", onClick: cerrarModal },
                { texto: "Ocupar Igual", estilo: "aceptar", onClick: ejecutarAgregar }
            ]
        });
        return;
    }
    ejecutarAgregar();
  };

  // --- API CALLS ---
  const enviarDatos = async (e) => {
    setHabitaciones([]); e.preventDefault(); 
    // --- INICIO VALIDACIONES DE FECHA ---
    
    // 1. Validar que no sean menores a 2024
    const anioMinimo = 2024;
    const anioDesde = parseInt(fechaDesde.split('-')[0]); // Extrae el año 'YYYY'
    const anioHasta = parseInt(fechaHasta.split('-')[0]);

    if (anioDesde < anioMinimo || anioHasta < anioMinimo) {
      mostrarError(`Las fechas no pueden ser anteriores al año ${anioMinimo}.`);
      return;
    }

    // 2. Validar rango máximo de 1 año
    const dDesde = new Date(fechaDesde);
    const dHasta = new Date(fechaHasta);
    
    // Calculamos la fecha límite (1 año después de la fecha de inicio)
    const fechaLimite = new Date(dDesde);
    fechaLimite.setFullYear(fechaLimite.getFullYear() + 1);

    if (dHasta > fechaLimite) {
      mostrarError("El rango de fechas no puede ser mayor a 1 año.");
      return;
    }
    // --- FIN VALIDACIONES DE FECHA ---
    setCargando(true);
    setSeleccionadoInicio([]); setSeleccionadoFin([]); setReservasAcumuladas([]); setMostrandoLista(false);
    const formData = new FormData(e.target);
    const datos = { Desde: formData.get('Desde'), Hasta: formData.get('Hasta') };
    try {
      const respuesta = await fetch(`http://localhost:8080/api/habitaciones/estado?desde=${datos.Desde}&hasta=${datos.Hasta}`);
      if (respuesta.ok) setHabitaciones(await respuesta.json());
    } catch (e) { console.log(e); } finally { setCargando(false); }
  };

  // --- NUEVO: BUSCAR HUÉSPED ---
  const buscarHuespedEnBD = async (e) => {
    e.preventDefault();
    setCargando(true);
    if(buscando == "huesped") setHuespedSeleccionado(null);
    setBusquedaRealizada(false);

    const formData = new FormData(e.target);
    const tipoDoc = formData.get('tipoDocumento');
    const numDoc = formData.get('numeroDocumento').trim();
    if (buscando === "acompañante") {
      const camposObligatorios = ["tipoDocumento","numeroDocumento"];
      const nuevosErrores = {};
      console.log(camposObligatorios);
      camposObligatorios.forEach((campo) => {
        const valor = formData.get(campo);
        if (!valor || valor.toString().trim() === "") {
          nuevosErrores[campo] = "Este campo es obligatorio";
        }
      });

      if (Object.keys(nuevosErrores).length > 0) {
        console.log("ERRORES: ", nuevosErrores);
        setErrores(nuevosErrores);
        setCargando(false);
        return;
      }
      setErrores({});
    }

    // Construir Query
    const params = new URLSearchParams();
    let endpoint;
    if (buscando == "huesped") {
      const apellido = formData.get('apellido').trim();
      const nombre = formData.get('nombre').trim();

      // Validaciones simples
      const regexLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
      if (!regexLetras.test(apellido) || !regexLetras.test(nombre)) {
          alert("Nombre y Apellido solo letras."); setCargando(false); return;
      }

      if (apellido) params.append("apellido", apellido);
      if (nombre) params.append("nombre", nombre);
      if (tipoDoc && tipoDoc !== "-") params.append("tipoDocumento", tipoDoc);
      if (numDoc) params.append("numeroDocumento", numDoc);
      endpoint = `http://localhost:8080/api/huespedes/buscar?${params.toString()}`;
    } else {
      if (tipoDoc && tipoDoc !== "-") params.append("tipoDoc", tipoDoc);
      if (numDoc) params.append("numeroDoc", numDoc);
      endpoint = `http://localhost:8080/api/huespedes/acompanantes/buscar?${params.toString()}`;
    }

    try {
        const res = await fetch(endpoint);
        if(res.ok) {
            if(buscando==="huesped"){
              setHuespedesEncontrados(await res.json());
            } else {
              setAcompananteEncontrado(await res.json());
            }
            setBusquedaRealizada(true);
        }
    } catch(err) { console.error(err); } finally { setCargando(false); }
  };

  // --- NUEVO: CONFIRMAR OCUPACIÓN FINAL ---
  // --- CONFIRMAR OCUPACIÓN (JSON ESTRUCTURADO) ---
  const finalizarOcupacion = async () => {
    // 1. Validación básica
    if (!huespedSeleccionado) {
      mostrarError("Error: No hay un huésped titular seleccionado.");
      return;
    }

    // 2. Armar la lista de detalles recuperando info del estado 'habitaciones'
    const detalles = reservasAcumuladas.map((reserva) => {
      const fechaStr = reserva[0]; // Fecha "YYYY-MM-DD"
      const idHab = reserva[1]; // ID Habitación

      // Buscamos el objeto original en el array 'habitaciones' para sacar los datos faltantes
      // (estado, idReserva, idHuespedResponsableReserva)
      const infoOriginal = habitaciones.find(
        (h) => h.id === idHab && h.fecha === fechaStr
      );
      return {
        idHabitacion: idHab,
        fecha: fechaStr,
        // Usamos el operador ?. y || para manejar posibles nulos de forma segura
        estado: infoOriginal?.estado || "DISPONIBLE",
        idReserva: infoOriginal?.idReserva || null,
        idHuespedResponsableReserva:
          infoOriginal?.idHuespedResponsable || null,
      };
    });

    // 3. Armar el Payload Final
    const payload = {
      idHuespedResponsableEstadia: huespedSeleccionado.id,
      listaAcompanantes: acompanantes.map((a) => a.id), // Solo enviamos el array de IDs
      detalles: detalles,
    };

    // Debug: Para ver en consola que el JSON está bien formado antes de enviar
    console.log("JSON a enviar:", JSON.stringify(payload, null, 2));

     // 4. Envío a la API
    setCargando(true);
    try {
      const respuesta = await fetch("http://localhost:8080/api/estadias/ocupar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        setModalConfig({
          visible: true,
          tipo: "exito",
          titulo: "¡Check-in Exitoso!",
          mensaje: "La ocupación ha sido registrada correctamente.",
          acciones: [
            {
              texto: "Aceptar",
              estilo: "aceptar",
              onClick: () => {
                cerrarModal();
                // Reseteamos todo el flujo a cero
                setHabitaciones([]);
                setReservasAcumuladas([]);
                setMostrandoLista(false);
                setMostrandoFormularioHuesped(false);
                setFechaDesde("");
                setFechaHasta("");
                setSeleccionadoInicio([]);
                setSeleccionadoFin([]);
                setHuespedesEncontrados([]);
                setHuespedSeleccionado(null);
                setBusquedaRealizada(false);
                setAcompanantes([]);
                setAcompananteEncontrado({});
                setBuscando("huesped");
              },
            },
          ],
        });
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        mostrarError(errorData.message || "Error al procesar la ocupación.");
      }
    } catch (e) {
      mostrarError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    } 
  };

  // --- RENDERS ---
  const mostrarLista = () => { /* ...Código original de Resumen Habitación... */
    const obtenerFormatoCompleto = (f, h) => { /* ... */ return f; }; // Simplificado para ahorrar espacio
    const generarResumen = (lista) => { /* Lógica original que ya tenías */ 
        const agrupado = {}; lista.forEach(i => { if(!agrupado[i[1]]) agrupado[i[1]]=[]; agrupado[i[1]].push(i[0]) });
        return Object.keys(agrupado).map(id => ({Habitacion: ordenarDatos[id].numero, Tipo: ordenarDatos[id].tipo, Ingreso: agrupado[id].sort()[0], Egreso: agrupado[id].sort()[agrupado[id].length-1]}));
    };
    const datosTabla = generarResumen(reservasAcumuladas);

    return (
      <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
        {!mostrandoFormularioHuesped ? (
          <>
            <div className={styles.listaContainer}>
              <div
                className={styles.headerLista}
                style={{ gridTemplateColumns: "0.5fr 2fr 1fr 1fr" }}
              >
                <div>Habitación</div>
                <div>Tipo</div>
                <div>Ingreso</div>
                <div>Egreso</div>
              </div>
              <div className={styles.contenidoListaContainer}>
                {datosTabla.map((fila, i) => (
                  <div
                    key={i}
                    className={styles.filaListaContainer}
                    style={{ gridTemplateColumns: "0.5fr 2fr 1fr 1fr" }}
                  >
                    <div>{fila.Habitacion}</div>
                    <div>{fila.Tipo}</div>
                    <div>{formatearFecha(fila.Ingreso)}</div>
                    <div>{formatearFecha(fila.Egreso)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.botonesListaContainer}>
              <input
                type="button"
                value="Volver"
                className={styles.btnCancelar}
                onClick={() => {
                  setMostrandoLista(false);
                  setBuscando("huesped");
                }}
              />
              <input
                type="button"
                value="Continuar al Check-in"
                className={styles.btnSiguiente}
                style={{ backgroundColor: "#22c55e" }}
                onClick={() => setMostrandoFormularioHuesped(true)}
              />
            </div>
          </>
        ) : (
          <div className={styles.formularioReservaContainer}>
            <div className={styles.cardFormulario}>
              {buscando === "huesped" ? (
                <>
              <h3 className={styles.legend}>Buscar Huésped Titular</h3>
              <form onSubmit={buscarHuespedEnBD} id="formBuscarHuesped">
                <div className={styles.formReservaInputsContainer}>
                  <div className={styles.filaInputs}>
                    <div className={styles.inputContainer}>
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        onInput={(e) =>
                          (e.target.value = e.target.value.toUpperCase())
                        }
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <label>Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        onInput={(e) =>
                          (e.target.value = e.target.value.toUpperCase())
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.filaInputs}>
                    <div className={styles.inputContainer}>
                      <label>Tipo Doc.</label>
                      <select name="tipoDocumento">
                        <option value="-">-</option>
                        <option value="DNI">DNI</option>
                        <option value="PASAPORTE">Pasaporte</option>
                        <option value="LE">LE</option>
                        <option value="LC">LC</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                    <div className={styles.inputContainer}>
                      <label>Nro. Documento</label>
                      <input
                        type="text"
                        name="numeroDocumento"
                        placeholder="Número"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    <input
                      type="button"
                      value="Atrás"
                      className={styles.btnCancelar}
                      onClick={() => {
                        setMostrandoFormularioHuesped(false);
                        setHuespedSeleccionado(null);
                        setBusquedaRealizada(false);
                        setBuscando("huesped");
                      }}
                    />
                    <input
                      type="submit"
                      value={cargando ? "Buscando..." : "BUSCAR"}
                      className={styles.btnSiguiente}
                      disabled={cargando}
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                </div>
              </form>         
              {busquedaRealizada && (
                <div
                  className={styles.listaContainer}
                  style={{ marginTop: "20px"}}
                >
                  {huespedesEncontrados.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <p>No se encontraron huéspedes.</p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={styles.headerLista}
                        style={{
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          textAlign: "center",
                        }}
                      >
                        <div
                          className={styles.containerP}
                          style={{ cursor: "pointer" }}
                          onClick={() => manejarOrdenamientoHuesped("apellido")}
                        >
                          Apellido
                          {columnaHuesped === "apellido" && (
                            <img
                              src={
                                ordenHuesped === "asc"
                                  ? "/flecha-arriba.png"
                                  : "/flecha-abajo.png"
                              }
                              alt="Orden"
                              style={{
                                height: "20px",
                                width: "20px",
                                filter: "invert(1)",
                              }}
                            />
                          )}
                        </div>
                        <div
                          className={styles.containerP}
                          style={{ cursor: "pointer" }}
                          onClick={() => manejarOrdenamientoHuesped("nombre")}
                        >
                          Nombre
                          {columnaHuesped === "nombre" && (
                            <img
                              src={
                                ordenHuesped === "asc"
                                  ? "/flecha-arriba.png"
                                  : "/flecha-abajo.png"
                              }
                              alt="Orden"
                              style={{
                                height: "20px",
                                width: "20px",
                                filter: "invert(1)",
                              }}
                            />
                          )}
                        </div>
                        <div
                          className={styles.containerP}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            manejarOrdenamientoHuesped("tipoDocumento")
                          }
                        >
                          Tipo Documento
                          {columnaHuesped === "tipoDocumento" && (
                            <img
                              src={
                                ordenHuesped === "asc"
                                  ? "/flecha-arriba.png"
                                  : "/flecha-abajo.png"
                              }
                              alt="Orden"
                              style={{
                                height: "20px",
                                width: "20px",
                                filter: "invert(1)",
                              }}
                            />
                          )}
                        </div>
                        <div
                          className={styles.containerP}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            manejarOrdenamientoHuesped("numeroDocumento")
                          }
                        >
                          Numero Documento
                          {columnaHuesped === "numeroDocumento" && (
                            <img
                              src={
                                ordenHuesped === "asc"
                                  ? "/flecha-arriba.png"
                                  : "/flecha-abajo.png"
                              }
                              alt="Orden"
                              style={{
                                height: "20px",
                                width: "20px",
                                filter: "invert(1)",
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles.contenidoListaContainer}>
                        {huespedesOrdenados.map((h) => (
                          <div
                            key={h.id}
                            className={`${styles.filaListaContainer} ${
                              huespedSeleccionado?.id === h.id &&
                              styles.seleccionado
                            }`}
                            style={{
                              gridTemplateColumns: "1fr 1fr 1fr 1fr",
                              cursor: "pointer",
                            }}
                            onClick={() => setHuespedSeleccionado(h)}
                          >
                            <div className={styles.pListaContainer}>
                              <p>{h.apellido.toUpperCase()}</p>
                            </div>
                            <div className={styles.pListaContainer}>
                              <p>{h.nombre.toUpperCase()}</p>
                            </div>
                            <div className={styles.pListaContainer}>
                              <p>{h.tipoDocumento}</p>
                            </div>
                            <div className={styles.pListaContainer}>
                              <p>{h.numeroDocumento}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              </>
              ) : (
                <>
                <h3 className={styles.legend}>Buscar Acompañante</h3>
                <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{textAlign:'center', color:'whitesmoke', marginBottom:'15px', padding:'10px', borderLeft:'10px solid whitesmoke', width: "30%", borderRadius: "5px"}}>
                    Titular: <b>{huespedSeleccionado.apellido.toUpperCase()} {huespedSeleccionado.nombre.toUpperCase()}</b> <br/>
                    <small>{huespedSeleccionado.tipoDocumento}: {huespedSeleccionado.numeroDocumento}</small>
                </div>
                </div>

              <form onSubmit={buscarHuespedEnBD} id="formBuscarHuesped">
                <div className={styles.formReservaInputsContainer}>
                  <div className={styles.filaInputs}>
                  </div>
                  <div className={styles.filaInputs}>
                    <div className={styles.inputContainer}>
                      <label>Tipo Doc.</label>
                      <select name="tipoDocumento">
                        <option value="DNI">DNI</option>
                        <option value="PASAPORTE">Pasaporte</option>
                        <option value="LE">LE</option>
                        <option value="LC">LC</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div> 
                    <div className={`${styles.inputContainer}`}>
                      <label>Nro. Documento</label>
                      <input
                        type="text"
                        name="numeroDocumento"
                        placeholder="Número"
                        className={errores.numeroDocumento ? styles.inputError : ''}
                        onChange={() => setErrores({...errores, numeroDocumento: null})}/>
                      {errores.numeroDocumento && <span className={styles.mensajeError}>{errores.numeroDocumento}</span>}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    <input
                      type="button"
                      value="Atrás"
                      className={styles.btnCancelar}
                      onClick={() => {
                        setMostrandoFormularioHuesped(false);
                        setHuespedSeleccionado(null);
                        setBusquedaRealizada(false);
                        setBuscando("huesped");
                        setAcompananteEncontrado({});
                        setAcompanantes([]);
                      }}
                    />
                    <input
                      type="submit"
                      value={cargando ? "Buscando..." : "BUSCAR"}
                      className={styles.btnSiguiente}
                      disabled={cargando}
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                  
                    {Object.keys(acompananteEncontrado).length > 0 && (
                      <div style={{color: "whitesmoke", display: "flex", justifyContent: "center"}}>
                        Encontrado: {acompananteEncontrado.nombre} {acompananteEncontrado.apellido}
                      </div>
                    )}

                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center"}}>
                      Acompañantes agregados:
                      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "5px"}}>
                        {acompanantes.map((acompanante)=>(
                          <p key={acompanante.id}>{acompanante.nombre} {acompanante.apellido}</p>
                        ))}
                      </div>
                    </div>

                    <div style={{display: "flex", justifyContent: "center", gap: "20px"}}>
                    <input
                      type="button"
                      value="Agregar acompañante"
                      className={`${styles.btnBase} ${Object.keys(acompananteEncontrado).length === 0 ? styles.desactivado : ''}`}
                      style={{backgroundColor: "blue"}}
                      onClick={() => {
                          if(!acompanantes.some(a => a.id === acompananteEncontrado.id)){
                          setAcompanantes([...acompanantes, acompananteEncontrado]);
                          }
                          document.getElementById("formBuscarHuesped").reset();
                          setAcompananteEncontrado({});
                      }}
                      disabled={Object.keys(acompananteEncontrado).length === 0}
                    />

                    <input
                      type="button"
                      value="Confirmar"
                      className={`${styles.btnSiguiente} ${Object.keys(acompanantes).length === 0 ? styles.desactivado : ''}`}
                      onClick={() => {finalizarOcupacion()}}
                      disabled={Object.keys(acompanantes).length === 0}
                    />
                    </div>

                </div>
              </form>  
                </>
              )}

              {/* 3. BOTONERA FINAL (Confirmar Ocupación) */}
              <div
                className={styles.botonesListaContainer}
                style={{ marginTop: "30px", marginBottom: "0" }}
              >
                <h3>{(!huespedSeleccionado && acompananteEncontrado == {}) ? "Seleccione el huésped titular" : ""}</h3>
                {(huespedSeleccionado && buscando == "huesped")&& (
                  <>
                    <input
                      type="button"
                      value="Cargar Acompañante"
                      className={styles.btnBase}
                      style={{ backgroundColor: "#3b82f6" }}
                      onClick={() => {setBuscando("acompañante");}}
                    ></input>
                    <input
                      type="button"
                      value={cargando ? "Procesando..." : "CONFIRMAR OCUPACIÓN"}
                      className={`${styles.btnSiguiente} ${
                        !huespedSeleccionado || cargando
                          ? styles.desactivado
                          : ""
                      }`}
                      onClick={() => {finalizarOcupacion()}}
                      disabled={!huespedSeleccionado || cargando}
                      style={{ backgroundColor: "#22c55e" }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const mostrarResultados = () => {
    const columnas = ordenarDatos;
    const fechas = new Set(); habitaciones.forEach(hab => fechas.add(hab.fecha));
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
        let c = `${styles.celdaEstado} ${styles[`estado${e}`]||''}`;
        if(reservasAcumuladas.some(i=>i[0]===f && i[1]===id)) return `${c} ${styles.estadoAgregado}`;
        if(seleccionadoInicio.length===0) return c; if(seleccionadoInicio[1]!==id) return c;
        const tC=new Date(f).getTime(); const tI=new Date(seleccionadoInicio[0]).getTime();
        if(tC===tI) return `${c} ${styles.seleccionInicio}`;
        if(seleccionadoFin.length===0) return c; const tF=new Date(seleccionadoFin[0]).getTime();
        if(tC===tF) return `${c} ${styles.seleccionFin}`;
        if(tC>tI && tC<tF) return `${c} ${styles.seleccionRango}`;
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
          <input type="button" value={`Confirmar Ocupación (${reservasAcumuladas.length})`} className={`${styles.btnSiguiente} ${reservasAcumuladas.length === 0 ? styles.desactivado : null}`}
            style={{backgroundColor: '#22c55e'}} onClick={() => { setMostrandoLista(true); }} disabled={reservasAcumuladas.length === 0} />
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
        {!mostrandoFormularioHuesped && (
          <form
            onSubmit={enviarDatos}
            className={styles.formulario}
            id="formulario"
          >
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
        )}

        {!mostrandoFormularioHuesped && (
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
                setFechaDesde("");
                setFechaHasta("");
                setMostrandoFormularioHuesped(false);
              }}
            />
            <input
              type="submit"
              value={cargando ? "Buscando..." : "Buscar Disponibilidad"}
              disabled={
                cargando ||
                !fechaDesde ||
                !fechaHasta ||
                fechaDesde === fechaHasta ||
                fechaHasta < fechaDesde
              }
              form="formulario"
              className={`${styles.btnSiguiente} ${
                cargando ||
                !fechaDesde ||
                !fechaHasta ||
                fechaDesde === fechaHasta ||
                fechaHasta < fechaDesde
                  ? styles.desactivado
                  : null
              }`}
              onClick={() => {
                setSeleccionadoInicio([]);
                setSeleccionadoFin([]);
                setReservasAcumuladas([]);
                setMostrandoLista(false);
              }}
            />
          </div>
        )}

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
            <span className={styles.modalIcon}>
              {modalConfig.tipo === "exito" && "✅"}
              {modalConfig.tipo === "error" && "⛔"}
              {modalConfig.tipo === "advertencia" && "⚠️"}
            </span>
            <h3 className={styles.modalTitulo}>{modalConfig.titulo}</h3>
            <p className={styles.modalMensaje}>{modalConfig.mensaje}</p>
            <div className={styles.botonesContainer}>
              {modalConfig.acciones &&
                modalConfig.acciones.map((accion, index) => (
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
  );
} 