Instrucciones de Ejecución (Manual)

Requisitos Previos

- Java JDK 17+
- Node.js 18+
- Maven (Opcional, el proyecto incluye el wrapper `mvnw`)

1. Base de Datos

La aplicación está configurada para conectarse a una base de datos MySQL remota (hosteada en Railway).

- No es necesario instalar ni ejecutar una base de datos localmente.
- Asegúrate de tener conexión a internet estable.
- La configuración de conexión se encuentra en: `Back-TP-Deso/src/main/resources/application.properties`.

2. Ejecutar Backend (Spring Boot)

1. Abrir una terminal en la carpeta raíz del proyecto.
2. Navegar a la carpeta del backend:

   cd Back-TP-Deso

3. Ejecutar el servidor usando Maven Wrapper:
   - En Windows:
     .\mvnw spring-boot:run

   - En Linux/Mac:
     ./mvnw spring-boot:run

4. Esperar a que inicie. El servidor estará disponible en: `http://localhost:8080`

3. Ejecutar Frontend (Next.js)

1. Abrir una nueva terminal en la carpeta raíz del proyecto.
2. Navegar a la carpeta del frontend:

   cd Front-TP-Deso

3. Instalar las dependencias (solo la primera vez):

   npm install

4. Ejecutar el servidor de desarrollo:

   npm run dev

5. Abrir el navegador en: `http://localhost:3000`


Endpoints de Ejemplo (API)
Puedes probar los Casos de Uso (CUs) principales utilizando Postman, Insomnia o cURL contra `http://localhost:8080`.


CU01: Autenticar Usuario.
Endpoint: `POST /api/usuario/login`
Body: json
    {
      "nombre": "ADMIN",
      "contrasena": "TPDESO2025"
    }


CU02: Buscar Huésped.
Endpoint: `GET /api/huespedes/buscar?apellido=Messi`


CU04: Reservar Habitación.
Endpoint: `POST /api/reservas`
Descripción: Crea una reserva. Si el huésped no existe, lo crea con los datos proporcionados (`HotelFacade` gestiona esto).
Body: json
    {
      "detalles": [
        {
          "idHabitacion": 1,
          "fechaDesde": "2024-12-20",
          "fechaHasta": "2024-12-25"
        }
      ],
      "datosHuesped": {
        "nombre": "Lionel",
        "apellido": "Messi",
        "tipoDocumento": "DNI",
        "numeroDocumento": "30111222",
        "telefono": "123456"
      }
    }


CU05: Mostrar Estado de Habitaciones.
Endpoint: `GET /api/habitaciones/estado`
Query Params: `desde` y `hasta` (Formato YYYY-MM-DD).
Ejemplo:
    `http://localhost:8080/api/habitaciones/estado?desde=2024-12-20&hasta=2024-12-25`


CU06: Cancelar Reserva.
Endpoint: `POST /api/reservas/cancelar`
Descripción: Cancela una o varias reservas pasando sus IDs en una lista.
Body: json
    [1, 2]


CU07: Facturar.
Endpoint: `POST /api/facturacion`
Body: json
    {
      "fechaEmision": "2024-12-25",
      "horaEmision": "10:00:00",
      "iva": "21%",
      "montoTotal": 50000.00,
      "tipoMoneda": "PESOS_ARGENTINOS",
      "tipo": "B",
      "idEstadia": 1,
      "idHuesped": 1, 
      "lineas": [
        {
          "descripcion": "Alojamiento 5 noches",
          "precioUnitario": 10000.00,
          "cantidad": 5
        }
      ]
    }

    (Nota: Usar `idPersonaJuridica` en lugar de `idHuesped` si se factura a una empresa).
    

CU09: Dar de Alta Huésped.
Endpoint: `POST /api/huespedes`
Body: json
    {
      "nombre": "Lionel",
      "apellido": "Messi",
      "tipoDocumento": "DNI",
      "numeroDocumento": "30111222",
      "fechaNacimiento": "1987-06-24",
      "telefono": "5491122334455",
      "email": "lio@mail.com",
      "nacionalidad": "Argentina",
      "calle": "Av. Libertador",
      "numero": 1000,
      "codigoPostal": "2000",
      "localidad": "Rosario",
      "provincia": "Santa Fe",
      "pais": "Argentina",
      "ocupacion": "Futbolista",
      "posicionIVA": "CONSUMIDOR_FINAL"
    }


CU10: Modificar Huésped.
Endpoint: `PUT /api/huespedes/{id}`
Ejemplo: `PUT http://localhost:8080/api/huespedes/1`
Body: json
    {
      "nombre": "Lionel Andrés",
      "apellido": "Messi",
      "tipoDocumento": "DNI",
      "numeroDocumento": "30111222",
      "fechaNacimiento": "1987-06-24",
      "telefono": "54911000000",
      "email": "nuevo_email@mail.com",
      "nacionalidad": "Argentina",
      "calle": "Calle Falsa",
      "numero": 123,
      "codigoPostal": "2000",
      "localidad": "Rosario",
      "provincia": "Santa Fe",
      "pais": "Argentina",
      "ocupacion": "Campeón del Mundo",
      "posicionIVA": "CONSUMIDOR_FINAL"
    }


CU11: Dar de Baja Huésped.
Endpoint: `DELETE /api/huespedes/{id}`
Descripción: Elimina un huésped por su ID.
Ejemplo: `DELETE http://localhost:8080/api/huespedes/1`


CU15: Ocupar Habitación.
Endpoint: `POST /api/estadias/ocupar`
Descripción: Registra el ingreso efectivo del huésped (transforma reserva o crea estadía directa).
Body: json
    {
      "idHuespedResponsable": 1,
      "idHabitacion": 1,
      "fechaDesde": "2024-12-20",
      "fechaHasta": "2024-12-25",
      "listaAcompanantes": []
    }
