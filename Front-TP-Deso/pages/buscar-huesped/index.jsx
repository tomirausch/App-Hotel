'use client'
import Head from "next/head";
import styles from "../../styles/BuscarHuesped.module.css"
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import React from 'react';

export default function BuscarHuesped() {
  const [personas, setPersonas] = useState([]);
  const [errorBusqueda, setErrorBusqueda] = useState(false);
  const [busqueda, setBusqueda] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [columnaSeleccionada, setColumnaSeleccionada] = useState("apellido");
  const [orden, setOrden] = useState("asc");

  const manejarOrdenamiento = (columna) => {
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
  const buscar = async (e) => {

    e.preventDefault();
    setCargando(true);

    const formData = new FormData(e.target);
    
    const datos = {
      Apellido: formData.get('Apellido').trim(),
      Nombre: formData.get('Nombre').trim(),
      TipoDocumento: formData.get('TipoDocumento') === "-" ? "" : formData.get('TipoDocumento').trim().toUpperCase(),
      NumeroDocumento: formData.get('NumeroDocumento').trim()
    };

    const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;

    if (!regexSoloLetras.test(datos.Apellido)) {
      alert("El apellido solo puede contener letras y espacios.");
      setCargando(false); 
      return;
    }

    if (!regexSoloLetras.test(datos.Nombre)) {
      alert("El nombre solo puede contener letras y espacios.");
      setCargando(false);
      return;
    }

    let query = 'http://localhost:8080/api/huespedes/buscar';
    datos.Apellido !== "" && (query += `?apellido=${datos.Apellido}&`);
    datos.Nombre !== "" && (query += `?nombre=${datos.Nombre}&`);
    datos.TipoDocumento !== "" && (query += `?tipoDocumento=${datos.TipoDocumento}&`);
    datos.NumeroDocumento !== "" && (query += `?numeroDocumento=${datos.NumeroDocumento}&`);

    try{
      const respuesta = await fetch(query, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

      if(respuesta.ok){ 
        const contenido = await respuesta.json();
        setErrorBusqueda(false);
        setPersonas(contenido);
        setBusqueda(true);
        setOrden("asc"); 
        setColumnaSeleccionada("apellido");
      } else {
        setErrorBusqueda(true);
        setBusqueda(false);
      }
    } catch (e){
        setErrorBusqueda(true);
        setBusqueda(false);
    }finally{
      setCargando(false);
    };
    
  }

  const cancelarBusqueda = () => {
    setBusqueda(false);
  }

  const mostrarBusqueda = () =>{
      if(busqueda){
        if(personas.length === 0){
          return( 
          <>
            <h2>No se encontraron resultados para su busqueda</h2>
            <input type="button" value="Dar alta huesped" className={styles.btnSiguiente} style={{marginTop: "10px"}} onClick={() => router.push('/dar-alta-huesped')} />
          </>
          )
        }
    return(
      <> 
        <div className={`${styles.containerPersona} ${styles.header}`}>

        <div className={styles.containerP}>
          <p onClick={() => manejarOrdenamiento("apellido")}>Apellido</p>
          {columnaSeleccionada === "apellido" && (
            <img 
              src={orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"} 
              alt="Orden"
              style={{height: "20px", width:"20px", filter: "invert(1)"}} 
            />
          )}
        </div>

        <div className={styles.containerP}>
          <p onClick={() => manejarOrdenamiento("nombre")}>Nombre</p>
          {columnaSeleccionada === "nombre" && (
            <img 
              src={orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"} 
              alt="Orden"
              style={{height: "20px", width:"20px", filter: "invert(1)"}} 
            />
          )}
        </div>

        <div className={styles.containerP}>
          <p onClick={() => manejarOrdenamiento("tipoDocumento")}>Tipo Documento</p>
          {columnaSeleccionada === "tipoDocumento" && (
            <img 
              src={orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"} 
              alt="Orden"
              style={{height: "20px", width:"20px", filter: "invert(1)"}} 
            />
          )}
        </div>

        <div className={styles.containerP}>
          <p onClick={() => manejarOrdenamiento("numeroDocumento")}>Numero Documento</p>
          {columnaSeleccionada === "numeroDocumento" && (
            <img 
              src={orden === "asc" ? "/flecha-arriba.png" : "/flecha-abajo.png"} 
              alt="Orden"
              style={{height: "20px", width:"20px" , filter: "invert(1)"}} 
            />
          )}
        </div>
      </div>

        {personasOrdenadas.map((persona, index) =>(
          <div
            key={index} 
            onClick={
              () => {
                seleccionado === index ? setSeleccionado(null) : setSeleccionado(index);
              }
            }
            className={`
              ${styles.containerPersona} 
              ${styles.row} 
              ${seleccionado === index ? styles.seleccionado : ''}
            `}
            >
            <p>{persona.apellido.toUpperCase()}</p>
            <p>{persona.nombre.toUpperCase()}</p>
            <p>{persona.tipoDocumento}</p>
            <p>{persona.numeroDocumento}</p>
          </div>
        ))}
          <input type="button" value="Siguiente" className={styles.btnSiguiente} style={{marginTop: "10px", marginBottom: "10px"}}
          onClick={
            () => {
              seleccionado !== null ? router.push('/modificar-huesped') : router.push('/dar-alta-huesped')
              }
            }
            />
      </>
    )
  }
  else{
    if(errorBusqueda){
      return(
        <>
          <h2>Ha ocurrido un error.</h2>
        </>
      )
    }
    return(
      <>
        <h2>Realice una busqueda...</h2>
      </>
    )
  }
  }

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
          <legend className={styles.legend}>Ingrese los datos del huésped</legend>
          <div className={styles.containerAllInputs}>
            <div className={styles.containerInput}>
              <label htmlFor="Apellido">Apellido</label>
              <input type="text" name="Apellido" placeholder="Apellido"/>
            </div>

            <div className={styles.containerInput}>
              <label htmlFor="Nombre">Nombre</label>
              <input type="text" name="Nombre" placeholder="Nombre"/>
            </div>
            
            <div className={styles.containerInput}>
              <label htmlFor="TipoDocumento">Tipo Documento</label>
              <select name="TipoDocumento">
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
              <input type="text" name="NumeroDocumento" placeholder="Numero Documento"/>
            </div>
          </div>
        </fieldset>
      </form>
    </div>

    <div>
      <fieldset className= {`${styles.formButtons} ${styles.fieldset}`} disabled={cargando}>
        <input
        type="reset"
        value="Cancelar"
        form ="formulario"
        className={styles.btnCancelar}
        onClick={cancelarBusqueda}
        />
        <input
        type="submit"
        value={cargando ? "Buscando..." : "Buscar"}
        form ="formulario"
        className={`${styles.btnSiguiente} ${cargando ? styles.desactivado : null}`}
        disabled={cargando}
        onClick={() => setSeleccionado(null)}
        />
      </fieldset>
    </div>

    <div className={styles.containerResponse}>
      {mostrarBusqueda()}
    </div>
    </>
  );
}