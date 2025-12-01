'use client'
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from "../../styles/DarAltaHuesped.module.css"
import React from 'react';

export default function DarAltaHuesped() {

  const modalRef = useRef(null);

  const [errores, setErrores] = useState({});

  const [listaPaises, setListaPaises] = useState([]);

  const [enviando, setEnviando] = useState(false);

  const tipoDocRef = useRef(null);

  const aMayusculas = (e) => {
    e.target.value = e.target.value.toUpperCase();
  };

  const router = useRouter();
  const refresh = () => router.reload();

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=translations,cca2");
        if (!response.ok) throw new Error("Error al obtener países");

        const countries = await response.json();

        const listaOrdenada = countries
          .map(c => ({
            codigo: c.cca2,
            nombre: c.translations?.spa?.common || c.translations?.eng?.common || "Desconocido"
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setListaPaises(listaOrdenada);
        console.log(`✅ ${listaOrdenada.length} países cargados`);

      } catch (error) {
        console.error("❌ Error al cargar países:", error);
      }
    };

    cargarPaises();
  }, []);

  const [modalConfig, setModalConfig] = useState({
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones:[]
  });

  const cerrarModal = () => modalRef.current.close();
  const abrirModal = () => {
    if (modalRef.current && !modalRef.current.open) {
      modalRef.current.showModal();
    }
  };

  const crearHuesped = async (datosApi) => {
    try {
      const respuesta = await fetch('http://localhost:8080/api/huespedes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosApi),
      });

      if (respuesta.ok) {
        const nuevoHuesped = await respuesta.json();
        cerrarModal();
        setModalConfig({
          tipo: "exito",
          titulo: "¡Huésped registrado!",
          mensaje: `Se dio de alta a ${nuevoHuesped.nombre} ${nuevoHuesped.apellido}.`,
          acciones: [
            { texto: "Aceptar", estilo: "aceptar", onClick: refresh }
          ]
        });
        abrirModal();
      } else {
        throw new Error("Error al crear");
      }
    } catch (error) {
      mostrarErrorGenerico();
    } finally {
      setEnviando(false);
    }
  };
  const actualizarHuesped = async (id, datosApi) => {
    setModalConfig({
      tipo: "confirmacion", 
      titulo: "Actualizando...",
      mensaje: "Sobrescribiendo los datos del huésped existente...",
      acciones: []
    });
    
    try {
      const respuesta = await fetch(`http://localhost:8080/api/huespedes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosApi),
      });

      if (respuesta.ok) {
        const actualizado = await respuesta.json();
        setModalConfig({
          tipo: "exito",
          titulo: "¡Actualización exitosa!",
          mensaje: `Se actualizaron los datos de ${actualizado.nombre} ${actualizado.apellido}.`,
          acciones: [
            { texto: "Aceptar", estilo: "aceptar", onClick: refresh }
          ]
        });
      } else {
        throw new Error("Error al actualizar");
      }
    } catch (error) {
      mostrarErrorGenerico();
    } finally {
      setEnviando(false);
    }
  };

  const mostrarErrorGenerico = () => {
    setModalConfig({
      tipo: "error",
      titulo: "Error",
      mensaje: "Ha ocurrido un error inesperado, intente nuevamente",
      acciones: [{ texto: "Cerrar", estilo: "cancelar", onClick: cerrarModal }]
    });
    abrirModal();
  };

  const enviarDatos = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const camposObligatorios = [
        "Apellido", "Nombre", "TipoDocumento", "NumeroDocumento", 
        "PosicionIVA", "FechaNacimiento", "NumeroTelefono", 
        "Ocupacion", "Nacionalidad", "Calle", "Numero", 
        "CP", "Pais", "Provincia", "Localidad"
      ];

      const nuevosErrores = {};
      camposObligatorios.forEach(campo => {
        const valor = formData.get(campo);
        if (!valor || valor.toString().trim() === "") {
          nuevosErrores[campo] = "Este campo es obligatorio";
        }
      });

      const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;

      const nombreVal = formData.get('Nombre');
      if (nombreVal && !regexSoloLetras.test(nombreVal.toString())) {
        nuevosErrores['Nombre'] = "El nombre solo puede contener letras y espacios";
      }

      const apellidoVal = formData.get('Apellido');
      if (apellidoVal && !regexSoloLetras.test(apellidoVal.toString())) {
        nuevosErrores['Apellido'] = "El apellido solo puede contener letras y espacios";
      }

      const email = formData.get('Email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && !emailRegex.test(email.toString())) {
        nuevosErrores['Email'] = "Formato de email inválido";
      }

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return;
      }

      setErrores({});

      const datos = {
        Nombre: formData.get('Nombre'),
        Apellido: formData.get('Apellido'),
        TipoDocumento: formData.get('TipoDocumento'),
        NumeroDocumento: formData.get('NumeroDocumento'),
        FechaNacimiento: formData.get('FechaNacimiento'),
        Email: formData.get('Email'),
        NumeroTelefono: formData.get('NumeroTelefono'),
        Ocupacion: formData.get('Ocupacion'),
        Nacionalidad: formData.get('Nacionalidad'),

        Calle: formData.get('Calle'),
        Numero: formData.get('Numero'),
        Departamento: formData.get('Departamento'),
        Piso: formData.get('Piso'),
        CP: formData.get('CP'),
        Localidad: formData.get('Localidad'),
        Provincia: formData.get('Provincia'),
        Pais: formData.get('Pais'),

        PosicionIVA: formData.get('PosicionIVA'),
        CUIT: formData.get('CUIT')
      };

      const mapTipoDocumento = (v) => {
        if (!v) return null;
        const t = v.trim().toUpperCase();
        return ["DNI", "LE", "LC", "PASAPORTE", "OTRO"].includes(t) ? t
            : (t === "PASAPORTE" || t === "PASAPORTE") ? "PASAPORTE"
            : "OTRO";
      };

      const mapPosicionIVA = (v) => {
        if (!v) return null;
        const k = v.trim().toUpperCase().replace(/\s+/g, "");
        switch (k) {
          case "CONSUMIDORFINAL": return "CONSUMIDOR_FINAL";
          case "MONOTRIBUTO":     return "MONOTRIBUTISTA";
          case "RESPONSABLEINSCRIPTO": return "RESPONSABLE_INSCRIPTO";
          case "EXCENTO":
          case "EXENTO":          return "EXENTO";
          case "NORESPONSABLE":   return "NO_RESPONSABLE";
          default: return null;
        }
      };

      function mapearFrontAApi(data) {
        const isoOrNull = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null);
        const numOrNull = (n) => (n === undefined || n === null || n === "" ? null : Number(n));

        return {
          nombre:          data.Nombre || null,
          apellido:        data.Apellido || null,
          tipoDocumento:   mapTipoDocumento(data.TipoDocumento),
          numeroDocumento: data.NumeroDocumento || null,
          fechaNacimiento: isoOrNull(data.FechaNacimiento),
          email:           data.Email || null,
          telefono:        data.NumeroTelefono || null,
          ocupacion:       data.Ocupacion || null,
          nacionalidad:    data.Nacionalidad || null,

          calle:           data.Calle || null,
          numero:          numOrNull(data.Numero),
          departamento:    data.Departamento || null,
          piso:            numOrNull(data.Piso),
          codigoPostal:    data.CP || null,
          localidad:       data.Localidad || null,
          provincia:       data.Provincia || null,
          pais:            data.Pais || null,

          posicionIVA:     mapPosicionIVA(data.PosicionIVA),
          cuit:            data.CUIT || null
        };
      }
      const datosParaApi = mapearFrontAApi(datos);
      setEnviando(true); 
      try {
        const tipoDoc = datosParaApi.tipoDocumento;
        const numDoc = datosParaApi.numeroDocumento;

        const queryParams = new URLSearchParams({
          tipoDocumento: tipoDoc,
          numeroDocumento: numDoc
        });

        const responseCheck = await fetch(`http://localhost:8080/api/huespedes/buscar?${queryParams}`);
        
        if (!responseCheck.ok) throw new Error("Error en la verificación");
        
        const listaDuplicados = await responseCheck.json();

        if (listaDuplicados.length === 0) {
          await crearHuesped(datosParaApi);
        } else {
          const huespedExistente = listaDuplicados[0];
          setModalConfig({
            tipo: "documento_duplicado",
            titulo: "Numero y tipo de documento duplicado",
            mensaje: `Ya existe un huesped con numero ${datos.NumeroDocumento} de ${datos.TipoDocumento}. ¿Desea sobreescribir los datos?`,
            acciones: [
              {
                texto: "Cancelar",
                estilo: "cancelar",
                onClick: () => setModalConfig({
                  tipo: "confirmacion",
                  titulo: "¿Desea cancelar el alta del huésped?",
                  mensaje: "",
                  acciones:[
                    {
                      texto: "No",
                      estilo: "cancelar",
                      onClick: cerrarModal
                    },
                    {
                      texto: "Si",
                      estilo: "aceptar",
                      onClick: refresh
                    }
                  ]
                })
              },
              {
                texto: "Corregir",
                estilo: "corregir",
                onClick: () => {
                  cerrarModal();
                  setTimeout(() => {
                    if(tipoDocRef.current) tipoDocRef.current.focus();
                  }, 100);
                }
              },
              {
                texto: "Aceptar Igualmente",
                estilo: "aceptar",
                onClick: async () => {
                  setModalConfig({
                    tipo: "documento_duplicado",
                    titulo: "Procesando...",
                    mensaje: "Sobrescribiendo datos, por favor espere...",
                    acciones: [
                        { texto: "Cancelar", estilo: "cancelar", disabled: true, onClick: () => {} },
                        { texto: "Corregir", estilo: "corregir", disabled: true, onClick: () => {} },
                        { texto: "Procesando...", estilo: "aceptar", disabled: true, onClick: () => {} } 
                    ]
                  });
                  actualizarHuesped(huespedExistente.id, datosParaApi);
                }
              }
            ]
          })
          abrirModal();
        }

      } catch (error) {
        setModalConfig({
          tipo: "error",
          titulo: "Error",
          mensaje: "Ha ocurrido un error inesperado, intente nuevamente",
          acciones:[
            {
              texto: "Cerrar",
              estilo: "cancelar",
              onClick: cerrarModal
            }
          ]
        })
        abrirModal();
      } finally{
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

    <dialog 
        ref={modalRef} 
        className={`${styles.modal} ${styles[modalConfig.tipo]}`}
      >
        <div className={styles.modalContent}>
          
          <div className={styles.iconContainer}>
            {modalConfig.tipo === 'exito' && '✅'}
            {modalConfig.tipo === 'error' && '❌'}
            {modalConfig.tipo === 'documento_duplicado' && '⚠️'}
            {modalConfig.tipo === 'confirmacion' && '❓'}
          </div>

          <h2 className={styles.modalTitle}>{modalConfig.titulo}</h2>
          <p className={modalConfig.mensaje === "" ? "" : styles.modalMessage}>{modalConfig.mensaje}</p>

          <div className={styles.botonesContainer}>+
            {modalConfig.acciones && modalConfig.acciones.map((accion, index) => (
              <button 
                key={index}
                onClick={accion.onClick}
                className={`${styles.btnModal} ${styles[accion.estilo]}`}
                disabled={accion.disabled}
              >
                {accion.texto}
              </button>
            ))}
          </div>

        </div>
      </dialog>
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
              <input type="text" name="Apellido" placeholder="Apellido"
                className={`${errores.Apellido ? styles.inputError : ''} ${styles.inputMayuscula}`}
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Apellido: null})} 
              />
              {errores.Apellido && <span className={styles.mensajeError}>{errores.Apellido}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Nombre">Nombre*</label>
              <input type="text" name="Nombre" placeholder="Nombre"
                className={errores.Nombre ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Nombre: null})} 
              />
              {errores.Nombre && <span className={styles.mensajeError}>{errores.Nombre}</span>}
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
              <input type="text" name="NumeroDocumento" placeholder="Número de documento"
                className={errores.NumeroDocumento ? styles.inputError : ''} 
                onChange={() => setErrores({...errores, NumeroDocumento: null})} 
              />
              {errores.NumeroDocumento && <span className={styles.mensajeError}>{errores.NumeroDocumento}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="CUIT">CUIT</label>
              <input type="text" name="CUIT" placeholder="CUIT" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="PosicionIVA">Posición IVA*</label>
              <select name="PosicionIVA">
                <option value="ConsumidorFinal">Consumidor final</option>
                <option value="Monotributo">Monotributo</option>
                <option value="ResponsableInscripto">Responsable inscripto</option>
                <option value="Excento">Exento</option>
                <option value="NoResponsable">No responsable</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="FechaNacimiento">Fecha de Nacimiento*</label>
              <input type="date" name="FechaNacimiento"
                className={errores.FechaNacimiento ? styles.inputError : ''} 
                onChange={() => setErrores({...errores, FechaNacimiento: null})} 
              />
              {errores.FechaNacimiento && <span className={styles.mensajeError}>{errores.FechaNacimiento}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="NumeroTelefono">Teléfono*</label>
              <input type="text" name="NumeroTelefono" placeholder="(011) 1234-5678"
                className={errores.NumeroTelefono ? styles.inputError : ''} 
                onChange={() => setErrores({...errores, NumeroTelefono: null})} 
              />
              {errores.NumeroTelefono && <span className={styles.mensajeError}>{errores.NumeroTelefono}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Email">Email</label>
              <input type="text" name="Email" placeholder="correo@ejemplo.com" 
                onInput={aMayusculas}
                className={errores.Email ? styles.inputError : ''}
                onChange={() => setErrores({...errores, Email: null})} 
                />
                {errores.Email && <span className={styles.mensajeError}>{errores.Email}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Ocupacion">Ocupación*</label>
              <input type="text" name="Ocupacion" placeholder="Ocupación"
                className={errores.Ocupacion ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Ocupacion: null})} 
              />
              {errores.Ocupacion && <span className={styles.mensajeError}>{errores.Ocupacion}</span>}
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="Nacionalidad">Nacionalidad*</label>
              <input type="text" name="Nacionalidad" placeholder="Nacionalidad"
                className={errores.Nacionalidad ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Nacionalidad: null})} 
              />
              {errores.Nacionalidad && <span className={styles.mensajeError}>{errores.Nacionalidad}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Dirección</legend>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="Calle">Calle*</label>
              <input type="text" name="Calle" placeholder="Calle"
                className={errores.Calle ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Calle: null})} 
              />
              {errores.Calle && <span className={styles.mensajeError}>{errores.Calle}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Numero">Número*</label>
              <input type="number" name="Numero" placeholder="Número" min="0"
                className={errores.Numero ? styles.inputError : ''} 
                onChange={() => setErrores({...errores, Numero: null})} 
              />
              {errores.Numero && <span className={styles.mensajeError}>{errores.Numero}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Departamento">Departamento</label>
              <input type="text" name="Departamento" placeholder="Departamento" 
                onInput={aMayusculas}/>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Piso">Piso</label>
              <input type="number" name="Piso" placeholder="Piso" min="0"/>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="CP">Código Postal*</label>
              <input type="text" name="CP" placeholder="Código Postal"
                className={errores.CP ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, CP: null})} 
              />
              {errores.CP && <span className={styles.mensajeError}>{errores.CP}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Pais">País*</label>
              <select id="Pais" name="Pais" defaultValue="" 
              className={errores.Pais ? styles.inputError : ''}
              onChange={() => setErrores({ ...errores, Pais: null })}
              >
                <option value="" disabled>Seleccionar país</option>
                {listaPaises.map((pais) => (
                  <option key={pais.codigo} value={pais.nombre}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
              {errores.Pais && <span className={styles.mensajeError}>{errores.Pais}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Provincia">Provincia*</label>
              <input type="text" name="Provincia" placeholder="Provincia"
                className={errores.Provincia ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Provincia: null})} 
              />
              {errores.Provincia && <span className={styles.mensajeError}>{errores.Provincia}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="Localidad">Localidad*</label>
              <input type="text" name="Localidad" placeholder="Localidad"
                className={errores.Localidad ? styles.inputError : ''} 
                onInput={aMayusculas}
                onChange={() => setErrores({...errores, Localidad: null})} 
              />
              {errores.Localidad && <span className={styles.mensajeError}>{errores.Localidad}</span>}
            </div>
          </div>
        </fieldset>
      </form>

      <div className={styles.formButtons}>
        <input
        onClick ={ () =>{
          setModalConfig({
            tipo: "confirmacion",
            titulo: "¿Desea cancelar el alta del huésped?",
            mensaje: "",
            acciones:[
              {
                texto: "No",
                estilo: "cancelar",
                onClick: cerrarModal
              },
              {
                texto: "Si",
                estilo: "aceptar",
                onClick: refresh
              }
            ]
          });
          abrirModal();
        }}

        type="button" 
        form ="formulario"
        value="Cancelar"
        className={styles.btnCancelar}
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