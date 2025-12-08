const API_URL = "http://localhost:8080/api/facturacion";

export const buscarOcupantes = async (numeroHabitacion, horaSalida) => {
  const params = new URLSearchParams({ numeroHabitacion, horaSalida });
  const response = await fetch(`${API_URL}/ocupantes?${params.toString()}`);

  if (!response.ok) {
    // Intentamos leer el mensaje del backend
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        "No se encontraron ocupantes o la habitación no está activa."
    );
  }
  return await response.json();
};

export const obtenerPreFactura = async (
  idEstadia,
  idResponsable,
  esPersonaJuridica
) => {
  const params = new URLSearchParams({
    idEstadia,
    idResponsable,
    esPersonaJuridica: esPersonaJuridica,
  });
  const response = await fetch(`${API_URL}/pre-factura?${params.toString()}`);

  if (!response.ok) throw new Error("Error al calcular la pre-factura.");
  return await response.json();
};

export const emitirFactura = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al emitir la factura.");
  }
  return await response.json();
};
