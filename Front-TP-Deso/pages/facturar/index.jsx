"use client";
import Head from "next/head";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Facturar.module.css";
import Modal from "@/components/Modal";
import {
  buscarOcupantes,
  obtenerPreFactura,
  emitirFactura,
} from "@/services/facturacionService";

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
  const inputHabitacionRef = useRef(null);
  const inputHoraRef = useRef(null);

  // Datos Paso 2 (Selección)
  const [ocupantes, setOcupantes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null); // ID del ocupante
  const [esTercero, setEsTercero] = useState(false);
  const [cuitTercero, setCuitTercero] = useState("");

  // Datos Paso 3 (Confirmación)
  const [preFactura, setPreFactura] = useState(null);
  const [itemsSeleccionados, setItemsSeleccionados] = useState({}); // { 0: true, 1: false }

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

  const buscar = async (e) => {
    e.preventDefault();

    // 3.A.1 Validar campos (Errores acumulados)
    const errores = [];
    const nuevosErroresInput = {};

    if (!busqueda.numeroHabitacion.trim()) {
      errores.push("El número de habitación es obligatorio.");
      nuevosErroresInput.numeroHabitacion = true;
    }
    if (!busqueda.horaSalida.trim()) {
      errores.push("La hora de salida es obligatoria.");
      nuevosErroresInput.horaSalida = true;
    }

    if (errores.length > 0) {
      setErroresInput(nuevosErroresInput);
      setModalConfig({
        visible: true,
        type: "error",
        titulo: "Datos Incorrectos",
        // Unimos todos los errores en un solo mensaje
        mensaje: errores.join("\n"),
        acciones: [
          {
            texto: "Entendido",
            estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              // 3.A.2 Foco en el primer campo erróneo
              if (nuevosErroresInput.numeroHabitacion)
                inputHabitacionRef.current?.focus();
              else if (nuevosErroresInput.horaSalida)
                inputHoraRef.current?.focus();
            },
          },
        ],
      });
      return;
    }

    setCargando(true);
    try {
      const data = await buscarOcupantes(
        busqueda.numeroHabitacion,
        busqueda.horaSalida
      );
      setOcupantes(data);
      setPaso(2); // Avanzar
    } catch (error) {
      setModalConfig({
        visible: true,
        type: "error",
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
    if (esTercero) {
      // 5.B: Facturar a tercero
      if (!cuitTercero.trim()) {
        // 5.C: CUIT Vacío -> Ejecutar CU03
        setModalConfig({
          visible: true,
          tipo: "advertencia",
          titulo: "CUIT Vacío",
          mensaje:
            "Debe ingresar un CUIT. Si no existe, debe dar de alta al responsable (CU03).",
          acciones: [
            { texto: "Cancelar", estilo: "cancelar", onClick: cerrarModal },
            {
              texto: "Ir al Alta (CU03)",
              estilo: "aceptar",
              onClick: () => router.push("/alta-responsable"),
            }, // Placeholder
          ],
        });
        return;
      }
    } else {
      // Facturar a ocupante
      if (!seleccionado) {
        alert("Por favor seleccione un ocupante de la lista.");
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
          type: "error",
          titulo: "Menor de Edad",
          mensaje: `La persona seleccionada (${persona.nombre}) es menor de edad. Por favor elija otra.`,
          acciones: [
            { texto: "Aceptar", estilo: "aceptar", onClick: cerrarModal },
          ],
        });
        return; // 5.A.2 Vuelve al paso 5
      }
    }

    // Obtener Pre-Factura (Paso 6)
    setCargando(true);
    try {
      // Si es tercero, idResponsable puede ser 0 o manejado por backend con el CUIT.
      // Aquí asumimos que el backend busca por ID si es persona, o preparamos la lógica.
      // Simplificación: Pasamos el ID del seleccionado si no es tercero.

      // NOTA: Necesitamos el ID de la estadía. Asumimos que viene dentro del objeto 'ocupante'
      // O que el endpoint 'buscarOcupantes' nos devolvió también el ID de la estadía.
      // Ajuste rápido: Usamos el ID del primer ocupante para buscar la estadía en backend
      // (o el backend debería devolver el idEstadia en el paso 1).
      // ASUMIREMOS QUE LA BÚSQUEDA DEL PASO 1 DEVUELVE { ocupantes: [...], idEstadia: 123 }
      // Si tu backend devuelve solo lista, tendrás que ajustar esto.

      // Hack temporal si tu backend devuelve solo lista:
      const idEstadiaRef = ocupantes[0]?.idEstadia || 1; // Ajustar según respuesta real

      const data = await obtenerPreFactura(
        idEstadiaRef,
        esTercero ? 0 : seleccionado, // Si es tercero enviamos 0
        esTercero // flag
      );

      setPreFactura(data);

      // Inicializar checkboxes (todos seleccionados por defecto)
      const inicial = {};
      data.items.forEach((_, i) => (inicial[i] = true));
      setItemsSeleccionados(inicial);

      setPaso(3);
    } catch (error) {
      alert(error.message);
    } finally {
      setCargando(false);
    }
  };

  // -----------------------------------------------------
  // PASO 3: CONFIRMAR Y FACTURAR
  // -----------------------------------------------------
  const toggleItem = (index) => {
    setItemsSeleccionados((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const confirmarFactura = async () => {
    const itemsFinales = preFactura.items.filter(
      (_, i) => itemsSeleccionados[i]
    );

    if (itemsFinales.length === 0) {
      // 9.A: No hay ítems tildados -> Volver
      alert("Debe seleccionar al menos un ítem para facturar.");
      setPaso(2); // Volvemos a seleccionar responsable (o a la pantalla anterior lógica)
      return;
    }

    setCargando(true);
    try {
      const payload = {
        idEstadia: preFactura.idEstadia,
        idResponsable: preFactura.idResponsable,
        esPersonaJuridica: preFactura.esPersonaJuridica,
        items: itemsFinales,
        montoTotal: itemsFinales.reduce((acc, it) => acc + it.monto, 0),
        tipoFactura: preFactura.tipoFactura,
      };

      await emitirFactura(payload);

      setModalConfig({
        visible: true,
        type: "exito",
        titulo: "Factura Emitida",
        mensaje: `La factura tipo "${preFactura.tipoFactura}" se generó correctamente.`,
        acciones: [
          {
            texto: "Aceptar",
            estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              router.push("/");
            }, // Termina el CU
          },
        ],
      });
    } catch (error) {
      setModalConfig({
        visible: true,
        type: "error",
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
            </div>
            <div className={styles.botonesContainer}>
              <input
                type="button"
                value="Cancelar"
                className={styles.btnCancelar}
                onClick={() => router.back()}
              />
              <input
                type="submit"
                value={cargando ? "Buscando..." : "BUSCAR"}
                className={styles.btnSiguiente}
                disabled={cargando}
              />
            </div>
          </form>
        )}

        {/* --- PANTALLA 2: SELECCIÓN RESPONSABLE --- */}
        {paso === 2 && (
          <div>
            <h3>Seleccione Responsable de Pago</h3>
            <table className={styles.tablaOcupantes}>
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Sel</th>
                  <th>Apellido y Nombre</th>
                  <th>Documento</th>
                </tr>
              </thead>
              <tbody>
                {ocupantes.map((oc) => (
                  <tr
                    key={oc.id}
                    className={
                      seleccionado === oc.id && !esTercero
                        ? styles.filaSeleccionada
                        : ""
                    }
                  >
                    <td>
                      <input
                        type="radio"
                        name="responsable"
                        checked={seleccionado === oc.id && !esTercero}
                        onChange={() => {
                          setSeleccionado(oc.id);
                          setEsTercero(false);
                        }}
                      />
                    </td>
                    <td>
                      {oc.apellido} {oc.nombre}
                    </td>
                    <td>{oc.numeroDocumento}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
                Facturar a un Tercero (Empresa/Otro)
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
              <button className={styles.btnCancelar} onClick={() => setPaso(1)}>
                Atrás
              </button>
              <button
                className={styles.btnSiguiente}
                onClick={seleccionarResponsable}
                disabled={cargando}
              >
                ACEPTAR
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
              <button className={styles.btnCancelar} onClick={() => setPaso(2)}>
                Atrás
              </button>
              <button
                className={styles.btnSiguiente}
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
