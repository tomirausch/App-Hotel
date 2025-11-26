// CARGA PAISES
document.addEventListener("DOMContentLoaded", async () => {
  const selectPais = document.getElementById("Pais");

  try {
    // Endpoint correcto (sin errores 400)
    const response = await fetch("https://restcountries.com/v3.1/all?fields=translations,cca2");
    if (!response.ok) throw new Error("Error al obtener países");

    const countries = await response.json();

    // Filtramos y ordenamos los nombres en español
    const lista = countries
      .map(c => ({
        codigo: c.cca2,
        nombre: c.translations?.spa?.common || c.translations?.eng?.common || "Desconocido"
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Llenar el select
    lista.forEach(pais => {
      const option = document.createElement("option");
      option.value = pais.nombre;
      option.textContent = pais.nombre;
      selectPais.appendChild(option);
    });

    console.log(`✅ ${lista.length} países cargados correctamente`);
  } catch (error) {
    console.error("❌ Error al cargar países:", error);
    selectPais.innerHTML = '<option value="">Error al cargar países</option>';
  }
});

// FORMULARIO

const ENDPOINT = "/api/huespedes";

// === Mapeos a enums del backend ===
const mapTipoDocumento = (v) => {
  if (!v) return null;
  const t = v.trim().toUpperCase();
  return ["DNI", "LE", "LC", "PASAPORTE", "OTRO"].includes(t) ? t
       : (t === "PASAPORTE" || t === "PASAPORTE") ? "PASAPORTE"
       : "OTRO";
};

const mapPosicionIVA = (v) => {
  if (!v) return null;
  const k = v.trim().toUpperCase().replace(/\s+/g, "");
  switch (k) {
    case "CONSUMIDORFINAL": return "CONSUMIDOR_FINAL";
    case "MONOTRIBUTO":     return "MONOTRIBUTISTA";
    case "RESPONSABLEINSCRIPTO": return "RESPONSABLE_INSCRIPTO";
    case "EXCENTO":         // así viene en el select
    case "EXENTO":          return "EXENTO";
    case "NORESPONSABLE":   return "NO_RESPONSABLE";
    default: return null;
  }
};

// === Transformar datos del form -> modelo Huesped (backend) ===
function mapearFrontAApi(data) {
  const isoOrNull = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null);
  const numOrNull = (n) => (n === undefined || n === null || n === "" ? null : Number(n));

  return {
    nombre:          data.Nombre || null,
    apellido:        data.Apellido || null,
    tipoDocumento:   mapTipoDocumento(data.TipoDocumento),
    numeroDocumento: data.NumeroDocumento || null,
    fechaNacimiento: isoOrNull(data.FechaNacimiento),
    email:           data.Email || null,
    telefono:        data.NumeroTelefono || null,
    ocupacion:       data.Ocupacion || null,
    nacionalidad:    data.Nacionalidad || null,

    // Dirección (Persona)
    calle:           data.Calle || null,
    numero:          numOrNull(data.Numero),
    departamento:    data.Departamento || null,
    piso:            numOrNull(data.Piso),
    codigoPostal:    data.CP || null,
    localidad:       data.Localidad || null,
    provincia:       data.Provincia || null,
    pais:            data.Pais || null,

    // Fiscales
    posicionIVA:     mapPosicionIVA(data.PosicionIVA),
    cuit:            data.CUIT || null
  };
}

const form = document.getElementById('formulario');
const mensaje = document.getElementById('mensaje');

const modalDuplicado = document.getElementById("modalDuplicado");
const modalCancelar = document.getElementById("modalCancelar");

const btnAceptarIgualmente = document.getElementById("btnAceptarIgualmente");
const btnCorregir = document.getElementById("btnCorregir");
const btnCancelarSi = document.getElementById("btnCancelarSi");
const btnCancelarNo = document.getElementById("btnCancelarNo");
const botonCancelar = document.getElementById("btnCancelar");
const btnCancelarDuplicado = document.getElementById("btnCancelarDuplicado");

const modalExito = document.getElementById("modalExito");
const mensajeExito = document.getElementById("mensajeExito");
const btnCargarOtro = document.getElementById("btnCargarOtro");
const btnFinalizar = document.getElementById("btnFinalizar");


form.querySelectorAll('input, select').forEach((input) => {
  const limpiarError = () => {
    input.classList.remove('input-error');
    const siguiente = input.nextElementSibling;
    if (siguiente && siguiente.classList.contains('error-mensaje')) {
      siguiente.remove();
    }
  };
  input.addEventListener('input', limpiarError);
  input.addEventListener('change', limpiarError);
});

// Limpia el error del CUIT si ya no corresponde exigirlo
const selectIVA = form.querySelector('[name="PosicionIVA"]');
const inputCUIT = form.querySelector('[name="CUIT"]');

selectIVA.addEventListener("change", () => {
  if (selectIVA.value !== "ResponsableInscripto") {
    const errorMsg = inputCUIT.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains("error-mensaje")) {
      errorMsg.remove();
    }
    inputCUIT.classList.remove("input-error");
  }
});

function mostrarErrores(errores) {
  mensaje.textContent = "Por favor, corrige los errores resaltados.";
  mensaje.style.color = "red";
  for (let campo in errores) {
    const input = form.querySelector(`[name="${campo}"]`);
    if (input) {
      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-mensaje');
      errorMsg.textContent = errores[campo];
      input.insertAdjacentElement('afterend', errorMsg);
      input.classList.add('input-error');
    }
  }
}

function recolectarDatos() {
  const fd = new FormData(form);
  const data = {};
  fd.forEach((v, k) => data[k] = (typeof v === 'string' ? v.trim() : v));
  return data;
}

function validar(data) {
  const errores = {};
  const camposObligatorios = [
    "Apellido", "Nombre", "TipoDocumento", "NumeroDocumento",
    "PosicionIVA", "FechaNacimiento", "NumeroTelefono",
    "Ocupacion", "Nacionalidad", "Calle", "Numero",
    "CP", "Localidad", "Provincia",  "Pais"
  ];

  camposObligatorios.forEach(campo => {
    if (!data[campo] || data[campo] === "") {
      errores[campo] = "Este campo es obligatorio.";
    }
  });

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  ["Nombre", "Apellido", "Ocupacion", "Nacionalidad"].forEach(campo => {
    if (data[campo] && !soloLetras.test(data[campo])) {
      errores[campo] = `El campo ${campo.toLowerCase()} solo debe contener letras.`;
    }
  });

  const tipoDoc = data.TipoDocumento;
  const numDoc  = data.NumeroDocumento;
  if (numDoc) {
    switch (tipoDoc) {
      case "Pasaporte":
        if (!/^[A-Z]{3}\d{6}$/i.test(numDoc))
          errores.NumeroDocumento = "Formato inválido. Ejemplo: ABC123456";
        break;
      case "DNI":
      case "LC":
      case "LE":
        if (!/^\d{7,8}$/.test(numDoc))
          errores.NumeroDocumento = "Debe tener 7 u 8 dígitos numéricos.";
        break;
      case "Otro":
        break;
      default:
        errores.TipoDocumento = "Debe seleccionar un tipo de documento.";
    }
  }

  if (data.CUIT && !/^(\d{11}|\d{2}-\d{8}-\d{1})$/.test(data.CUIT)) {
    errores.CUIT = "Debe tener 11 dígitos o formato XX-XXXXXXXX-X";
  }

  if (data.PosicionIVA === "ResponsableInscripto") {
    if (!data.CUIT || data.CUIT.trim() === "") {
        errores.CUIT = "El CUIT es obligatorio para un Responsable Inscripto.";
    }
  }

  if (data.NumeroTelefono && !/^\d{8,15}$/.test(data.NumeroTelefono.replace(/\D/g, ""))) {
    errores.NumeroTelefono = "El teléfono debe tener al menos 8 dígitos numéricos.";
  }

  if (data.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
    errores.Email = "Formato de correo electrónico inválido.";
  }

  if (data.FechaNacimiento) {
    const f = new Date(data.FechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - f.getFullYear();
    const mes  = hoy.getMonth() - f.getMonth();
    const menor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && hoy.getDate() < f.getDate())));
    if (menor) errores.FechaNacimiento = "Debe ser mayor de edad (mínimo 18 años).";
  }

  if (data.Numero !== undefined && data.Numero !== null && data.Numero !== "") {
    const numeroDireccion = Number(data.Numero);
    if (isNaN(numeroDireccion)) {
      errores.Numero = "Número inválido.";
    } else if (numeroDireccion < 0) {
      errores.Numero = "Número inválido.";
    }
  }
  return errores;
}

async function verificarDocumento(tipoDoc, numeroDoc) {
  if (!tipoDoc || !numeroDoc) return false;

  const tipoEnum = mapTipoDocumento(tipoDoc);
  if (!tipoEnum) return false;

  const params = new URLSearchParams({
    tipoDocumento: tipoEnum,
    numeroDocumento: numeroDoc.trim()
  });

  try {
    const res = await fetch(`${ENDPOINT}/existe-documento?` + params.toString());
    if (!res.ok) {
      console.error("Error al verificar documento:", res.status);
      return false; // dejo que el POST haga la validación fuerte
    }
    const existe = await res.json();
    return !!existe;
  } catch (e) {
    console.error("Error de red al verificar documento:", e);
    return false;
  }
}


async function enviarDatos(dataFront, forzar = false) {
  const payload = mapearFrontAApi(dataFront);
  console.log("➡️ Payload a API:", payload);

  const url = forzar ? `${ENDPOINT}?forzar=true` : ENDPOINT;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let body = null;
  try { body = await res.json(); } catch (_) {}

  if (res.ok) {
    const nombreCompleto = `${dataFront.Nombre?.toUpperCase() || ""} ${dataFront.Apellido?.toUpperCase() || ""}`.trim();
    mensajeExito.textContent = `El huésped ${nombreCompleto} ha sido satisfactoriamente cargado al sistema. ¿Desea cargar otro?`;
    modalExito.classList.remove("hidden");
    return body;
  }

  const detalle = body?.message || body?.error || body?.detalle || res.statusText;

  if (!forzar && (/existe/i.test(detalle) || res.status === 409)) {
    modalDuplicado.classList.remove("hidden");
  }

  throw new Error(`Error (${res.status}): ${detalle}`);
}



// =====================
// 5) FLUJO DE SUBMIT (ÚNICO)
// =====================
// --- Transformar texto a mayúsculas automáticamente ---
form.querySelectorAll('input[type="text"]').forEach((input) => {
  input.addEventListener('input', () => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.toUpperCase();
    // Mantiene la posición del cursor
    input.setSelectionRange(start, end);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // limpiar mensajes previos
  mensaje.textContent = "";
  mensaje.removeAttribute('style');
  document.querySelectorAll('.error-mensaje').forEach(el => el.remove());

  const data = recolectarDatos();
  console.log("📦 Datos que se enviarán al backend:", data);
  const errores = validar(data);
  if (Object.keys(errores).length > 0) {
    mostrarErrores(errores);
    return;
  }

  // 🔒 Desactivar el botón de envío (es un input[type=submit])
  const botonEnviar = document.querySelector('.form-buttons input[type="submit"]');
  if (botonEnviar) {
    botonEnviar.disabled = true;
    botonEnviar.value = "Enviando...";
    botonEnviar.style.opacity = "0.6";
    botonEnviar.style.cursor = "not-allowed";
  }

  try {
    // Verificar si el documento ya existe
    const existe = await verificarDocumento(data.TipoDocumento, data.NumeroDocumento);
    if (existe) {
      modalDuplicado.classList.remove("hidden");
      return;
    }

    // Enviar datos al backend
    await enviarDatos(data, false);

  } catch (err) {
    mensaje.textContent = err.message || "Error al conectar con el servidor.";
    mensaje.style.color = "red";
  } finally {
    // 🔓 Rehabilitar el botón
    if (botonEnviar) {
      botonEnviar.disabled = false;
      botonEnviar.value = "Siguiente";
      botonEnviar.style.opacity = "";
      botonEnviar.style.cursor = "";
    }
  }
});

if (btnAceptarIgualmente) {
  btnAceptarIgualmente.addEventListener("click", async () => {
    modalDuplicado.classList.add("hidden");
    const data = recolectarDatos();
    try {
      // ahora sí, forzamos el alta aunque el documento exista
      await enviarDatos(data, true);
    } catch (err) {
      mensaje.textContent = err.message || "Error al conectar con el servidor.";
      mensaje.style.color = "red";
    }
  });
}

if (btnCorregir) {
  btnCorregir.addEventListener("click", () => {
    modalDuplicado.classList.add("hidden");
    const campo = form.querySelector('[name="TipoDocumento"]');
    if (campo) campo.focus(); // volver al punto 2
  });
}

if (botonCancelar) {
  botonCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    modalCancelar.classList.remove("hidden");
  });
}

if (btnCancelarSi) {
  btnCancelarSi.addEventListener("click", () => {
    modalCancelar.classList.add("hidden");
    location.reload() // paso 6
  });
}

if (btnCancelarNo) {
  btnCancelarNo.addEventListener("click", () => {
    modalCancelar.classList.add("hidden");
    // volver al paso 1 manteniendo datos
  });
}

if (btnCancelarDuplicado) {
  btnCancelarDuplicado.addEventListener("click", () => {
    modalDuplicado.classList.add("hidden");
    modalCancelar.classList.remove("hidden"); // muestra la confirmación
  });
}

// --- Modal de éxito (Registro completado) ---
if (btnCargarOtro) {
  btnCargarOtro.addEventListener("click", () => {
    modalExito.classList.add("hidden");
    form.reset(); // limpia el formulario
    mensaje.textContent = "";
    console.log("Volviendo al punto 1 del flujo principal (nuevo alta)");
  });
}

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    modalExito.classList.add("hidden");
    mensaje.textContent = "✅ Registro finalizado correctamente.";
    mensaje.style.color = "green";
    console.log("Fin del Caso de Uso");
  });
}