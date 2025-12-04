export const validarHuesped = (formData) => {
  const errores = {};

  const camposObligatorios = [
    "Apellido", "Nombre", "TipoDocumento", "NumeroDocumento", 
    "PosicionIVA", "FechaNacimiento", "NumeroTelefono", 
    "Ocupacion", "Nacionalidad", "Calle", "Numero", 
    "CP", "Pais", "Provincia", "Localidad"
  ];

  camposObligatorios.forEach((campo) => {
    const valor = formData.get(campo);
    if (!valor || valor.toString().trim() === "") {
      errores[campo] = "Este campo es obligatorio";
    }
  });

  const posicionIVA = formData.get("PosicionIVA");
  const cuit = formData.get("CUIT");

  
  if (posicionIVA === "ResponsableInscripto") {
    if (!cuit || cuit.toString().trim() === "") {
      errores["CUIT"] = "El CUIT es obligatorio para esta condición fiscal";
    }
  }

  const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;
  
  const nombre = formData.get("Nombre");
  if (nombre && !regexSoloLetras.test(nombre.toString())) {
    errores["Nombre"] = "El nombre solo puede contener letras y espacios";
  }

  const apellido = formData.get("Apellido");
  if (apellido && !regexSoloLetras.test(apellido.toString())) {
    errores["Apellido"] = "El apellido solo puede contener letras y espacios";
  }

  const email = formData.get("Email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email.toString())) {
    errores["Email"] = "Formato de email inválido";
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};