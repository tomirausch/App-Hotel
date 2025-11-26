import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from "./LayoutHeader.module.css"
import Link from "next/link";

function LayoutHeader({ children }) {
  const [abierto, setAbierto] = useState(false);
  const botonMenu = () => setAbierto(!abierto);

  const router = useRouter();
  const titulos = {
    "/": "Bienvenido a Hotel Premier",
    "/perfil": "Mi Perfil de Usuario",
    "/dar-alta-huesped": "Dar Alta Huésped",
    "/buscar-huesped": "Buscar Huésped",
    "/reservar-habitacion": "Reservar Habitación"
  };
  const tituloActual = titulos[router.pathname];
  return (
    <>
      <header>
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li><button onClick={botonMenu} className={styles.botonMenu}><img className={styles.icons} src="/lista.png" alt="Menú" /></button></li>
            <li><Link href="/"><img className={styles.logoHotel} src="/logoHotel.png" alt="Logo hotel" /></Link></li>
            <li><Link href="/perfil"><img className={styles.icons} src="/avatar.png" alt="Perfil" /></Link></li>
          </ul>
        </nav>
        <div className={styles.containerTitulo}>
          <h1 className={styles.titulo}>{tituloActual}</h1>
        </div>
      </header>

      <div 
        className={`${styles.overlay} ${abierto ? styles.overlayOpen : ''}`} 
        onClick={botonMenu}
      ></div>

      <div className={`${styles.menu} ${abierto? styles.menuAbierto : ""}`}>
        
        <ul className={styles.ulMenu}>
          <div className={styles.buttonContainer}> 
          <button onClick = {botonMenu} className={`${styles.closeButton} ${styles.botonMenu}`}><img className={styles.icons} src="/lista.png" alt="Cerrar" /></button>
        </div>
          <li className={styles.opcionMenu}>
            <img className={styles.iconOption} src="/agregar-usuario.png" alt="Icon" />
            <Link onClick={botonMenu} className={styles.liMenu} href="/dar-alta-huesped">Dar Alta Huésped</Link>
          </li>
          <li className={styles.opcionMenu}>
            <img className={styles.iconOption} src="/lupa.png" alt="Icon" />
            <Link onClick={botonMenu} className={styles.liMenu} href="/buscar-huesped">Buscar Huésped</Link>
          </li>
          <li className={styles.opcionMenu}>
            <img className={styles.iconOption} src="/reserva.png" alt="Icon" />
            <Link onClick={botonMenu} className={styles.liMenu} href="/reservar-habitacion">Reservar Habitación</Link>
          </li>
        </ul>
      </div>

      <main>
        {children}
      </main>
    </>
  );
}


export default LayoutHeader;