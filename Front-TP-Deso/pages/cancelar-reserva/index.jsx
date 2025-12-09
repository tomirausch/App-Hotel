import styles from "@/styles/CancelarReserva.module.css"
import React, {use, useState} from "react"
import { cancelarReserva, obtenerReservasPendientes} from "@/services/reservaService";
import { validarBuesquedaReserva } from "@/utils/validaciones";
import { formatearFecha } from "@/utils/dates";
import { minusculaConPrimeraMayuscula } from "@/utils/strings";
import Modal from "@/components/Modal";

export default function CancelarReserva(){
    const [reservas, setReservas] = useState([]);
    const [errores, setErrores] = useState([])
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [reservaSeleccionada, setReservaSeleccionada] = useState([])
    const [buscando, setBuscando] = useState(false);
    const [cancelando, setCancelando] = useState(false);
    const [modalConfig, setModalConfig] = useState({
    visible: false,
    tipo: "",
    titulo: "",
    mensaje: "",
    acciones: [],
    });

    const cerrarModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));
    
    const handleEnvio = async (e) =>{

        e.preventDefault();
        setBusquedaRealizada(false);
        setReservas([]);
        const formData = new FormData(e.target);

        const validacion = validarBuesquedaReserva(formData);
        if (!validacion.esValido) {
        setErrores(validacion.errores);
        console.log("Errores: ", errores);
        return;
        }

        console.log("Errores: ", errores);

        const filtros = {
            nombre: formData.get('Nombre'),
            apellido: formData.get('Apellido')
        }

        try{
            setBuscando(true)
            const respuesta = await obtenerReservasPendientes(filtros);
            console.log("Nombre: ", filtros.nombre, "Apellido: ", filtros.apellido)
            setReservas(respuesta);
            setBusquedaRealizada(true);
        }
        catch (error){
            console.error(error)
        }
        finally{
            setBuscando(false);
        }
    }

    const handleCancelarReserva = async (e) => {
        
        e.preventDefault();
        setCancelando(true);

        try{
            const respuesta = await cancelarReserva(reservaSeleccionada)
                setModalConfig({
                    visible: true,
                    tipo: "exito",
                    titulo: reservaSeleccionada.length === 1 ? "Reserva Cancelada" : "Reservas Canceladas",
                    mensaje: reservaSeleccionada.length === 1 ? "Su reserva fue cancelada con éxito" : `Sus ${reservas.length} reservas fueron canceladas con éxito`,
                    acciones : [
                        { texto: "Entendido", estilo: "aceptar", onClick: () => location.reload() }
                    ]
                });
                setReservaSeleccionada([]);
        } catch (error){
            setModalConfig({
                    visible: true,
                    tipo: "error",
                    titulo: "Ocurrio un error",
                    mensaje: error.message || "Ha ocurrido un error inesperado",
                    acciones : [
                        { texto: "Entendido", estilo: "aceptar", onClick: cerrarModal }
                    ]
                });
        } finally{
            setCancelando(false);
        }
    }
    
    const mostrarBusqueda = () => {
        const reservasARellenar = () => {
            const modulo = reservas.length % 3;
            const rellenoNecesario = modulo === 0 ? 0 : 3 - modulo; 
            return Array(rellenoNecesario).fill(null);
        }

        return(
            reservas.length === 0 ?
            <div style={{display: "flex", justifyContent: "center"}}>
                No hay resultados para su busqueda
            </div>
            : 
            <>
            <div className={styles.reservasContainer}>

                {reservas.map((reserva)=>(
                    <div
                    key={reserva.id}
                    className={`${styles.reservaRespuestaContainer} ${ reservaSeleccionada.includes(reserva.id) ? styles.seleccionada : null}`}
                    onClick={()=>{
                        if(reservaSeleccionada.includes(reserva.id)){
                            setReservaSeleccionada(reservaSeleccionada.filter(id => id !== reserva.id));
                        } else{
                            setReservaSeleccionada([...reservaSeleccionada, reserva.id])
                        }
                    }}
                    >
                        <p><b>Titular:</b> {minusculaConPrimeraMayuscula(reserva.nombreHuesped)} {minusculaConPrimeraMayuscula(reserva.apellidoHuesped)}</p>
                        <p><b>Habitación:</b> {reserva.numeroHabitacion} {reserva.nombreTipoHabitacion}</p>
                        <p><b>Desde:</b> {formatearFecha(reserva.fechaDesde)} | <b> Hasta:</b> {formatearFecha(reserva.fechaHasta)}</p>
                    </div>
                ))} 

                {reservasARellenar().map((_, index) => (
                    <div 
                        key={`filler-${index}`} 
                        className={styles.reservaRespuestaContainer} 
                    />
                ))}

            </div>
            </>
        )
    }

    return(
    <div style={{display: "flex", flexDirection: "column" ,justifyContent: "center", alignItems:"center"}}>

        <div style={{width: "600px"}} className={styles.formContainer}>

            <form id="formHuesped" onSubmit={handleEnvio} className={styles.form}>

                <fieldset style={{border: "none", width:"100%"}}>

                    <legend style={{fontWeight: "bolder", marginBottom: "10px", marginLeft: "10px"}}>Buscar Reserva del Huesped</legend>

                    <div className={styles.allInputContainer}>

                        <div className={styles.inputFormContainer}>
                        <label htmlFor="Nombre">Nombre</label>
                        <input type="text" name="Nombre" placeholder="Nombre" 
                        onInput={(e) => e.target.value = e.target.value.toUpperCase()}/>
                        </div>

                        <div className={styles.inputFormContainer}>
                        <label htmlFor="Apellido">Apellido*</label>
                        <input type="text" name="Apellido" placeholder="Apellido" 
                        onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                        className={`${errores.Apellido ? styles.inputError : ''} ${styles.inputMayuscula}`}
                        onChange={() => setErrores({...errores, Apellido: null})}
                        />
                        
                        {errores.Apellido && <span className={styles.mensajeError}>{errores.Apellido}</span>}

                        </div>

                    </div>

                </fieldset>
            </form>
        </div>

        <div className={styles.buttonContainer}>

            <input type="reset" form="formHuesped" value="CANCELAR" className = "btnCancelar btnBase"
            onClick={() => {
                setErrores({...errores, Apellido: null});
                setBusquedaRealizada(false);
                setReservas([]);
                setBuscando(false);
            }}
            />

            <input type="submit" form="formHuesped" value={buscando ? "BUSCANDO..." : "BUSCAR"} disabled={buscando} className = {`btnSiguiente btnBase ${buscando && styles.desactivado}`}/>

        </div>

        <div className={styles.responseContainer}>
            {busquedaRealizada? mostrarBusqueda() :
            <div style={{display: "flex", justifyContent: "center"}}>
                {buscando ? "Buscando..." : "Realice una busqueda."}
            </div>
            }     
        </div>

        { reservaSeleccionada.length > 0 &&
        <div className={styles.buttonContainer}>
            <input type="button"
            value="BORRAR SELECCION"
            className = {`btnCancelar btnBase ${cancelando && styles.desactivado}`}
            style={{backgroundColor: "orange"}}
            disabled = {cancelando}
            onClick={() => {
                setReservaSeleccionada([]);
            }}
            />

            <input type="button"
            value={cancelando ? "CANCELANDO..." : (reservaSeleccionada.length === 1 ? "CANCELAR 1 RESERVA" : `CANCELAR ${reservaSeleccionada.length} RESERVAS`)}
            className = {`btnCancelar btnBase ${cancelando && styles.desactivado}`}
            disabled = {cancelando}
            onClick={handleCancelarReserva}
            />

        </div>
        }

        <Modal {...modalConfig}/>

    </div>
    )
}