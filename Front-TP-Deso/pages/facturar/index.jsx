"use client";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Facturar.module.css";
import Modal from "@/components/Modal";
import { buscarOcupantes, emitirFactura } from "@/services/facturacionService";
import { buscarPersonaJuridica } from "@/services/huespedService";

export default function Facturar() {
  const router = useRouter();

  // Estados de Flujo
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);

  // Datos Paso 1 (Búsqueda)
  const [busqueda, setBusqueda] = useState({
    numeroHabitacion: "",
    horaSalida: "",
  });
  const [erroresInput, setErroresInput] = useState({});
  const [ocupantes, setOcupantes] = useState([]);
  const [datosEstadia, setDatosEstadia] = useState(null);
  const inputHabitacionRef = useRef(null);
  const inputHoraRef = useRef(null);

  // Datos Paso 2 (Selección)
  const [seleccionado, setSeleccionado] = useState(null); // ID del ocupante
  const [esTercero, setEsTercero] = useState(false);
  const [cuitTercero, setCuitTercero] = useState("");

  // Datos Paso 3 (Confirmación)
  const [preFactura, setPreFactura] = useState(null);
  const [itemsSeleccionados, setItemsSeleccionados] = useState({});

  // Modal
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones: [],
  });
  const cerrarModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));

  // Helpers
  const aMayusculas = (e) => {
    e.target.value = e.target.value.toUpperCase();
    handleBusquedaChange(e);
  };

  // -----------------------------------------------------
  // PASO 1: BUSCAR HABITACIÓN
  // -----------------------------------------------------
  const handleBusquedaChange = (e) => {
    setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    if (erroresInput[e.target.name])
      setErroresInput({ ...erroresInput, [e.target.name]: null });
  };

  const limpiarFormulario = () => {
    setBusqueda({ numeroHabitacion: "", horaSalida: "" });
    setErroresInput({});
    setOcupantes([]);
    inputHabitacionRef.current?.focus();
  };

  const buscar = async (e) => {
    e.preventDefault();

    // 3.A.1 Validar campos (Errores acumulados)
    // 3.A.1 Validar campos (Errores inline)
    const nuevosErroresInput = {};
    let hayError = false;

    if (!busqueda.numeroHabitacion.trim()) {
      nuevosErroresInput.numeroHabitacion =
        "El número de habitación es obligatorio.";
      hayError = true;
    }
    if (!busqueda.horaSalida.trim()) {
      nuevosErroresInput.horaSalida = "La hora de salida es obligatoria.";
      hayError = true;
    }

    if (hayError) {
      setErroresInput(nuevosErroresInput);
      return;
    }

    setCargando(true);
    try {
      const data = await buscarOcupantes(
        busqueda.numeroHabitacion,
        busqueda.horaSalida
      );
      // El backend ahora devuelve EstadiaDetalleDTO { idEstadia, ocupantes, ... }
      if (data && data.ocupantes) {
        console.log("Data", data);
        setOcupantes(data.ocupantes);
        setDatosEstadia(data);
        setPaso(2);
      } else {
        throw new Error("Formato de respuesta inválido.");
      }
    } catch (error) {
      setModalConfig({
        visible: true,
        tipo: "error",
        titulo: "Error al buscar",
        mensaje: error.message,
        acciones: [
          {
            texto: "Cerrar",
            estilo: "cancelar",
            onClick: () => {
              cerrarModal();
              inputHabitacionRef.current?.focus();
            },
          },
        ],
      });
    } finally {
      setCargando(false);
    }
  };

  // -----------------------------------------------------
  // PASO 2: SELECCIONAR RESPONSABLE
  // -----------------------------------------------------
  const seleccionarResponsable = async () => {
    let responsable = null;
    if (esTercero) {
      // 5.B: Facturar a tercero
      if (!cuitTercero.trim()) {
        // 5.C: CUIT Vacío -> Ejecutar CU03
        setModalConfig({
          visible: true,
          tipo: "advertencia",
          titulo: "CUIT Vacío",
          mensaje:
            "Debe ingresar un CUIT. Si no existe, debe dar de alta al responsable.",
          acciones: [
            { texto: "Cancelar", estilo: "cancelar", onClick: cerrarModal },
            {
              texto: "Ir al Alta",
              estilo: "aceptar",
              onClick: () => router.push("/alta-responsable"),
            },
          ],
        });
        return;
      }

      setCargando(true);
      try {
        const personaJuridica = await buscarPersonaJuridica(cuitTercero);

        // 5.B.2: Mostrar Razón Social y confirmar
        setModalConfig({
          visible: true,
          tipo: "confirmacion",
          titulo: "Confirmar Tercero",
          mensaje: `Razón Social: ${personaJuridica.razonSocial}`,
          acciones: [
            {
              texto: "CANCELAR",
              estilo: "cancelar",
              onClick: cerrarModal, // 5.B.2.2 vuelve al paso 5 (aquí se mantiene en la misma pantalla)
            },
            {
              texto: "ACEPTAR",
              estilo: "aceptar",
              onClick: () => {
                cerrarModal();
                // 5.B.2.1.1: Ir al punto 6 (Generar Pre-Factura en nuestro caso)
                const resp = {
                  ...personaJuridica,
                  nombre: personaJuridica.razonSocial,
                  esPersonaJuridica: true,
                  // Si el DTO no trae posicionIVA, definimos una por defecto o la que traiga
                  posicionIVA:
                    personaJuridica.posicionIVA || "RESPONSABLE_INSCRIPTO",
                  id: personaJuridica.id,
                };
                generarPreFacturaLocal(resp);
              },
            },
          ],
        });
      } catch (error) {
        // No encontrado -> flujo 5.C (Dar alta)
        setModalConfig({
          visible: true,
          type: "advertencia",
          titulo: "No encontrado",
          mensaje:
            "No se encontró el CUIT ingresado. Debe dar de alta al responsable.",
          acciones: [
            { texto: "Cancelar", estilo: "cancelar", onClick: cerrarModal },
            {
              texto: "Ir al Alta",
              estilo: "aceptar",
              onClick: () => router.push("/alta-responsable"),
            },
          ],
        });
      } finally {
        setCargando(false);
      }
      return; // Esperamos acción del modal
    } else {
      // Facturar a ocupante
      if (!seleccionado) {
        setModalConfig({
          visible: true,
          tipo: "advertencia",
          titulo: "No seleccionado",
          mensaje: "Por favor seleccione un ocupante de la lista.",
          acciones: [
            { texto: "Aceptar", estilo: "aceptar", onClick: cerrarModal },
          ],
        });
        return;
      }

      const persona = ocupantes.find((o) => o.id === seleccionado);
      // 5.A: Validación de edad
      const hoy = new Date();
      const nacimiento = new Date(persona.fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

      if (edad < 18) {
        setModalConfig({
          visible: true,
          tipo: "error",
          titulo: "Menor de Edad",
          mensaje: `La persona seleccionada (${persona.nombre}) es menor de edad. Por favor elija otra.`,
          acciones: [
            { texto: "Aceptar", estilo: "aceptar", onClick: cerrarModal },
          ],
        });
        return; // 5.A.2 Vuelve al paso 5
      }
      responsable = {
        ...persona,
        esPersonaJuridica: false,
        // Usamos la posición IVA que viene del ocupante (asumiendo que viene en el objeto)
        // Si no viene, por defecto consumidor final
        posicionIVA: persona.posicionIVA || "CONSUMIDOR_FINAL",
      };
      generarPreFacturaLocal(responsable);
    }
  };

  const generarPreFacturaLocal = (responsable) => {
    // 1. Definir Tipo de Factura
    let tipoFactura = "B";
    if (responsable.posicionIVA === "RESPONSABLE_INSCRIPTO") {
      tipoFactura = "A";
    }

    // 2. Construir Items
    const items = [];

    // Item Estadía
    items.push({
      detalle: "Estadía Habitación",
      monto: datosEstadia.costoBaseEstadia,
      cantidad: 1,
    });

    // Items Servicios
    if (datosEstadia.serviciosConsumidos) {
      datosEstadia.serviciosConsumidos.forEach((serv) => {
        items.push({
          detalle: serv.nombre, // Asumiendo que el servicio tiene nombre y precio
          monto: serv.precio,
          cantidad: 1, // O la cantidad que venga
        });
      });
    }

    // 3. Calcular Totales Iniciales
    const total = items.reduce((acc, item) => acc + item.monto, 0);
    let subtotal = total;
    let iva = 0;

    if (tipoFactura === "A") {
      subtotal = total / 1.21;
      iva = total - subtotal;
    }

    setPreFactura({
      nombreResponsable: responsable.esPersonaJuridica
        ? responsable.nombre
        : `${responsable.apellido} ${responsable.nombre}`,
      cuitResponsable: responsable.cuit || responsable.numeroDocumento || "N/A", // Ojo: Huesped tiene dni, no cuit a veces
      tipoFactura,
      items,
      subtotal,
      iva,
      total,
      idResponsable: responsable.id || 0, // 0 si es tercero nuevo
      esPersonaJuridica: responsable.esPersonaJuridica,
    });

    // Seleccionar todos por defecto
    const seleccionInicial = {};
    items.forEach((_, i) => (seleccionInicial[i] = true));
    setItemsSeleccionados(seleccionInicial);

    setPaso(3);
  };

  // -----------------------------------------------------
  // PASO 3: CONFIRMAR Y FACTURAR
  // -----------------------------------------------------
  const toggleItem = (index) => {
    const nuevaSeleccion = {
      ...itemsSeleccionados,
      [index]: !itemsSeleccionados[index],
    };
    setItemsSeleccionados(nuevaSeleccion);

    // Recalcular totales dinámicamente al cambiar selección
    recalcularTotales(nuevaSeleccion);
  };

  const recalcularTotales = (seleccion) => {
    if (!preFactura) return;

    const itemsActivos = preFactura.items.filter((_, i) => seleccion[i]);
    const nuevoTotal = itemsActivos.reduce((acc, item) => acc + item.monto, 0);

    let nuevoSubtotal = nuevoTotal;
    let nuevoIva = 0;

    if (preFactura.tipoFactura === "A") {
      nuevoSubtotal = nuevoTotal / 1.21;
      nuevoIva = nuevoTotal - nuevoSubtotal;
    }

    setPreFactura((prev) => ({
      ...prev,
      total: nuevoTotal,
      subtotal: nuevoSubtotal,
      iva: nuevoIva,
    }));
  };

  const confirmarFactura = async () => {
    const itemsFinales = preFactura.items.filter(
      (_, i) => itemsSeleccionados[i]
    );

    if (itemsFinales.length === 0) {
      alert("Debe seleccionar al menos un ítem para facturar.");
      // Según CU, si no hay ítems tildados vuelve al paso anterior (Paso 4 del CU -> nuestro paso 2)
      // Pero aquí ya estamos en la pantalla de confirmación, así que solo alertamos.
      return;
    }

    setCargando(true);
    try {
      const payload = {
        fechaEmision: new Date().toISOString().split("T")[0],
        horaEmision: new Date().toTimeString().split(" ")[0],
        iva: "21%",
        montoTotal: preFactura.total,
        tipoMoneda: "PESOS_ARGENTINOS",
        tipo: preFactura.tipoFactura,
        estado: "PENDIENTE",
        idEstadia: datosEstadia.idEstadia,
        idHuesped: !preFactura.esPersonaJuridica
          ? preFactura.idResponsable
          : null,
        idPersonaJuridica: preFactura.esPersonaJuridica
          ? preFactura.idResponsable
          : null,
        lineas: itemsFinales.map((i) => ({
          descripcion: i.detalle,
          precioUnitario: i.monto,
          cantidad: 1,
        })),
        pagos: [],
      };

      await emitirFactura(payload);

      setModalConfig({
        visible: true,
        tipo: "exito",
        titulo: "Factura Generada",
        mensaje: `La factura tipo "${preFactura.tipoFactura}" se generó correctamente.`,
        acciones: [
          {
            texto: "Aceptar",
            estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              router.push("/");
            },
          },
        ],
      });
    } catch (error) {
      setModalConfig({
        visible: true,
        tipo: "error",
        titulo: "Error al facturar",
        mensaje: error.message,
        acciones: [
          { texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal },
        ],
      });
    } finally {
      setCargando(false);
    }
  };

  // --- RENDERIZADO ---
  return (
    <>
      <Head>
        <title>Facturación Check-out</title>
      </Head>
      <Modal {...modalConfig} />

      <div className={styles.contenedorPrincipal}>
        <h2 className={styles.titulo}>Facturación / Check-out</h2>

        {/* --- PANTALLA 1: BUSCADOR --- */}
        {paso === 1 && (
          <form className={styles.formBuscador} onSubmit={buscar}>
            <div className={styles.inputGroup}>
              <label>Número de Habitación</label>
              <input
                type="text"
                name="numeroHabitacion"
                ref={inputHabitacionRef}
                value={busqueda.numeroHabitacion}
                onInput={aMayusculas}
                onChange={handleBusquedaChange}
                className={
                  erroresInput.numeroHabitacion ? styles.inputError : ""
                }
              />
              {erroresInput.numeroHabitacion && (
                <span className={styles.msgError}>
                  {erroresInput.numeroHabitacion}
                </span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label>Hora de Salida</label>
              <input
                type="time"
                name="horaSalida"
                ref={inputHoraRef}
                value={busqueda.horaSalida}
                onChange={handleBusquedaChange}
                className={erroresInput.horaSalida ? styles.inputError : ""}
              />
              {erroresInput.horaSalida && (
                <span className={styles.msgError}>
                  {erroresInput.horaSalida}
                </span>
              )}
            </div>
            <div className={styles.botonesContainer}>
              <input
                type="button"
                value="Cancelar"
                className={`${styles.btnCancelar} ${
                  cargando ? styles.desactivado : ""
                }`}
                onClick={limpiarFormulario}
              />
              <input
                type="submit"
                value={cargando ? "Buscando..." : "BUSCAR"}
                className={`${styles.btnSiguiente} ${
                  cargando ? styles.desactivado : ""
                }`}
                disabled={cargando}
              />
            </div>
          </form>
        )}

        {/* --- PANTALLA 2: SELECCIÓN RESPONSABLE --- */}
        {paso === 2 && (
          <div className={styles.contenedorResponsable}>
            <h3 className={styles.titulo}>Seleccione Responsable de Pago</h3>
            <div className={styles.tablaContainer}>
              <div className={styles.header}>
                <div className={styles.celda}>Apellido y Nombre</div>
                <div className={styles.celda}>Documento</div>
              </div>
              {ocupantes.map((oc) => (
                <div
                  key={oc.id}
                  className={`${styles.fila} ${
                    seleccionado === oc.id && !esTercero
                      ? styles.filaSeleccionada
                      : ""
                  }`}
                  onClick={() => {
                    if (seleccionado === oc.id && !esTercero) {
                      setSeleccionado(null);
                    } else {
                      setSeleccionado(oc.id);
                      setEsTercero(false);
                    }
                  }}
                >
                  <div className={styles.celda}>
                    {oc.apellido} {oc.nombre}
                  </div>
                  <div className={styles.celda}>{oc.numeroDocumento}</div>
                </div>
              ))}
            </div>

            <div className={styles.opcionTercero}>
              <input
                type="radio"
                name="responsable"
                id="optTercero"
                checked={esTercero}
                onChange={() => setEsTercero(true)}
              />
              <label
                htmlFor="optTercero"
                style={{ flex: 1, cursor: "pointer" }}
              >
                Facturar a un Tercero
              </label>
              <input
                type="text"
                placeholder="Ingrese CUIT"
                value={cuitTercero}
                disabled={!esTercero}
                onChange={(e) => setCuitTercero(e.target.value)}
                style={{ padding: "5px" }}
              />
            </div>

            <div className={styles.botonesContainer}>
              <button
                className={`${styles.btnCancelar} ${
                  cargando ? styles.desactivado : ""
                }`}
                onClick={() => {
                  setPaso(1);
                  setSeleccionado(null);
                  setEsTercero(false);
                  setCuitTercero("");
                }}
              >
                Atrás
              </button>
              <button
                className={`${styles.btnSiguiente} ${
                  cargando ? styles.desactivado : ""
                }`}
                onClick={seleccionarResponsable}
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "ACEPTAR"}
              </button>
            </div>
          </div>
        )}

        {/* --- PANTALLA 3: DETALLE Y CONFIRMACIÓN --- */}
        {paso === 3 && preFactura && (
          <div>
            <div className={styles.resumenContainer}>
              <div className={styles.infoResponsable}>
                <p>
                  <strong>Responsable:</strong> {preFactura.nombreResponsable}
                </p>
                <p>
                  <strong>CUIT:</strong> {preFactura.cuitResponsable || "N/A"}
                </p>
                <p>
                  <strong>Tipo Factura:</strong>{" "}
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    {preFactura.tipoFactura}
                  </span>
                </p>
              </div>

              <ul className={styles.listaItems}>
                {preFactura.items.map((item, i) => (
                  <li key={i} className={styles.itemFactura}>
                    <label
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!itemsSeleccionados[i]}
                        onChange={() => toggleItem(i)}
                      />
                      {item.detalle}
                    </label>
                    <span>
                      ${" "}
                      {item.monto.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.totales}>
                <p>
                  Subtotal: $ {preFactura.subtotal?.toLocaleString("es-AR")}
                </p>
                <p>IVA: $ {preFactura.iva?.toLocaleString("es-AR")}</p>
                <p className={styles.totalFinal}>
                  TOTAL: $ {preFactura.total?.toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <div className={styles.botonesContainer}>
              <button
                className={`${styles.btnCancelar} ${
                  cargando ? styles.desactivado : ""
                }`}
                onClick={() => setPaso(2)}
              >
                Atrás
              </button>
              <button
                className={`${styles.btnSiguiente} ${
                  cargando ? styles.desactivado : ""
                }`}
                onClick={confirmarFactura}
                disabled={cargando}
              >
                {cargando ? "Procesando..." : "ACEPTAR Y EMITIR"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
