import styles from "../../styles/ReservarHabitacion.module.css"
import Head from 'next/head';

export default function ReservarHabitacion() {

  const enviarDatos = async (e) =>{

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
        console.log(contenido)
      } else {
      }
    } catch (e){
    }finally{
    };

  }
  return (
    <>
      <Head>
        <title>Reservar Habitación</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/logoHotel.ico?v=2" />
        <link rel="icon" href="/logoHotel.ico?v=2" />
      </Head>

      <div>
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
      </div>

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
    </>
  );
}