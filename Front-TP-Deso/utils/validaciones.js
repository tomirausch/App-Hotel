export const validarHuesped = (formData) => {
  const errores = {};

  const camposObligatorios = [
    "Apellido",
    "Nombre",
    "TipoDocumento",
    "NumeroDocumento",
    "PosicionIVA",
    "FechaNacimiento",
    "NumeroTelefono",
    "Ocupacion",
    "Nacionalidad",
    "Calle",
    "Numero",
    "CP",
    "Pais",
    "Provincia",
    "Localidad",
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

export const validarBusquedaHuesped = (formData) => {
  const errores = {};
  const regexSoloLetras = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;

  const nombre = formData.get("Nombre");
  if (nombre && !regexSoloLetras.test(nombre.toString())) {
    errores["Nombre"] = "El nombre solo puede contener letras y espacios";
  }

  const apellido = formData.get("Apellido");
  if (apellido && !regexSoloLetras.test(apellido.toString())) {
    errores["Apellido"] = "El apellido solo puede contener letras y espacios";
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};

export const validarPassword = (password) => {
  if (!password)
    return { valido: false, mensaje: "La contraseña es obligatoria" };

  const cantidadLetras = (password.match(/[a-zA-Z]/g) || []).length;
  if (cantidadLetras < 5) {
    return { valido: false, mensaje: "Debe tener al menos 5 letras." };
  }

  const numeros = password.match(/\d/g) || [];
  if (numeros.length < 3) {
    return { valido: false, mensaje: "Debe tener al menos 3 números." };
  }

  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);

    if (esDigito(c1) && esDigito(c2) && esDigito(c3)) {
      const n1 = parseInt(password[i]);
      const n2 = parseInt(password[i + 1]);
      const n3 = parseInt(password[i + 2]);

      if (n1 === n2 && n2 === n3) {
        return {
          valido: false,
          mensaje: "No puede tener 3 números iguales consecutivos.",
        };
      }
      if (n1 + 1 === n2 && n2 + 1 === n3) {
        return {
          valido: false,
          mensaje: "No puede tener 3 números consecutivos crecientes.",
        };
      }
      if (n1 - 1 === n2 && n2 - 1 === n3) {
        return {
          valido: false,
          mensaje: "No puede tener 3 números consecutivos decrecientes.",
        };
      }
    }
  }

  return { valido: true };
};

const esDigito = (charCode) => charCode >= 48 && charCode <= 57;

export const validarResponsable = (formData) => {
  const errores = {};

  const camposObligatorios = [
    "razonSocial",
    "cuit",
    "telefono",
    "calle",
    "numero",
    "cp",
    "localidad",
    "provincia",
  ];

  camposObligatorios.forEach((campo) => {
    const valor = formData.get(campo);
    if (!valor || valor.toString().trim() === "") {
      errores[campo] = "Este campo es obligatorio";
    }
  });

  const cuit = formData.get("cuit");
  if (cuit && !/^\d+$/.test(cuit)) {
    errores["cuit"] = "El CUIT solo debe contener números";
  }

  const telefono = formData.get("telefono");
  if (telefono && !/^\d+$/.test(telefono)) {
    errores["telefono"] = "El teléfono solo debe contener números";
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};
