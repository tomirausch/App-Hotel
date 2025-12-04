const API_URL_BASE = "http://localhost:8080/api";

export const obtenerEstadoHabitaciones = async (desde, hasta) => {
  const response = await fetch(`${API_URL_BASE}/habitaciones/estado?desde=${desde}&hasta=${hasta}`);
  if (!response.ok) throw new Error("Error al obtener disponibilidad");
  return await response.json();
};

export const crearOcupacion = async (payload) => {
  const response = await fetch(`${API_URL_BASE}/estadias/ocupar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al procesar la ocupación");
  }
  return await response.json(); 
};