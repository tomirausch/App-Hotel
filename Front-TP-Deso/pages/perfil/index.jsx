import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "../../styles/Perfil.module.css"

export default function Perfil({ onLogout }) { 
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const nombreGuardado = sessionStorage.getItem('nombreUsuario');
      const sesionActiva = sessionStorage.getItem('usuarioLogueado'); 

      if (nombreGuardado && sesionActiva) {
        setUsuario(nombreGuardado);
      } else {
        router.push('/'); 
      }
    }
  }, [router]);

  const handleBotonLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push('/'); 
    }
  };

  return (
    <>
    <Head>
      <title>Perfil</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/hotel-icon.ico?v=2" />
      <link rel="icon" href="/hotel-icon.ico?v=2" />
    </Head>

    <div className={styles.mainContainer}>
      <div className={styles.userBoxContainer}>

        <div className={styles.avatarContainer}>
          <img className={styles.avatarImage} src="avatar.png" alt="avatar" />
        </div>

        <div className={styles.userNameContainer}>
          <h2>{usuario}</h2>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <input className={styles.botonCerrar} type="button" value="CERRAR SESION"
        onClick={handleBotonLogout} />
      </div>
    </div>
    </>
  );
}