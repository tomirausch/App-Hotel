"use client";
import Head from "next/head";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AltaResponsable.module.css";
import Modal from "@/components/Modal";
import {
  crearPersonaJuridica,
  buscarPersonaJuridica,
} from "@/services/huespedService";
import { validarResponsable } from "@/utils/validaciones";

export default function AltaResponsable() {
  const router = useRouter();
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const cuitInputRef = useRef(null);

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones: [],
  });

  const cerrarModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));

  const aMayusculas = (e) => {
    e.target.value = e.target.value.toUpperCase();
  };

  const soloNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handleCancelar = () => {
    setModalConfig({
      visible: true,
      tipo: "advertencia",
      titulo: "Confirmar Cancelación",
      mensaje: "¿Desea cancelar el alta del responsable de pago?",
      acciones: [
        {
          texto: "No",
          estilo: "cancelar",
          onClick: cerrarModal,
        },
        {
          texto: "Si",
          estilo: "aceptar",
          onClick: () => {
            cerrarModal();
            router.back();
          },
        },
      ],
    });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validaciones
    const validacion = validarResponsable(formData);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }
    setErrores({});

    setEnviando(true);
    try {
      // 2.B Verificar si el CUIT ya existe
      let existe = false;
      try {
        await buscarPersonaJuridica(data.cuit);
        existe = true;
      } catch (e) {
        // Si falla es porque no existe (asumiendo behavior de buscarPersonaJuridica)
        existe = false;
      }

      if (existe) {
        setModalConfig({
          visible: true,
          tipo: "advertencia",
          titulo: "¡CUIDADO!",
          mensaje: "El CUIT ya existe en el sistema",
          acciones: [
            {
              texto: "Aceptar",
              estilo: "aceptar",
              onClick: () => {
                cerrarModal();
                if (cuitInputRef.current) {
                  cuitInputRef.current.focus();
                }
              },
            },
          ],
        });
        setEnviando(false);
        return;
      }

      const payload = {
        razonSocial: data.razonSocial,
        cuit: data.cuit,
        telefono: data.telefono,
        calle: data.calle,
        numero: parseInt(data.numero, 10),
        departamento: data.departamento || null,
        piso: data.piso ? parseInt(data.piso, 10) : null,
      };

      await crearPersonaJuridica(payload);

      setModalConfig({
        visible: true,
        tipo: "exito",
        titulo: "Responsable Creado",
        mensaje: `Se creó correctamente la persona jurídica "${payload.razonSocial}".`,
        acciones: [
          {
            texto: "Volver a Facturar",
            estilo: "aceptar",
            onClick: () => {
              cerrarModal();
              router.push({
                pathname: "/facturar",
                query: {
                  responsableId: payload.id || Date.now(),
                  nombre: payload.razonSocial,
                  cuit: payload.cuit,
                  posicionIVA: "RESPONSABLE_INSCRIPTO",
                  esNuevo: true,
                },
              });
            },
          },
        ],
      });
    } catch (error) {
      setModalConfig({
        visible: true,
        tipo: "error",
        titulo: "Error",
        mensaje: error.message || "Error al crear el responsable.",
        acciones: [
          { texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal },
        ],
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Head>
        <title>Alta Responsable de Pago</title>
      </Head>

      <Modal {...modalConfig} />

      <form
        onSubmit={enviarDatos}
        id="formulario"
        className={`${styles.formulario} ${styles.scrollForm}`}
      >
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos Fiscales</legend>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Razón Social*</label>
              <input
                type="text"
                name="razonSocial"
                placeholder="Razón Social"
                onInput={aMayusculas}
                className={errores.razonSocial ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, razonSocial: null })}
              />
              {errores.razonSocial && (
                <span className={styles.mensajeError}>
                  {errores.razonSocial}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>CUIT*</label>
              <input
                type="text"
                name="cuit"
                ref={cuitInputRef}
                placeholder="CUIT"
                maxLength="11"
                onInput={soloNumeros}
                className={errores.cuit ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, cuit: null })}
              />
              {errores.cuit && (
                <span className={styles.mensajeError}>{errores.cuit}</span>
              )}
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Teléfono*</label>
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                onInput={soloNumeros}
                className={errores.telefono ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, telefono: null })}
              />
              {errores.telefono && (
                <span className={styles.mensajeError}>{errores.telefono}</span>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Domicilio Fiscal</legend>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Calle*</label>
              <input
                type="text"
                name="calle"
                placeholder="Calle"
                onInput={aMayusculas}
                className={errores.calle ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, calle: null })}
              />
              {errores.calle && (
                <span className={styles.mensajeError}>{errores.calle}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Número*</label>
              <input
                type="number"
                name="numero"
                placeholder="Número"
                min="0"
                className={errores.numero ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, numero: null })}
              />
              {errores.numero && (
                <span className={styles.mensajeError}>{errores.numero}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Piso</label>
              <input type="number" name="piso" placeholder="Piso" min="0" />
            </div>
            <div className={styles.formGroup}>
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                placeholder="Dpto"
                onInput={aMayusculas}
              />
            </div>
            <div className={styles.formGroup}>
              <label>CP*</label>
              <input
                type="text"
                name="cp"
                placeholder="Código Postal"
                className={errores.cp ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, cp: null })}
              />
              {errores.cp && (
                <span className={styles.mensajeError}>{errores.cp}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Localidad*</label>
              <input
                type="text"
                name="localidad"
                placeholder="Localidad"
                onInput={aMayusculas}
                className={errores.localidad ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, localidad: null })}
              />
              {errores.localidad && (
                <span className={styles.mensajeError}>{errores.localidad}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Provincia*</label>
              <input
                type="text"
                name="provincia"
                placeholder="Provincia"
                onInput={aMayusculas}
                className={errores.provincia ? styles.inputError : ""}
                onChange={() => setErrores({ ...errores, provincia: null })}
              />
              {errores.provincia && (
                <span className={styles.mensajeError}>{errores.provincia}</span>
              )}
            </div>
          </div>
        </fieldset>
      </form>

      <div className={styles.formButtons}>
        <input
          type="button"
          value="Cancelar"
          className={styles.btnCancelar}
          onClick={handleCancelar}
          disabled={enviando}
        />
        <input
          type="submit"
          form="formulario"
          value={enviando ? "Guardando..." : "Guardar Responsable"}
          className={styles.btnSiguiente}
          disabled={enviando}
        />
      </div>
    </>
  );
}
