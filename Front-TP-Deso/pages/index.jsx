import styles from "../styles/Home.module.css"
import Link from "next/link";

export default function Home() {
  return (
    <>

    
      <div className={styles.container}>

        <Link href="/dar-alta-huesped" style={{textDecoration: "none"}}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Dar Alta Huesped</h2>
          <div className={styles.boxImage}>
            <img style={{height: "100px", filter: "invert(1)"}} src="/agregar-usuario.png" alt=""/>
          </div>
        </div>
        </Link>
        
        <Link href="/buscar-huesped" style={{textDecoration: "none"}}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Buscar Huesped</h2>
          <div className={styles.boxImage}>
            <img style={{height: "100px", filter: "invert(1)"}} src="/lupa.png" alt=""/>
          </div>
        </div>
        </Link>


        <Link href="/reservar-habitacion" style={{textDecoration: "none"}}>
        <div className={styles.box}>
          <h2 className={styles.boxTitle}>Reservar Habitacion</h2>
          <div  className={styles.boxImage}>
            <img style={{height: "100px", filter: "invert(1)"}} src="/reserva.png" alt="" />
          </div>
        </div>
        </Link>
    </div>
    </>
  );
}
