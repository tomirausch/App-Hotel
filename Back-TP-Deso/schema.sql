-- ============================================
-- SCRIPT DE CREACIÓN DE TABLAS
-- Sistema de Gestión Hotelera
-- ============================================

-- Tabla: estadia_huespedes
CREATE TABLE estadia_huespedes (
    id_estadia BIGINT NOT NULL,
    id_huesped BIGINT NOT NULL
) ENGINE=InnoDB;

-- Tabla: estadia_servicio
CREATE TABLE estadia_servicio (
    fecha DATE,
    id_estadia BIGINT NOT NULL,
    id_estadia_servicio BIGINT NOT NULL AUTO_INCREMENT,
    id_servicio BIGINT NOT NULL,
    PRIMARY KEY (id_estadia_servicio)
) ENGINE=InnoDB;

-- Tabla: estadias
CREATE TABLE estadias (
    cant_personas INTEGER,
    costo_estadia DECIMAL(10,2),
    descuento FLOAT(53),
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    id_habitacion BIGINT NOT NULL,
    id_huesped_responsable BIGINT NOT NULL,
    id_reserva_origen BIGINT,
    estado ENUM ('ACTIVA','FINALIZADA'),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Tabla: facturas
CREATE TABLE facturas (
    fecha_emision DATE,
    hora_emision TIME(6),
    monto_total FLOAT(53),
    id_estadia BIGINT,
    id_factura BIGINT NOT NULL AUTO_INCREMENT,
    id_huesped BIGINT,
    id_persona_juridica BIGINT,
    iva VARCHAR(10),
    estado ENUM ('PAGA','PENDIENTE'),
    tipo ENUM ('A','B'),
    tipo_moneda ENUM ('DOLARES','EUROS','PESOS_ARGENTINOS','PESOS_URUGUAYOS','REALES'),
    PRIMARY KEY (id_factura)
) ENGINE=InnoDB;

-- Tabla: habitaciones
CREATE TABLE habitaciones (
    fuera_de_servicio BIT,
    numero INTEGER NOT NULL,
    piso INTEGER,
    id_habitacion BIGINT NOT NULL AUTO_INCREMENT,
    id_tipo_habitacion BIGINT NOT NULL,
    PRIMARY KEY (id_habitacion)
) ENGINE=InnoDB;

-- Tabla: huespedes
CREATE TABLE huespedes (
    fecha_nacimiento DATE,
    numero INTEGER,
    piso INTEGER,
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo_postal VARCHAR(10),
    departamento VARCHAR(10),
    cuit VARCHAR(20),
    numero_documento VARCHAR(20) NOT NULL,
    telefono VARCHAR(30),
    apellido VARCHAR(60) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    localidad VARCHAR(80),
    nacionalidad VARCHAR(80),
    pais VARCHAR(80),
    provincia VARCHAR(80),
    calle VARCHAR(100),
    ocupacion VARCHAR(100),
    email VARCHAR(120),
    posicion_iva ENUM ('CONSUMIDOR_FINAL','EXENTO','MONOTRIBUTISTA','NO_RESPONSABLE','RESPONSABLE_INSCRIPTO'),
    tipo_documento ENUM ('DNI','LC','LE','OTRO','PASAPORTE') NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Tabla: lineas_factura
CREATE TABLE lineas_factura (
    cantidad INTEGER,
    precio_unitario DECIMAL(10,2),
    id_factura BIGINT NOT NULL,
    id_linea_factura BIGINT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(255),
    PRIMARY KEY (id_linea_factura)
) ENGINE=InnoDB;

-- Tabla: personas_juridicas
CREATE TABLE personas_juridicas (
    numero INTEGER,
    piso INTEGER,
    id_persona_juridica BIGINT NOT NULL AUTO_INCREMENT,
    departamento VARCHAR(10),
    cuit VARCHAR(20),
    telefono VARCHAR(30),
    calle VARCHAR(100),
    razon_social VARCHAR(200),
    PRIMARY KEY (id_persona_juridica)
) ENGINE=InnoDB;

-- Tabla: reservas
CREATE TABLE reservas (
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE NOT NULL,
    monto DECIMAL(10,2),
    id_habitacion BIGINT NOT NULL,
    id_huesped BIGINT NOT NULL,
    id_reserva BIGINT NOT NULL AUTO_INCREMENT,
    estado ENUM ('CANCELADA','CONFIRMADA','PENDIENTE') NOT NULL,
    PRIMARY KEY (id_reserva)
) ENGINE=InnoDB;

-- Tabla: servicios
CREATE TABLE servicios (
    precio_unidad FLOAT(23),
    id_servicio BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100),
    detalle VARCHAR(255),
    PRIMARY KEY (id_servicio)
) ENGINE=InnoDB;

-- Tabla: tipos_habitacion
CREATE TABLE tipos_habitacion (
    costo DECIMAL(10,2) NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    tipo_habitacion VARCHAR(40) NOT NULL,
    descripcion VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Tabla: usuarios
CREATE TABLE usuarios (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    contrasena VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_usuario)
) ENGINE=InnoDB;

-- ============================================
-- CONSTRAINTS UNIQUE
-- ============================================

ALTER TABLE habitaciones 
   ADD CONSTRAINT UK17jgtlfmwr92ca32wlsgyrh7h UNIQUE (numero);

ALTER TABLE tipos_habitacion 
   ADD CONSTRAINT UK5icyw3u38pn0r331w7asksofr UNIQUE (tipo_habitacion);

ALTER TABLE usuarios 
   ADD CONSTRAINT UKio49vjba68pmbgpy9vtw8vm81 UNIQUE (nombre);

-- ============================================
-- FOREIGN KEYS
-- ============================================

ALTER TABLE estadia_huespedes 
   ADD CONSTRAINT FKdoa64h3e4afjsdpx8oc2kqs7b 
   FOREIGN KEY (id_huesped) 
   REFERENCES huespedes (id);

ALTER TABLE estadia_huespedes 
   ADD CONSTRAINT FKgsh8o3t50nvip40bl84es46m5 
   FOREIGN KEY (id_estadia) 
   REFERENCES estadias (id);

ALTER TABLE estadia_servicio 
   ADD CONSTRAINT FK463g5bu5lh8eoy09scvu6g77j 
   FOREIGN KEY (id_estadia) 
   REFERENCES estadias (id);

ALTER TABLE estadia_servicio 
   ADD CONSTRAINT FKtkb3c161nrggx15t2xljbo6xv 
   FOREIGN KEY (id_servicio) 
   REFERENCES servicios (id_servicio);

ALTER TABLE estadias 
   ADD CONSTRAINT FKobpim6rggxs9teoovq8u2065e 
   FOREIGN KEY (id_habitacion) 
   REFERENCES habitaciones (id_habitacion);

ALTER TABLE estadias 
   ADD CONSTRAINT FKqfoohf0gh5b73mxg4ri9gn6d 
   FOREIGN KEY (id_reserva_origen) 
   REFERENCES reservas (id_reserva);

ALTER TABLE estadias 
   ADD CONSTRAINT FKt1tk0at6vqb9fbv6h6q33ib0h 
   FOREIGN KEY (id_huesped_responsable) 
   REFERENCES huespedes (id);

ALTER TABLE facturas 
   ADD CONSTRAINT FKmdg2hhep5idfujso2o79cc3yg 
   FOREIGN KEY (id_estadia) 
   REFERENCES estadias (id);

ALTER TABLE facturas 
   ADD CONSTRAINT FKfhghgfd31c4tishgasow20ylx 
   FOREIGN KEY (id_huesped) 
   REFERENCES huespedes (id);

ALTER TABLE facturas 
   ADD CONSTRAINT FKqtiopas5xlhq66wl3ihk7sqky 
   FOREIGN KEY (id_persona_juridica) 
   REFERENCES personas_juridicas (id_persona_juridica);

ALTER TABLE habitaciones 
   ADD CONSTRAINT FK3rb3vpdoergrdmo5u1minh58q 
   FOREIGN KEY (id_tipo_habitacion) 
   REFERENCES tipos_habitacion (id);

ALTER TABLE lineas_factura 
   ADD CONSTRAINT FK5cx0ydc3q1gkx9qo9m0xg1osr 
   FOREIGN KEY (id_factura) 
   REFERENCES facturas (id_factura);

ALTER TABLE reservas 
   ADD CONSTRAINT FK82xsvc8wvp8d5sf73ocjoeqab 
   FOREIGN KEY (id_habitacion) 
   REFERENCES habitaciones (id_habitacion);

ALTER TABLE reservas 
   ADD CONSTRAINT FKo6leckxu5cqgw8siqk1k3rydg 
   FOREIGN KEY (id_huesped) 
   REFERENCES huespedes (id);
