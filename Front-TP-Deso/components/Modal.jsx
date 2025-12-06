import React from 'react';
import styles from './Modal.module.css'; 

export default function FeedbackModal({ visible, tipo, titulo, mensaje, acciones }) {
  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles[tipo]}`}>
        
        <span className={styles.modalIcon}>
          {tipo === 'exito' && '✅'}
          {tipo === 'error' && '⛔'}
          {tipo === 'documento_duplicado' && '⚠️'}
          {tipo === 'advertencia' && '⚠️'}
          {tipo === 'confirmacion' && '❓'}
        </span>

        <h2 className={styles.modalTitulo}>{titulo}</h2>
        <p className={styles.modalMensaje}>{mensaje}</p>

        <div className={styles.botonesContainer}>
          {acciones && acciones.map((accion, index) => (
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
    </div>
  );
}