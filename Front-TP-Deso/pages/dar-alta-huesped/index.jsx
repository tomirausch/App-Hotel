"use client";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/DarAltaHuesped.module.css";
import Modal from "@/components/Modal";
import {
  crearHuesped,
  actualizarHuesped,
  buscarHuespedes,
} from "@/services/huespedService";
import { cargarPaises } from "@/services/paisService";
import { validarHuesped } from "@/utils/validaciones";
import { mapearHuespedParaApi } from "@/utils/mappers";
import React from "react";

export default function DarAltaHuesped() {
  const [errores, setErrores] = useState({});
  const [listaPaises, setListaPaises] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const tipoDocRef = useRef(null);

  const aMayusculas = (e) => {
    e.target.value = e.target.value.toUpperCase();
  };
  const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const router = useRouter();
  const refresh = () => router.reload();

  useEffect(() => {
    cargarPaises()
      .then((data) => setListaPaises(data))
      .catch((err) => console.error(err));
  }, []);

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones: [],
  });

  const cerrarModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };
  const abrirModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: true }));
  };

  const mostrarErrorGenerico = () => {
    setModalConfig({
      tipo: "error",
      titulo: "Error",
      mensaje: "Ha ocurrido un error inesperado, intente nuevamente",
      acciones: [{ texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal }],
    });
    abrirModal();
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const validacion = validarHuesped(formData);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    setErrores({});

    const datosParaApi = mapearHuespedParaApi(formData);

    setEnviando(true);
    try {
      const listaDuplicados = await buscarHuespedes({
        tipoDocumento: datosParaApi.tipoDocumento,
        numeroDocumento: datosParaApi.numeroDocumento,
      });

      if (listaDuplicados.length === 0) {
        const nuevoHuesped = await crearHuesped(datosParaApi);
        setModalConfig({
          visible: true,
          tipo: "exito",
          titulo: "¡Huésped registrado!",
          mensaje: `Se dio de alta a ${nuevoHuesped.nombre} ${nuevoHuesped.apellido}.`,
          acciones: [{ texto: "Aceptar", estilo: "aceptar", onClick: refresh }],
        });
      } else {
        const huespedExistente = listaDuplicados[0];

        setModalConfig({
          tipo: "documento_duplicado",
          titulo: "Numero y tipo de documento duplicado",
          mensaje: `Ya existe un huesped con numero ${huespedExistente.numeroDocumento} de ${huespedExistente.tipoDocumento}. ¿Desea sobreescribir los datos?`,
          acciones: [
            {
              texto: "Cancelar",
              estilo: "cancelar",
              onClick: () =>
                setModalConfig({
                  tipo: "confirmacion",
                  titulo: "¿Desea cancelar el alta del huésped?",
                  mensaje: "",
                  acciones: [
                    {
                      texto: "No",
                      estilo: "cancelar",
                      onClick: cerrarModal,
                    },
                    {
                      texto: "Si",
                      estilo: "aceptar",
                      onClick: refresh,
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
                  mensaje: "Sobrescribiendo datos, por favor espere...",
                  acciones: [
                    {
                      texto: "Cancelar",
                      estilo: "cancelar",
                      disabled: true,
                      onClick: () => {},
                    },
                    {
                      texto: "Corregir",
                      estilo: "corregir",
                      disabled: true,
                      onClick: () => {},
                    },
                    {
                      texto: "Procesando...",
                      estilo: "aceptar",
                      disabled: true,
                      onClick: () => {},
                    },
                  ],
                });
                try {
                  const actualizado = await actualizarHuesped(
                    huespedExistente.id,
                    datosParaApi
                  );
                  setModalConfig({
                    visible: true,
                    tipo: "exito",
                    titulo: "Actualización exitosa",
                    mensaje: `Datos de ${actualizado.nombre} actualizados.`,
                    acciones: [
                      { texto: "Aceptar", estilo: "aceptar", onClick: refresh },
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
      mostrarErrorGenerico();
    } finally {
      setEnviando(false);
    }
  };
  return (
    <>
      <Head>
        <title>Dar Alta Huésped</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/hotel-icon.ico?v=2" />
        <link rel="icon" href="/hotel-icon.ico?v=2" />
      </Head>

      <Modal
        visible={modalConfig.visible}
        tipo={modalConfig.tipo}
        titulo={modalConfig.titulo}
        mensaje={modalConfig.mensaje}
        acciones={modalConfig.acciones}
      />

      <form
        onSubmit={enviarDatos}
        id="formulario"
        className={`${styles.formulario} ${styles.scrollForm}`}
      >
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos Personales</legend>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="Apellido">Apellido*</label>
              <input
                type="text"
                name="Apellido"
                placeholder="Apellido"
                className={`${errores.Apellido ? styles.inputError : ""} ${
                  styles.inputMayuscula
                }`}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Apellido: null })}
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
                className={errores.Nombre ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Nombre: null })}
              />
              {errores.Nombre && (
                <span className={styles.mensajeError}>{errores.Nombre}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="TipoDocumento">Tipo de Documento*</label>
              <select name="TipoDocumento" ref={tipoDocRef}>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="LE">LE</option>
                <option value="LC">LC</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="NumeroDocumento">Número de Documento*</label>
              <input
                type="text"
                name="NumeroDocumento"
                placeholder="Número de documento"
                className={errores.NumeroDocumento ? styles.inputError : ""}
                onChange={() =>
                  setErrores({ ...errores, NumeroDocumento: null })
                }
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
                onInput={soloNumeros}
                className={errores.CUIT ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, CUIT: null })}
              />
              {errores.CUIT && (
                <span className={styles.mensajeError}>{errores.CUIT}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="PosicionIVA">Posición IVA*</label>
              <select name="PosicionIVA">
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
                className={errores.FechaNacimiento ? styles.inputError : ""}
                onChange={() =>
                  setErrores({ ...errores, FechaNacimiento: null })
                }
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
                className={errores.NumeroTelefono ? styles.inputError : ""}
                onInput={soloNumeros}
                onChange={() =>
                  setErrores({ ...errores, NumeroTelefono: null })
                }
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
                onInput={aMayusculas}
                className={errores.Email ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, Email: null })}
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
                className={errores.Ocupacion ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Ocupacion: null })}
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
                className={errores.Nacionalidad ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Nacionalidad: null })}
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
                className={errores.Calle ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Calle: null })}
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
                className={errores.Numero ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, Numero: null })}
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
                onInput={aMayusculas}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Piso">Piso</label>
              <input type="number" name="Piso" placeholder="Piso" min="0" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="CP">Código Postal*</label>
              <input
                type="text"
                name="CP"
                placeholder="Código Postal"
                className={errores.CP ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, CP: null })}
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
                defaultValue=""
                className={errores.Pais ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, Pais: null })}
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
                className={errores.Provincia ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Provincia: null })}
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
                className={errores.Localidad ? styles.inputError : ""}
                onInput={aMayusculas}
                onChange={() => setErrores({ ...errores, Localidad: null })}
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
          onClick={() => {
            setModalConfig({
              tipo: "confirmacion",
              titulo: "¿Desea cancelar el alta del huésped?",
              mensaje: "",
              acciones: [
                {
                  texto: "No",
                  estilo: "cancelar",
                  onClick: cerrarModal,
                },
                {
                  texto: "Si",
                  estilo: "aceptar",
                  onClick: refresh,
                },
              ],
            });
            abrirModal();
          }}
          type="button"
          form="formulario"
          value="Cancelar"
          className={styles.btnCancelar}
          disabled={enviando}
        />
        <input
          type="submit"
          form="formulario"
          value={enviando ? "Enviando" : "Siguiente"}
          className={styles.btnSiguiente}
          disabled={enviando}
        />
      </div>
    </>
  );
}
