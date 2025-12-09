
const API_URL_HABITACIONES = "http://localhost:8080/api/habitaciones";
const API_URL_RESERVAS = "http://localhost:8080/api/reservas";

export const obtenerEstadoHabitaciones = async (desde, hasta) => {
  const response = await fetch(`${API_URL_HABITACIONES}/estado?desde=${desde}&hasta=${hasta}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) throw new Error("Error al obtener estado de habitaciones");
  return await response.json();
};

export const crearReserva = async (payload) => {
  const response = await fetch(API_URL_RESERVAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al procesar la reserva");
  }
  const texto = await response.text();
  return { mensaje: texto };
};

export const obtenerReservasPendientes = async (filtros) => {
    const params = new URLSearchParams();
  Object.keys(filtros).forEach((key) => {
    if (filtros[key]) params.append(key, filtros[key]);
  });

  const response = await fetch(`${API_URL_RESERVAS}/pendientes?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Error al obtener reservas pendientes");
  return await response.json();
};

export const cancelarReserva = async (ids) => {

  const response = await fetch(`${API_URL_RESERVAS}/cancelar`,{
          method: "POST", 
          headers: { 
              "Content-Type": "application/json" 
          },
          body: JSON.stringify(ids), 
      });

  if (!response.ok) {
          const errorData = await response.text(); 
          throw new Error(`Error al cancelar la/s reserva/s: ${errorData || response.statusText}`);
      }
  return await response.text();
};