import React, { useState } from 'react';
import styles from "./LoginModal.module.css";
import { validarPassword } from '@/utils/validaciones';
import { login } from '@/services/authService';

export default function LoginModal({ onLoginSuccess }) {
  const [form, setForm] = useState({ nombre: '', contrasena: '' });
  
  const [errores, setErrores] = useState({}); 
  
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errores[name]) {
        setErrores(prev => ({ ...prev, [name]: null }));
    }
    if (errores.general) {
        setErrores(prev => ({ ...prev, general: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nuevosErrores = {};
    if (!form.nombre.trim()) {
        nuevosErrores.nombre = "El usuario es obligatorio";
    }
    const validacionPass = validarPassword(form.contrasena);
    if (!validacionPass.valido) {
        nuevosErrores.contrasena = validacionPass.mensaje;
    }
    if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return;
    }

    setCargando(true);
    try {
      await login(form.nombre, form.contrasena);
      sessionStorage.setItem("usuarioLogueado", "true");
      onLoginSuccess();
      sessionStorage.setItem('nombreUsuario', form.nombre);
    } catch (err) {
      setErrores({ general: err.message || "Usuario o contraseña incorrectos" });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
            <img src="/avatar.png" alt="Login" className={styles.avatar} />
        </div>
        <h2 className={styles.titulo}>Bienvenido</h2>
        <p className={styles.subtitulo}>Inicie sesión para continuar</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label>Usuario</label>
            <input 
              type="text" 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              autoFocus
              autoCapitalize="none"
              className={errores.nombre ? styles.inputError : ''}
            />
            {errores.nombre && <span className={styles.mensajeError}>{errores.nombre}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Contraseña</label>
            <div className={styles.passwordWrapper}>
                <input 
                  type={mostrarPassword ? "text" : "password"} 
                  name="contrasena" 
                  value={form.contrasena} 
                  onChange={handleChange}
                  placeholder="Ingrese su contraseña"
                  className={errores.contrasena ? styles.inputError : ''}
                />
                
                <button 
                  type="button" 
                  className={styles.toggleBtn}
                  style={{display: 'flex', justifyContent: "center"}}
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  tabIndex="-1" 
                >
                  {mostrarPassword ?
                   <img style={{height: "25px"}} src="mostrar.png" alt="mostrar" /> :
                    <img style={{height: "25px"}} src="esconder.png" alt="esconder" />} 
                </button>
            </div>
            {errores.contrasena && <span className={styles.mensajeError}>{errores.contrasena}</span>}
          </div>

          {errores.general && <div className={styles.errorGeneral}>{errores.general}</div>}

          <button type="submit" className={styles.btnLogin} disabled={cargando}>
            {cargando ? "Ingresando..." : "INGRESAR"}
          </button>
        </form>
      </div>
    </div>
  );
}