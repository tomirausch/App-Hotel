
export const fechasEntreFechas = (fechaA, fechaB) => {
  const fechas = [];
  let fechaActual = new Date(fechaA);
  const fechaFinal = new Date(fechaB);
  
  if (isNaN(fechaActual) || isNaN(fechaFinal)) return [];
  
  while (fechaActual <= fechaFinal) {
    fechas.push(fechaActual.toISOString().split('T')[0]);
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  return fechas;
};

export const formatearFecha = (fechaString) => {
  if (!fechaString) return "";
  return fechaString.split('-').reverse().join('-');
};

export const obtenerNombreDia = (fechaObj) => {
  const nombre = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
};

export const formatearFechaHora = (fechaString, hora) => {
  if (!fechaString) return "";
  const [anio, mes, dia] = fechaString.split('-');
  const fechaObj = new Date(anio, mes - 1, dia);
  const nombreDia = obtenerNombreDia(fechaObj);
  return `${nombreDia}, ${dia}/${mes}/${anio}, ${hora}`;
};