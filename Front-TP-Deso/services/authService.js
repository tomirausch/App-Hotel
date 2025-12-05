const API_URL = "http://localhost:8080/api/usuario";

export const login = async (nombre, contrasena) => {
  // NOTA: Asegúrate de que tu Backend tenga este endpoint implementado.
  // Si no lo tienes, descomenta el bloque "MOCK" para probar el frontend.
  
  // --- MOCK TEMPORAL (Para probar sin backend) --- 
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if(nombre === 'admin' && contrasena === 'Admin1259') resolve({ token: '123', nombre });
          else reject(new Error("Credenciales inválidas"));
      }, 1000);
  });
  //------------------------------------------------ 

/*   const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, contrasena }),
  });

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }
  
  return await response.json(); */
};