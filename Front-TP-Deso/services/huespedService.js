const API_URL = "http://localhost:8080/api/huespedes";

export const buscarHuespedes = async (filtros) => {
  const params = new URLSearchParams();
  Object.keys(filtros).forEach((key) => {
    if (filtros[key]) params.append(key, filtros[key]);
  });

  const response = await fetch(`${API_URL}/buscar?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al buscar huéspedes");
  }
  return await response.json();
};

export const crearHuesped = async (datosHuesped) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosHuesped),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear el huésped");
  }
  return await response.json();
};

export const actualizarHuesped = async (id, datosHuesped) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosHuesped),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al actualizar el huésped");
  }
  return await response.json();
};

export const buscarAcompanante = async (tipoDocumento, numeroDocumento) => {
  const params = new URLSearchParams({ tipoDocumento, numeroDocumento });
  const response = await fetch(
    `${API_URL}/buscar?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Error al buscar huéspedes");
  }
  return await response.json();
};

export const obtenerHuespedPorId = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el huésped");
  }
  return await response.json();
};

export const eliminarHuesped = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al eliminar el huésped");
  }
  return true;
};
