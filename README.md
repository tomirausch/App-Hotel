# Sistema de Gestión Hotelera - TP Desarrollo de Software 2025

Sistema integral de gestión hotelera desarrollado con **Spring Boot** (backend) y **Next.js** (frontend) para el curso de Desarrollo de Software de la UTN.

## Tabla de Contenidos

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura y Patrones de Diseño](#-arquitectura-y-patrones-de-diseño)
- [Requisitos Previos](#-requisitos-previos)
- [Base de Datos](#-base-de-datos)
- [Ejecutar Backend (Spring Boot)](#-ejecutar-backend-spring-boot)
- [Ejecutar Frontend (Next.js)](#-ejecutar-frontend-nextjs)
- [Endpoints de Ejemplo (API)](#-endpoints-de-ejemplo-api)
- [Testing](#-testing)
- [Diagramas](#-diagramas)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## Tecnologías Utilizadas

### Backend
- **Java JDK 21**
- **Spring Boot 3.5.7**
- **Spring Data JPA / Hibernate**
- **MySQL 8.0** (Railway)
- **Maven**
- **JaCoCo** (cobertura de tests >80%)
- **Swagger/OpenAPI 2.7.0**
- **Lombok**

### Frontend
- **Next.js 15**
- **React 19**
- **Node.js 18+**

---

##  Arquitectura y Patrones de Diseño

El sistema implementa una **arquitectura en capas** con separación clara de responsabilidades:

- **Capa de Presentación**: Controllers REST (`@RestController`)
- **Capa de Lógica de Negocio**: Services (Gestores)
- **Capa de Acceso a Datos**: DAOs + JPA Repositories

### Patrones de Diseño Implementados

1. **DAO (Data Access Object)** - Patrón estructural para abstracción de acceso a datos
2. **Strategy** - Estrategias de precio (Regular, Corporativo) en `/strategy`
3. **Facade** - `HotelFacade` coordina operaciones entre `GestorHabitaciones` y `GestorHuespedes`
4. **Singleton** - Patron creacional que asegura la existencia unica de una instancia de una clase. Implementado automaticamente en gestores y controladores via anotaciones de Spring Boot

Ver más detalles en los [diagramas](#-diagramas) del proyecto.

---

## Requisitos Previos

- Java JDK 17+
- Node.js 18+
- Maven
- Tener instalado MySQL Workbench 8.0
- Clonar el siguiente repositorio de GitHub: https://github.com/tomirausch/App-Hotel.git

---

## Base de Datos

La aplicación está configurada para conectarse a una base de datos MySQL remota (hosteada en Railway).

**Configuración de conexión:**
```
Host: shortline.proxy.rlwy.net
Port: 57701
```

**Usuario para acceder a la base de datos:**
```
nombre: "profesores_deso"
contraseña: "tpdeso2025"
```

### Scripts SQL

El proyecto incluye los siguientes scripts en la carpeta `Back-TP-Deso/`:

- **`schema.sql`**: Script con todas las sentencias CREATE TABLE y ALTER TABLE (211 líneas)
- **`seed.sql`**: Script con datos de ejemplo (INSERT statements)

> **Nota**: La base de datos en Railway ya está configurada. No es necesario ejecutar estos scripts manualmente, pero están disponibles para referencia o para configurar una instancia local.

---

##  Ejecutar Backend (Spring Boot)

1. Una vez clonado el repositorio en una carpeta abrir una terminal (CMD) en la carpeta raíz del proyecto (`...\App-Hotel`).

2. Navegar a la carpeta del backend:
   ```bash
   cd Back-TP-Deso
   ```

3. Ejecutar el servidor usando Maven:
   
   **En Windows:**
   ```bash
   .\mvnw spring-boot:run
   ```
   
   **En Linux/Mac:**
   ```bash
   ./mvnw spring-boot:run
   ```

4. Esperar a que inicie. El servidor estará disponible en: `http://localhost:8080`

---

##  Ejecutar Frontend (Next.js)

1. Abrir una nueva terminal en la carpeta raíz del proyecto.

2. Navegar a la carpeta del frontend:
   ```bash
   cd Front-TP-Deso
   ```

3. Instalar las dependencias (solo la primera vez):
   ```bash
   npm install
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir el navegador en: `http://localhost:3000`

---

## Endpoints de Ejemplo (API)

Podes probar los Casos de Uso (CUs) principales utilizando Postman, Insomnia o cURL contra `http://localhost:8080`.

También con el backend activo podes acceder a la documentación de endpoints en Swagger via el siguiente link: http://localhost:8080/swagger-ui/index.html#/

### CU01: Autenticar Usuario

**Endpoint:** `POST /api/usuario/login`

**Body:**
```json
{
  "nombre": "ADMIN",
  "contrasena": "TPDESO2025"
}
```

---

### CU02: Buscar Huésped

**Endpoint:** `GET /api/huespedes/buscar?apellido=Messi`

---

### CU04: Reservar Habitación

**Endpoint:** `POST /api/reservas`

**Descripción:** Crea una reserva. Si el huésped no existe, lo crea con los datos proporcionados (`HotelFacade` gestiona esto).

**Body:**
```json
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
```

---

### CU05: Mostrar Estado de Habitaciones

**Endpoint:** `GET /api/habitaciones/estado`

**Query Params:** `desde` y `hasta` (Formato YYYY-MM-DD).

**Ejemplo:**
```
http://localhost:8080/api/habitaciones/estado?desde=2024-12-20&hasta=2024-12-25
```

---

### CU06: Cancelar Reserva

**Endpoint:** `POST /api/reservas/cancelar`

**Descripción:** Cancela una o varias reservas pasando sus IDs en una lista.

**Body:**
```json
[1, 2]
```

---

### CU07: Facturar

**Endpoint:** `POST /api/facturacion`

**Body:**
```json
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
```

> **Nota:** Usar `idPersonaJuridica` en lugar de `idHuesped` si se factura a una empresa.

---

### CU09: Dar de Alta Huésped

**Endpoint:** `POST /api/huespedes`

**Body:**
```json
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
```

---

### CU10: Modificar Huésped

**Endpoint:** `PUT /api/huespedes/{id}`

**Ejemplo:** `PUT http://localhost:8080/api/huespedes/1`

**Body:**
```json
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
```

---

### CU11: Dar de Baja Huésped

**Endpoint:** `DELETE /api/huespedes/{id}`

**Descripción:** Elimina un huésped por su ID.

**Ejemplo:** `DELETE http://localhost:8080/api/huespedes/1`

---

### CU15: Ocupar Habitación

**Endpoint:** `POST /api/estadias/ocupar`

**Descripción:** Registra el ingreso efectivo del huésped (transforma reserva o crea estadía directa).

**Body:**
```json
{
  "idHuespedResponsable": 1,
  "idHabitacion": 1,
  "fechaDesde": "2024-12-20",
  "fechaHasta": "2024-12-25",
  "listaAcompanantes": []
}
```

---

## Testing

### Cómo realizar los test unitarios

1. Una vez clonado el repositorio en una carpeta abrir una terminal (CMD) en la carpeta raíz del proyecto (`...\App-Hotel`).

2. Navegar a la carpeta del backend:
   ```bash
   cd Back-TP-Deso
   ```

3. Ejecutar los tests usando Maven:
   
   **En Windows:**
   ```bash
   .\mvnw.cmd test
   ```
   
   **En Linux/Mac:**
   ```bash
   ./mvnw test
   ```

4. Esperar a que finalice el proceso de pruebas (BUILD SUCCESS)

5. Se puede acceder a una interfaz que permite visualizar la cobertura de los test unitarios mediante el archivo ubicado en:
   ```
   ...\App-Hotel\Back-TP-Deso\target\site\jacoco\index.html
   ```

6. Una vez abierta la interfaz realizar clic en: `com.example.crud.service`

### Cobertura de Tests

- **Total de tests**: 39 tests unitarios
- **Cobertura**: >80% en el paquete `com.example.crud.service`
- **Framework**: JUnit 5 + Mockito
- **Archivos de test**:
  - `GestorFacturacionTest.java` (6 tests)
  - `GestorHuespedesTest.java` (15 tests)
  - `GestorHabitacionesTest.java` (13 tests)
  - `GestorUsuariosTest.java` (4 tests)

---

## Diagramas

Los diagramas de diseño del sistema (Diagrama de Clases, Diagramas de Secuencia) fueron desarrollados durante la etapa de Diseño de Sistemas y están disponibles en el repositorio o pueden ser consultados con los docentes.

---

## Estructura del Proyecto

```
App-Hotel/
├── Back-TP-Deso/                    # API REST (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/crud/
│   │   │   │   ├── api/             # Controllers REST
│   │   │   │   ├── service/         # Gestores (lógica de negocio)
│   │   │   │   ├── dao/             # Data Access Objects
│   │   │   │   ├── repository/      # JPA Repositories
│   │   │   │   ├── model/           # Entidades JPA
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── auxiliares/      # Mappers
│   │   │   │   ├── strategy/        # Patrón Strategy (precios)
│   │   │   │   ├── enums/           # Enumeraciones
│   │   │   │   └── exception/       # Excepciones personalizadas
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Tests unitarios (JUnit + Mockito)
│   ├── schema.sql                   # Script CREATE TABLE
│   ├── seed.sql                     # Script INSERT con datos
│   └── pom.xml                      # Dependencias Maven
│
├── Front-TP-Deso/                   # Frontend (Next.js)
│   ├── pages/                       # Páginas de Next.js
│   │   ├── reservar-habitacion/
│   │   ├── cancelar-reserva/
│   │   ├── facturar/
│   │   ├── dar-alta-huesped/
│   │   ├── modificar-huesped/
│   │   ├── ocupar-habitacion/
│   │   └── ...
│   ├── components/                  # Componentes React reutilizables
│   ├── public/                      # Archivos estáticos
│   ├── package.json
│   └── next.config.js
│
└── README.md                        # Este archivo
```

---
