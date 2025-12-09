const API_URL = "http://localhost:8080/api/facturacion";

export const buscarOcupantes = async (numeroHabitacion, horaSalida) => {
  // Nota: horaSalida no se usa en el endpoint actual de estadias, pero se mantiene en la firma por compatibilidad
  const params = new URLSearchParams({ numeroHabitacion });
  // El endpoint correcto está en EstadiaController: /api/estadias/detalles
  const response = await fetch(
    `http://localhost:8080/api/estadias/detalles?${params.toString()}`
  );

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
