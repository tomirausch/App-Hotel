import styles from "../styles/Home.module.css"
import Link from "next/link";

export default function Home() {
  return (
    <>

      <div className={styles.container}>

        <Link href="/dar-alta-huesped" className={styles.link}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Dar Alta Huésped</h2>
          <div className={styles.boxImage}>
            <img className={styles.styleImage} src="/agregar-usuario.png" alt=""/>
          </div>
        </div>
        </Link>
        
        <Link href="/buscar-huesped" className={styles.link}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Buscar Huésped</h2>
          <div className={styles.boxImage}>
            <img className={styles.styleImage} src="/lupa.png" alt=""/>
          </div>
        </div>
        </Link>


        <Link href="/reservar-habitacion" className={styles.link}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Reservar Habitación</h2>
          <div  className={styles.boxImage}>
            <img className={styles.styleImage} src="/reserva.png" alt="" />
          </div>
        </div>
        </Link>

        <Link href="/ocupar-habitacion" className={styles.link}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Ocupar Habitación</h2>
          <div  className={styles.boxImage}>
            <img className={styles.styleImage} src="/tarjeta-clave.png" alt="" />
          </div>
        </div>
        </Link>

        <Link href="/cancelar-reserva" className={styles.link}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Cancelar Reserva</h2>
          <div  className={styles.boxImage}>
            <img className={styles.styleImage} src="/cancelar-reserva.png" alt="" />
          </div>
        </div>
        </Link>

        <Link href="/facturar" className={styles.link}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Facturar</h2>
          <div  className={styles.boxImage}>
            <img className={styles.styleImage} src="/facturas-de-papel.png" alt="" />
          </div>
        </div>
        </Link>
    </div>
    </>
  );
}
