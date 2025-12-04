const API_URL = "https://restcountries.com/v3.1/all?fields=translations,cca2";

/**
 * Obtiene la lista de países, la formatea y la ordena alfabéticamente.
 * @returns {Promise<Array>} Lista de objetos { codigo, nombre }
 */

export const cargarPaises = async () => {
    try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener países");

    const countries = await response.json();

    const listaOrdenada = countries
        .map(c => ({
        codigo: c.cca2,
        nombre: c.translations?.spa?.common || c.translations?.eng?.common || "Desconocido"
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    return listaOrdenada;

    } catch (error) {
        console.error("❌ Error al cargar países:", error);
        return [];
    }
};