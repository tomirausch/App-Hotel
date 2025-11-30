import styles from "../../styles/ReservarHabitacion.module.css"
import Head from 'next/head';
import { useState, useMemo, useEffect } from "react";

export default function ReservarHabitacion() {

  const [habitaciones, setHabitaciones] = useState([]);
  let habs = [];

  const enviarDatos = async (e) =>{
    setHabitaciones([]);
    e.preventDefault();
    const formData = new FormData(e.target);

    const datos = {
      Desde: formData.get('Desde'),
      Hasta: formData.get('Hasta')
    };

    const query = `http://localhost:8080/api/habitaciones/estado?desde=${datos.Desde}&hasta=${datos.Hasta}`;

      try{
        const respuesta = await fetch(query, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

        if(respuesta.ok){ 
          const contenido = await respuesta.json();
          console.log("1. Crudo: ", contenido);
          setHabitaciones(contenido);
        } else {
        }
      } catch (e){
        
        e.log(e);
      }finally{

      };
  };  

  const ordenarDatos = useMemo(() => {
    if (!habitaciones) return [];

    return [...habitaciones].sort((a, b) => {
      // 1. CRITERIO: TIPO DE HABITACIÓN (String)
      // Usamos toLowerCase() para evitar problemas de mayúsculas
      const tipoA = a.tipoHabitacion.toString().toLowerCase();
      const tipoB = b.tipoHabitacion.toString().toLowerCase();

      if (tipoA < tipoB) return -1;
      if (tipoA > tipoB) return 1;

      // 2. CRITERIO: NÚMERO DE HABITACIÓN (Int)
      // Forzamos a entero para que 2 sea menor que 10
      const numA = parseInt(a.numero);
      const numB = parseInt(b.numero);

      if (numA < numB) return -1;
      if (numA > numB) return 1;

      // 3. CRITERIO: FECHA (Date)
      // Convertimos a objeto Date y restamos
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);

      return fechaA - fechaB;
    });
  }, [habitaciones]);

  const mostrarResultados = () => {
    const habsOrdenadas = ordenarDatos;
    console.log("Habs ordenadas: ", habsOrdenadas);
    const fechas = new Set();
    habsOrdenadas.forEach(hab => {
      fechas.add(hab.fecha);
    });

    console.log("Fechas únicas: ", Array.from(fechas));
    let cont = 0;
    let max = fechas.size;
return (
  <>
  <div className={styles.contenedorFechas}>
    <div className={styles.titulosContainer}>
       <h3 className={styles.tituloFechas}>Tipo:</h3>
       <h3 className={styles.tituloFechas}>Numero:</h3>
       <h3 className={styles.tituloFechas}>Fechas:</h3>
    </div>
    {Array.from(fechas).map((fecha, index) => (
      <div key={index} className={styles.fechaContainer}>
        <h3 className={styles.fecha}>{fecha}</h3>
      </div>
    ))}
  </div>

  <div className={styles.contenedorResultados}>
    {habsOrdenadas.map((hab, index) => {
      if(cont === 0 ){
        cont++;
        return(
        <>
        <div className={styles.tipoYNumeroContainer}>
          <h3 className={styles.tituloTipo}>{hab.tipoHabitacion}</h3>
          <p className={styles.textoNumero}>{hab.numero}</p>
        </div>
        <div className={styles.estadoContainer}>
          <p>{hab.estado}</p>
        </div>
        </>
        )
      }else{
        cont++;
        if(cont === max){
          cont = 0;
        }
        return(
          <div className={styles.estadoContainer}>
            <p>{hab.estado}</p>
          </div>
        )
      }
    })}
  </div>
  </>
);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/hotel-icon.ico?v=2" />
        <link rel="icon" href="/hotel-icon.ico?v=2" />
      </Head>

      <div className={styles.contenedorPrincipal}>
        <form onSubmit={enviarDatos} className={styles.formulario} action="" id="formulario">
          <fieldset className={styles.fieldset}>
            <div className={styles.legendContainer}>
              <legend className={styles.legend}>Ingrese las fechas</legend>
            </div>
            <div className={styles.allInputContainer}>

              <div className={styles.inputContainer}>
                <label htmlFor="Desde">Desde</label>
                <input type="date" name="Desde" id="" />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="Hasta"> Hasta</label>
                <input type="date" name="Hasta" id="" />
              </div>

            </div>
          </fieldset>
        </form>

        <div className={styles.formButtons}>
        <input
        type="reset"
        value="Cancelar"
        form="formulario"
        className={styles.btnCancelar}/>

        <input
        type="submit"
        value="Siguiente"
        form="formulario"
        className={styles.btnSiguiente}/>
      </div>

      <div className={styles.containerResponse}>
        {mostrarResultados()}
      </div>
      </div>
    </>
  )
}