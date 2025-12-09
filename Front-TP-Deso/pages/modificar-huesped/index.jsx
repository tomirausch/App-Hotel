"use client";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/styles/DarAltaHuesped.module.css";
import Modal from "@/components/Modal";
import {
  actualizarHuesped,
  eliminarHuesped,
  buscarHuespedes,
  obtenerHuespedPorId,
} from "@/services/huespedService";
import { cargarPaises } from "@/services/paisService";
import { validarHuesped } from "@/utils/validaciones";
import { mapearHuespedParaApi } from "@/utils/mappers";
import React from "react";

export default function ModificarHuesped() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idUrl = searchParams.get("id");

  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    TipoDocumento: "DNI",
    NumeroDocumento: "",
    FechaNacimiento: "",
    Email: "",
    NumeroTelefono: "",
    Ocupacion: "",
    Nacionalidad: "",
    Calle: "",
    Numero: "",
    Departamento: "",
    Piso: "",
    CP: "",
    Localidad: "",
    Provincia: "",
    Pais: "",
    PosicionIVA: "ConsumidorFinal",
    CUIT: "",
  });

  const [idHuesped, setIdHuesped] = useState(null);
  const [errores, setErrores] = useState({});
  const [listaPaises, setListaPaises] = useState([]);

  const [enviando, setEnviando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const tipoDocRef = useRef(null);

  const aMayusculas = (e) => {
    e.target.value = e.target.value.toUpperCase();
    handleChange(e);
  };
  const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    handleChange(e);
  };

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones: [],
  });
  const cerrarModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));
  const abrirModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: true }));

  const mostrarErrorGenerico = (msg = "Ha ocurrido un error inesperado") => {
    setModalConfig({
      tipo: "error",
      titulo: "Error",
      mensaje: msg,
      acciones: [{ texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal }],
    });
    abrirModal();
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const paises = await cargarPaises();
        setListaPaises(paises);

        let huesped = null;
        const dataStorage = sessionStorage.getItem("huespedParaEditar");

        if (dataStorage) {
          huesped = JSON.parse(dataStorage);
        } else if (idUrl) {
          huesped = await obtenerHuespedPorId(idUrl);
        } else {
          router.push("/buscar-huesped");
          return;
        }

        if (huesped) {
          setIdHuesped(huesped.id);
          setFormData({
            Nombre: huesped.nombre || "",
            Apellido: huesped.apellido || "",
            TipoDocumento: huesped.tipoDocumento || "DNI",
            NumeroDocumento: huesped.numeroDocumento || "",
            FechaNacimiento: huesped.fechaNacimiento || "",
            Email: huesped.email || "",
            NumeroTelefono: huesped.telefono || "",
            Ocupacion: huesped.ocupacion || "",
            Nacionalidad: huesped.nacionalidad || "",
            Calle: huesped.calle || "",
            Numero: huesped.numero || "",
            Departamento: huesped.departamento || "",
            Piso: huesped.piso || "",
            CP: huesped.codigoPostal || "",
            Localidad: huesped.localidad || "",
            Provincia: huesped.provincia || "",
            Pais: huesped.pais || "",
            PosicionIVA: convertirEnumIva(huesped.posicionIVA),
            CUIT: huesped.cuit || "",
          });
        }
      } catch (err) {
        console.error(err);
        mostrarErrorGenerico("No se pudieron cargar los datos.");
      }
    };
    cargarDatos();
  }, [idUrl, router]);

  const convertirEnumIva = (v) => {
    const mapa = {
      CONSUMIDOR_FINAL: "ConsumidorFinal",
      MONOTRIBUTISTA: "Monotributo",
      RESPONSABLE_INSCRIPTO: "ResponsableInscripto",
      EXENTO: "Excento",
      NO_RESPONSABLE: "NoResponsable",
    };
    return mapa[v] || "ConsumidorFinal";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }));
  };

  const enviarDatos = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) =>
      formDataObj.append(key, formData[key])
    );

    const validacion = validarHuesped(formDataObj);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }
    setErrores({});

    const datosParaApi = mapearHuespedParaApi(formDataObj);
    setEnviando(true);

    try {
      const listaDuplicados = await buscarHuespedes({
        tipoDocumento: datosParaApi.tipoDocumento,
        numeroDocumento: datosParaApi.numeroDocumento,
      });

      const otroDuplicado = listaDuplicados.find((h) => h.id !== idHuesped);

      if (!otroDuplicado) {
        await actualizarHuesped(idHuesped, datosParaApi);
        setModalConfig({
          visible: true,
          tipo: "exito",
          titulo: "Modificación Exitosa",
          mensaje: `Los datos de ${datosParaApi.nombre} fueron actualizados.`,
          acciones: [
            {
              texto: "Aceptar",
              estilo: "aceptar",
              onClick: () => router.push("/buscar-huesped"),
            },
          ],
        });
      } else {
        setModalConfig({
          tipo: "documento_duplicado",
          titulo: "Documento duplicado",
          mensaje: `El documento pertenece a otro huésped (${otroDuplicado.nombre} ${otroDuplicado.apellido}). ¿Desea sobrescribir los datos de ESA persona?`,
          acciones: [
            {
              texto: "Cancelar",
              estilo: "cancelar",
              onClick: () =>
                setModalConfig({
                  tipo: "confirmacion",
                  titulo: "¿Cancelar modificación?",
                  mensaje: "",
                  acciones: [
                    { texto: "No", estilo: "cancelar", onClick: cerrarModal },
                    {
                      texto: "Si",
                      estilo: "aceptar",
                      onClick: () => router.push("/buscar-huesped"),
                    },
                  ],
                }),
            },
            {
              texto: "Corregir",
              estilo: "corregir",
              onClick: () => {
                cerrarModal();
                setTimeout(() => tipoDocRef.current?.focus(), 100);
              },
            },
            {
              texto: "Aceptar Igualmente",
              estilo: "aceptar",
              onClick: async () => {
                setModalConfig({
                  visible: true,
                  tipo: "confirmacion",
                  titulo: "Procesando...",
                  mensaje: "Sobrescribiendo...",
                  acciones: [],
                });
                try {
                  await actualizarHuesped(otroDuplicado.id, datosParaApi);
                  setModalConfig({
                    visible: true,
                    tipo: "exito",
                    titulo: "Actualización exitosa",
                    mensaje: `Se sobrescribieron los datos del huésped existente.`,
                    acciones: [
                      {
                        texto: "Aceptar",
                        estilo: "aceptar",
                        onClick: () => router.push("/buscar-huesped"),
                      },
                    ],
                  });
                } catch (err) {
                  mostrarErrorGenerico();
                }
              },
            },
          ],
        });
        abrirModal();
      }
    } catch (error) {
      console.error(error);
      mostrarErrorGenerico();
    } finally {
      setEnviando(false);
    }
  };

  const confirmarBaja = () => {
    setModalConfig({
      visible: true,
      tipo: "confirmacion",
      titulo: "Dar de Baja",
      mensaje:
        "¿Está seguro que desea eliminar este huésped? Esta acción no se puede deshacer.",
      acciones: [
        { texto: "Cancelar", estilo: "cancelar", onClick: cerrarModal },
        {
          texto: "Confirmar Baja",
          estilo: "cancelar",
          onClick: async () => {
            cerrarModal();
            setBorrando(true);
            try {
              await eliminarHuesped(idHuesped);
              setModalConfig({
                visible: true,
                tipo: "exito",
                titulo: "Huésped Eliminado",
                mensaje: "El huésped ha sido dado de baja correctamente.",
                acciones: [
                  {
                    texto: "Aceptar",
                    estilo: "aceptar",
                    onClick: () => router.push("/buscar-huesped"),
                  },
                ],
              });
            } catch (error) {
              console.log(error);
              mostrarErrorGenerico(
                "No se pudo eliminar. Verifique que no tenga reservas activas."
              );
              setBorrando(false);
            }
          },
        },
      ],
    });
    abrirModal();
  };

  return (
    <>
      <Head>
        <title>Modificar Huésped</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/hotel-icon.ico?v=2" />
      </Head>

      <Modal {...modalConfig} />

      <form
        onSubmit={enviarDatos}
        id="formulario"
        className={`${styles.formulario} ${styles.scrollForm}`}
      >
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Modificar Datos Personales</legend>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="Apellido">Apellido*</label>
              <input
                type="text"
                name="Apellido"
                placeholder="Apellido"
                value={formData.Apellido}
                className={`${errores.Apellido ? styles.inputError : ""} ${
                  styles.inputMayuscula
                }`}
                onInput={aMayusculas}
              />
              {errores.Apellido && (
                <span className={styles.mensajeError}>{errores.Apellido}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="Nombre">Nombre*</label>
              <input
                type="text"
                name="Nombre"
                placeholder="Nombre"
                value={formData.Nombre}
                className={errores.Nombre ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.Nombre && (
                <span className={styles.mensajeError}>{errores.Nombre}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="TipoDocumento">Tipo de Documento*</label>
              <select
                name="TipoDocumento"
                value={formData.TipoDocumento}
                onChange={handleChange}
                ref={tipoDocRef}
              >
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="LE">LE</option>
                <option value="LC">LC</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="NumeroDocumento">Número de Documento*</label>
              <input
                type="text"
                name="NumeroDocumento"
                placeholder="Número de documento"
                value={formData.NumeroDocumento}
                className={errores.NumeroDocumento ? styles.inputError : ""}
                onChange={handleChange}
              />
              {errores.NumeroDocumento && (
                <span className={styles.mensajeError}>
                  {errores.NumeroDocumento}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="CUIT">CUIT {errores.CUIT && "*"}</label>
              <input
                type="text"
                name="CUIT"
                placeholder="CUIT"
                maxLength="11"
                value={formData.CUIT}
                onInput={soloNumeros}
                className={errores.CUIT ? styles.inputError : ""}
              />
              {errores.CUIT && (
                <span className={styles.mensajeError}>{errores.CUIT}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="PosicionIVA">Posición IVA*</label>
              <select
                name="PosicionIVA"
                value={formData.PosicionIVA}
                onChange={handleChange}
              >
                <option value="ConsumidorFinal">Consumidor final</option>
                <option value="Monotributo">Monotributo</option>
                <option value="ResponsableInscripto">
                  Responsable inscripto
                </option>
                <option value="Excento">Exento</option>
                <option value="NoResponsable">No responsable</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="FechaNacimiento">Fecha de Nacimiento*</label>
              <input
                type="date"
                name="FechaNacimiento"
                value={formData.FechaNacimiento}
                className={errores.FechaNacimiento ? styles.inputError : ""}
                onChange={handleChange}
              />
              {errores.FechaNacimiento && (
                <span className={styles.mensajeError}>
                  {errores.FechaNacimiento}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="NumeroTelefono">Teléfono*</label>
              <input
                type="text"
                name="NumeroTelefono"
                placeholder="(011) 1234-5678"
                value={formData.NumeroTelefono}
                className={errores.NumeroTelefono ? styles.inputError : ""}
                onInput={soloNumeros}
              />
              {errores.NumeroTelefono && (
                <span className={styles.mensajeError}>
                  {errores.NumeroTelefono}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="Email">Email</label>
              <input
                type="text"
                name="Email"
                placeholder="correo@ejemplo.com"
                value={formData.Email}
                onInput={aMayusculas}
                className={errores.Email ? styles.inputError : ""}
              />
              {errores.Email && (
                <span className={styles.mensajeError}>{errores.Email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="Ocupacion">Ocupación*</label>
              <input
                type="text"
                name="Ocupacion"
                placeholder="Ocupación"
                value={formData.Ocupacion}
                className={errores.Ocupacion ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.Ocupacion && (
                <span className={styles.mensajeError}>{errores.Ocupacion}</span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="Nacionalidad">Nacionalidad*</label>
              <input
                type="text"
                name="Nacionalidad"
                placeholder="Nacionalidad"
                value={formData.Nacionalidad}
                className={errores.Nacionalidad ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.Nacionalidad && (
                <span className={styles.mensajeError}>
                  {errores.Nacionalidad}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Dirección</legend>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="Calle">Calle*</label>
              <input
                type="text"
                name="Calle"
                placeholder="Calle"
                value={formData.Calle}
                className={errores.Calle ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.Calle && (
                <span className={styles.mensajeError}>{errores.Calle}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Numero">Número*</label>
              <input
                type="number"
                name="Numero"
                placeholder="Número"
                min="0"
                value={formData.Numero}
                className={errores.Numero ? styles.inputError : ""}
                onChange={handleChange}
              />
              {errores.Numero && (
                <span className={styles.mensajeError}>{errores.Numero}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Departamento">Departamento</label>
              <input
                type="text"
                name="Departamento"
                placeholder="Departamento"
                value={formData.Departamento}
                onInput={aMayusculas}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Piso">Piso</label>
              <input
                type="number"
                name="Piso"
                placeholder="Piso"
                min="0"
                value={formData.Piso}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="CP">Código Postal*</label>
              <input
                type="text"
                name="CP"
                placeholder="Código Postal"
                value={formData.CP}
                className={errores.CP ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.CP && (
                <span className={styles.mensajeError}>{errores.CP}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Pais">País*</label>
              <select
                id="Pais"
                name="Pais"
                value={formData.Pais}
                className={errores.Pais ? styles.inputError : ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Seleccionar país
                </option>
                {listaPaises.map((pais) => (
                  <option key={pais.codigo} value={pais.nombre}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
              {errores.Pais && (
                <span className={styles.mensajeError}>{errores.Pais}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Provincia">Provincia*</label>
              <input
                type="text"
                name="Provincia"
                placeholder="Provincia"
                value={formData.Provincia}
                className={errores.Provincia ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.Provincia && (
                <span className={styles.mensajeError}>{errores.Provincia}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Localidad">Localidad*</label>
              <input
                type="text"
                name="Localidad"
                placeholder="Localidad"
                value={formData.Localidad}
                className={errores.Localidad ? styles.inputError : ""}
                onInput={aMayusculas}
              />
              {errores.Localidad && (
                <span className={styles.mensajeError}>{errores.Localidad}</span>
              )}
            </div>
          </div>
        </fieldset>
      </form>

      <div className={styles.formButtons}>
        <input
          type="button"
          value="Cancelar"
          className={`${styles.btnCancelar} ${
            enviando || borrando ? styles.desactivado : ""
          }`}
          onClick={() => router.push("/buscar-huesped")}
          disabled={enviando || borrando}
        />

        <input
          type="submit"
          form="formulario"
          value={enviando ? "Guardando..." : "Guardar Cambios"}
          className={`${styles.btnSiguiente} ${
            enviando || borrando ? styles.desactivado : ""
          }`}
          disabled={enviando || borrando}
        />

        <input
          type="button"
          value={borrando ? "Borrando..." : "Borrar Huesped"}
          className={`${styles.btnCancelar} ${
            enviando || borrando ? styles.desactivado : ""
          }`}
          style={{ backgroundColor: "#b91c1c" }}
          onClick={confirmarBaja}
          disabled={enviando || borrando}
        />
      </div>
    </>
  );
}
