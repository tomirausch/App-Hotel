
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