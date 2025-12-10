"use client";
import Head from "next/head";
import styles from "@/styles/BuscarHuesped.module.css";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { buscarHuespedes } from "@/services/huespedService";
import { validarBusquedaHuesped } from "@/utils/validaciones";
import React from "react";

export default function BuscarHuesped() {
  const [personas, setPersonas] = useState([]);
  const [errorBusqueda, setErrorBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [columnaSeleccionada, setColumnaSeleccionada] = useState("apellido");
  const [orden, setOrden] = useState("asc");
  const [errores, setErrores] = useState({});
  const [idHuesped, setIdHuesped] = useState(null);

  const [filtros, setFiltros] = useState({
    Apellido: "",
    Nombre: "",
    TipoDocumento: "",
    NumeroDocumento: "",
  });

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones: [],
  });

  const cerrarModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));
  const abrirModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: true }));
  };

  const mostrarError = (mensaje) => {
    setModalConfig({
      visible: true,
      type: "error",
      titulo: "Atención",
      mensaje: mensaje,
      acciones: [
        { texto: "Entendido", estilo: "cancelar", onClick: cerrarModal },
      ],
    });
    abrirModal();
  };

  const manejarOrdenamiento = (columna) => {
    console.log("Columna clickeada:", columna);
    setSeleccionado(null);
    if (columnaSeleccionada !== columna) {
      setColumnaSeleccionada(columna);
      setOrden("asc");
      return;
    }
    if (orden === "asc") {
      setOrden("des");
    } else {
      setOrden("asc");
    }
  };

  const personasOrdenadas = useMemo(() => {
    if (!orden || !columnaSeleccionada) {
      return personas;
    }

    const copia = [...personas];

    copia.sort((a, b) => {
      if (columnaSeleccionada === "numeroDocumento") {
        const valA = Number(a[columnaSeleccionada]) || 0;
        const valB = Number(b[columnaSeleccionada]) || 0;
        return orden === "asc" ? valA - valB : valB - valA;
      }

      const valorA = a[columnaSeleccionada]?.toString().toLowerCase() || "";
      const valorB = b[columnaSeleccionada]?.toString().toLowerCase() || "";

      if (valorA < valorB) {
        return orden === "asc" ? -1 : 1;
      }
      if (valorA > valorB) {
        return orden === "asc" ? 1 : -1;
      }
      return 0;
    });

    return copia;
  }, [personas, orden, columnaSeleccionada]);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const buscar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(filtros).forEach((key) => formData.append(key, filtros[key]));

    const validacion = validarBusquedaHuesped(formData);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    setErrores({});

    const params = {
      apellido: filtros.Apellido?.trim(),
      nombre: filtros.Nombre?.trim(),
      tipoDocumento: filtros.TipoDocumento === "-" ? "" : filtros.TipoDocumento,
      numeroDocumento: filtros.NumeroDocumento?.trim(),
    };

    setCargando(true);
    setBusqueda(false);

    try {
      const resultados = await buscarHuespedes(params);
      setPersonas(resultados);
      setBusqueda(true);
      setOrden("asc");
      setColumnaSeleccionada("apellido");
    } catch (error) {
      console.error(error);
      mostrarError(
        "Ocurrió un error al realizar la búsqueda. Intente nuevamente."
      );
      setPersonas([]);
    } finally {
      setCargando(false);
    }
  };

  const cancelarBusqueda = () => {
    setBusqueda(false);
    setPersonas([]);
    setSeleccionado(null);
    setFiltros({
      Apellido: "",
      Nombre: "",
      TipoDocumento: "",
      NumeroDocumento: "",
    });
  };

  const mostrarBusqueda = () => {
    if (busqueda) {
      if (personas.length === 0) {
        return (
          <>
            <h2>No se encontraron resultados para su busqueda</h2>
            <input
              type="button"
              value="Dar alta huesped"
              className={styles.btnSiguiente}
              style={{ marginTop: "10px" }}
              onClick={() => router.push("/dar-alta-huesped")}
            />
          </>
        );
      }
      return (
        <>
          <div className={`${styles.containerPersona} ${styles.header}`}>
            <div className={styles.containerP}>
              <p onClick={() => manejarOrdenamiento("apellido")}>Apellido</p>
              {columnaSeleccionada === "apellido" && (
                <img
                  src={
                    orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"
                  }
                  alt="Orden"
                  style={{ height: "20px", width: "20px" }}
                />
              )}
            </div>

            <div className={styles.containerP}>
              <p onClick={() => manejarOrdenamiento("nombre")}>Nombre</p>
              {columnaSeleccionada === "nombre" && (
                <img
                  src={
                    orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"
                  }
                  alt="Orden"
                  style={{ height: "20px", width: "20px" }}
                />
              )}
            </div>

            <div className={styles.containerP}>
              <p onClick={() => manejarOrdenamiento("tipoDocumento")}>
                Tipo Documento
              </p>
              {columnaSeleccionada === "tipoDocumento" && (
                <img
                  src={
                    orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"
                  }
                  alt="Orden"
                  style={{ height: "20px", width: "20px" }}
                />
              )}
            </div>

            <div className={styles.containerP}>
              <p onClick={() => manejarOrdenamiento("numeroDocumento")}>
                Numero Documento
              </p>
              {columnaSeleccionada === "numeroDocumento" && (
                <img
                  src={
                    orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"
                  }
                  alt="Orden"
                  style={{ height: "20px", width: "20px" }}
                />
              )}
            </div>
          </div>

          {personasOrdenadas.map((persona, index) => (
            <div
              key={index}
              onClick={() => {
                seleccionado === index
                  ? (setSeleccionado(null), setIdHuesped(null))
                  : (setSeleccionado(index), setIdHuesped(persona.id));
              }}
              className={`
              ${styles.containerPersona} 
              ${styles.row} 
              ${seleccionado === index ? styles.seleccionado : ""}
            `}
            >
              <p>{persona.apellido.toUpperCase()}</p>
              <p>{persona.nombre.toUpperCase()}</p>
              <p>{persona.tipoDocumento}</p>
              <p>{persona.numeroDocumento}</p>
            </div>
          ))}
          <input
            type="button"
            value="Siguiente"
            className={styles.btnSiguiente}
            style={{ marginTop: "10px", marginBottom: "10px" }}
            onClick={() => {
              if (seleccionado !== null) {
                const huespedAEditar = personasOrdenadas[seleccionado];
                sessionStorage.setItem(
                  "huespedParaEditar",
                  JSON.stringify(huespedAEditar)
                );
                router.push(`/modificar-huesped?id=${idHuesped}`);
              } else {
                router.push("/dar-alta-huesped");
              }
            }}
          />
        </>
      );
    } else {
      if (errorBusqueda) {
        return (
          <>
            <h2>Ha ocurrido un error.</h2>
          </>
        );
      }
      return (
        <>
          <h2>Realice una busqueda...</h2>
        </>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Buscar Huesped</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/hotel-icon.ico?v=2" />
        <link rel="icon" href="/hotel-icon.ico?v=2" />
      </Head>

      <div className={styles.containerForm}>
        <form className={styles.formulario} id="formulario" onSubmit={buscar}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Ingrese los datos del huésped
            </legend>
            <div className={styles.containerAllInputs}>
              <div className={styles.containerInput}>
                <label htmlFor="Apellido">Apellido</label>
                <input
                  type="text"
                  name="Apellido"
                  value={filtros.Apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className={errores.Apellido ? styles.inputError : ""}
                />
                {errores.Apellido && (
                  <span className={styles.mensajeError}>
                    {errores.Apellido}
                  </span>
                )}
              </div>

              <div className={styles.containerInput}>
                <label htmlFor="Nombre">Nombre</label>
                <input
                  type="text"
                  name="Nombre"
                  value={filtros.Nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className={errores.Nombre ? styles.inputError : ""}
                />
                {errores.Nombre && (
                  <span className={styles.mensajeError}>{errores.Nombre}</span>
                )}
              </div>

              <div className={styles.containerInput}>
                <label htmlFor="TipoDocumento">Tipo Documento</label>
                <select
                  name="TipoDocumento"
                  value={filtros.TipoDocumento}
                  onChange={handleChange}
                >
                  <option value="">-</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="LE">LE</option>
                  <option value="LC">LC</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className={styles.containerInput}>
                <label htmlFor="NumeroDocumento">Numero Documento</label>
                <input
                  type="text"
                  name="NumeroDocumento"
                  value={filtros.NumeroDocumento}
                  onChange={handleChange}
                  placeholder="Numero Documento"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>

      <div>
        <fieldset
          className={`${styles.formButtons} ${styles.fieldset}`}
          disabled={cargando}
        >
          <input
            type="button"
            value="Cancelar"
            className={`${styles.btnCancelar} ${
              cargando ? styles.desactivado : null
            }`}
            onClick={() => {
              cancelarBusqueda();
              setErrores({});
            }}
          />
          <input
            type="submit"
            value={cargando ? "Buscando..." : "Buscar"}
            form="formulario"
            className={`${styles.btnSiguiente} ${
              cargando ? styles.desactivado : null
            }`}
            disabled={cargando}
            onClick={() => setSeleccionado(null)}
          />
        </fieldset>
      </div>

      <div className={styles.containerResponse}>{mostrarBusqueda()}</div>
    </>
  );
}
