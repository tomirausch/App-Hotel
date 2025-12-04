
const mapTipoDocumento = (v) => {
  if (!v) return null;
  const t = v.trim().toUpperCase();
  const validos = ["DNI", "LE", "LC", "PASAPORTE", "OTRO"];
  return validos.includes(t) ? t : "OTRO";
};

const mapPosicionIVA = (v) => {
  if (!v) return null;
  const k = v.trim().toUpperCase().replace(/\s+/g, "");
  switch (k) {
    case "CONSUMIDORFINAL": return "CONSUMIDOR_FINAL";
    case "MONOTRIBUTO":     return "MONOTRIBUTISTA";
    case "RESPONSABLEINSCRIPTO": return "RESPONSABLE_INSCRIPTO";
    case "EXCENTO":
    case "EXENTO":          return "EXENTO";
    case "NORESPONSABLE":   return "NO_RESPONSABLE";
    default: return null;
  }
};

const isoOrNull = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null);
const numOrNull = (n) => (n === undefined || n === null || n === "" ? null : Number(n));

export const mapearHuespedParaApi = (formData) => {
  const raw = {
    Nombre: formData.get("Nombre"),
    Apellido: formData.get("Apellido"),
    TipoDocumento: formData.get("TipoDocumento"),
    NumeroDocumento: formData.get("NumeroDocumento"),
    FechaNacimiento: formData.get("FechaNacimiento"),
    Email: formData.get("Email"),
    NumeroTelefono: formData.get("NumeroTelefono"),
    Ocupacion: formData.get("Ocupacion"),
    Nacionalidad: formData.get("Nacionalidad"),
    Calle: formData.get("Calle"),
    Numero: formData.get("Numero"),
    Departamento: formData.get("Departamento"),
    Piso: formData.get("Piso"),
    CP: formData.get("CP"),
    Localidad: formData.get("Localidad"),
    Provincia: formData.get("Provincia"),
    Pais: formData.get("Pais"),
    PosicionIVA: formData.get("PosicionIVA"),
    CUIT: formData.get("CUIT"),
  };
  return {
    nombre:          raw.Nombre || null,
    apellido:        raw.Apellido || null,
    tipoDocumento:   mapTipoDocumento(raw.TipoDocumento),
    numeroDocumento: raw.NumeroDocumento || null,
    fechaNacimiento: isoOrNull(raw.FechaNacimiento),
    email:           raw.Email || null,
    telefono:        raw.NumeroTelefono || null,
    ocupacion:       raw.Ocupacion || null,
    nacionalidad:    raw.Nacionalidad || null,

    calle:           raw.Calle || null,
    numero:          numOrNull(raw.Numero),
    departamento:    raw.Departamento || null,
    piso:            numOrNull(raw.Piso),
    codigoPostal:    raw.CP || null,
    localidad:       raw.Localidad || null,
    provincia:       raw.Provincia || null,
    pais:            raw.Pais || null,

    posicionIVA:     mapPosicionIVA(raw.PosicionIVA),
    cuit:            raw.CUIT || null
  };
};