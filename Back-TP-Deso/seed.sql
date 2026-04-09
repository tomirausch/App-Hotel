-- ============================================
-- SCRIPT DE DATOS INICIALES (SEED)
-- ============================================
-- IMPORTANTE: Este script debe ejecutarse DESPUÉS de schema.sql
-- ============================================

-- 1. Tipos de Habitación
INSERT INTO railway.tipos_habitacion (
    id,
    costo,
    descripcion,
    tipo_habitacion
) VALUES
    (1, 50800.00, 'Una habitación asignada a una persona.', 'Individual Estándar'),
    (2, 70230.00, 'Una habitación asignada a dos personas. Puede tener una o dos camas.', 'Doble Estándar'),
    (3, 90560.00, 'Una habitación asignada a dos personas, con mayor confort que la doble estándar.', 'Doble Superior'),
    (4, 110500.00, 'Una habitación con capacidad para cinco personas.', 'Superior Family Plan'),
    (5, 128600.00, 'Una habitación asignada a una pareja.', 'Suite Doble');

-- 2. Habitaciones
INSERT INTO railway.habitaciones (
    id_habitacion,
    fuera_de_servicio,
    numero,
    piso,
    id_tipo_habitacion
) VALUES
    -- Piso 1
    (1, 0, 101, 1, 1),
    (2, 0, 102, 1, 1),
    (3, 0, 103, 1, 1),
    (4, 0, 104, 1, 1),
    (5, 0, 105, 1, 1),
    (6, 0, 106, 1, 1),
    (7, 0, 107, 1, 1),
    (8, 1, 108, 1, 1),
    (9, 0, 109, 1, 1),
    (10, 0, 110, 1, 1),
    (11, 1, 111, 1, 2),
    (12, 0, 112, 1, 2),
    (13, 0, 113, 1, 2),
    (14, 0, 114, 1, 2),
    (15, 0, 115, 1, 2),
    (16, 0, 116, 1, 2),
    (17, 0, 117, 1, 2),
    (18, 0, 118, 1, 2),
    (19, 0, 119, 1, 2),
    (20, 1, 120, 1, 3),
    (21, 0, 121, 1, 3),
    (22, 0, 122, 1, 3),
    (23, 0, 123, 1, 3),
    (24, 0, 124, 1, 5),

    -- Piso 2
    (25, 0, 201, 2, 2),
    (26, 0, 202, 2, 2),
    (27, 0, 203, 2, 2),
    (28, 0, 204, 2, 2),
    (29, 0, 205, 2, 2),
    (30, 0, 206, 2, 2),
    (31, 0, 207, 2, 2),
    (32, 0, 208, 2, 2),
    (33, 0, 209, 2, 2),
    (34, 0, 210, 2, 3),
    (35, 0, 211, 2, 3),
    (36, 0, 212, 2, 3),
    (37, 0, 213, 2, 3),
    (38, 0, 214, 2, 4),
    (39, 0, 215, 2, 4),
    (40, 0, 216, 2, 4),
    (41, 0, 217, 2, 4),
    (42, 0, 218, 2, 4),
    (43, 0, 219, 2, 4),
    (44, 0, 220, 2, 4),
    (45, 1, 221, 2, 4),
    (46, 0, 222, 2, 4),
    (47, 0, 223, 2, 4),
    (48, 0, 224, 2, 5);


-- 3. Personas Jurídicas
INSERT INTO railway.personas_juridicas (
    id_persona_juridica,
    calle,
    cuit,
    departamento,
    numero,
    piso,
    telefono,
    razon_social
) VALUES
    (1, 'BLAS PARERA',     '20-20000007-8', NULL, 305,  NULL, '123456789',  'EMPRESARIOS SA'),
    (2, 'LA RIOJA',        '15-12131416-2', '2',  87,   5,    '789456123',  'ECOS SRL'),
    (3, 'SAN MARTIN',      '12-34567899-0', NULL, 2598, NULL, '321654987',  'SOCIOS Y ASOCIADOS SA'),
    (4, 'ALMIRANTE BROWN', '98-76543210-1', '1',  2560, 1,    '456789123',  'RACION SRL'),
    (5, 'BUENOS AIRES',    '32-16549870-5', NULL, 1523, NULL, '1122334455', 'HOTELEROS SA'),
    (6, 'ROSARIO',         '66-55443322-9', '4',  5487, 4,    '9876598765', 'DI & DA SRL');


-- 4. Servicios
INSERT INTO railway.servicios (
    id_servicio,
    detalle,
    nombre,
    precio_unidad
) VALUES
    (1, 'Desayuno en salón: café, jugo, tostadas, medialunas', 'Desayuno continental', 3500),
    (2, 'Desayuno completo servido en la habitación', 'Desayuno a la habitación', 5000),
    (3, 'Lavado y planchado de prendas por unidad', 'Lavandería', 1800),
    (4, 'Servicio de comida y bebidas a la habitación', 'Room service 24hs', 2500),
    (5, 'Acceso a sauna, ducha escocesa y sala de relax (1 hora)', 'Spa básico', 7000),
    (6, 'Sesión de 45 minutos con masajista profesional', 'Masaje descontracturante', 12000),
    (7, 'Estacionamiento por vehículo por día', 'Estacionamiento cubierto', 4000),
    (8, 'Extensión de la salida hasta las 18:00 hs', 'Late check-out', 6000),
    (9, 'Traslado hotel-aeropuerto en auto privado', 'Traslado aeropuerto', 15000),
    (10, 'Cuna para bebé por día', 'Alquiler de cuna', 2500);


-- 5. Usuarios
INSERT INTO railway.usuarios (
    id_usuario,
    contrasena,
    email,
    nombre
) VALUES
    (1, 'tpdeso2025', 'lisandro.sandoval@hotel.com', 'Lisandro Sandoval'),
    (2, 'tpdeso2025', 'tomas.rausch@hotel.com', 'Tomas Rausch'),
    (3, 'tpdeso2025', 'alvaro.prono@hotel.com', 'Alvaro Prono'),
    (4, 'tpdeso2025', 'juan.izquierdo@hotel.com', 'Juan Izquierdo'),
    (5, 'tpdeso2025', 'conserje@hotel.com', 'Conserje'),
    (6, 'TPDESO2025', 'admin@hotel.com', 'ADMIN');


-- 6. Huespedes
INSERT INTO railway.huespedes (
    id,
    calle,
    cuit,
    departamento,
    numero,
    piso,
    telefono,
    apellido,
    codigo_postal,
    email,
    fecha_nacimiento,
    localidad,
    nacionalidad,
    nombre,
    numero_documento,
    ocupacion,
    pais,
    posicion_iva,
    provincia,
    tipo_documento
) VALUES
    (10, 'SAN LUIS', 11111111, 'B2', 2341, 2, '12345678', 'IZQUIERDO', 3000, 'JUAN.IZQ@GMAIL.COM', '2005-05-15', 'SANTA FE', 'ARGENTINO', 'JUAN IGNACIO', 11111111, 'ESTUDIANTE', 'Argentina', 'RESPONSABLE_INSCRIPTO', 'SANTA FE', 'DNI'),
    (11, 'MITRE', 22222222, 'A1', 5634, 1, '3425157890', 'PRONO', 3000, 'ALVA@GMAIL.COM', '2004-11-09', 'SANTA FE', 'ARGENTINA', 'ALVARO', 22222222, 'PROFESOR', 'Argentina', 'MONOTRIBUTISTA', 'SANTA FE', 'PASAPORTE'),
    (12, 'LAS ROSAS', 33333333, NULL, 790, NULL, '342678943', 'SANDOVAL', 3000, 'LICHA123@GMAIL.COM', '2004-12-13', 'MONTEVIDEO', 'ARGENTINA', 'LISANDRO', 33333333, 'CONSERJE', 'Argentina', 'EXENTO', 'MONTEVIDEO', 'LE'),
    (13, 'LAVAISSE', 44444444, NULL, 334, NULL, '342674906', 'RAUSCH', 3000, 'TOMI@GMAIL.COM', '2004-07-06', 'MONTEVIDEO', 'URUGUAY', 'TOMAS', 44444444, 'ESTUDIANTE', 'Uruguay', 'EXENTO', 'MONTEVIDEO', 'LC'),
    (14, 'SAN JERONIMO', 55555555, NULL, 4536, NULL, '12345678', 'MESSI', 2800, 'MESSI10@GMAIL.COM', '1997-06-18', 'ROSARIO', 'ARGENTINA', 'LIONEL', 55555555, 'FUTBOLISTA', 'Argentina', 'RESPONSABLE_INSCRIPTO', 'SANTA FE', 'DNI'),
    (15, 'SAN MARTIN', NULL, NULL, 2233, NULL, '3425740123', 'SANCHEZ', 3000, NULL, '2015-09-19', 'SANTO TOME', 'ARGENTINA', 'AGUSTIN', 66666666, 'ESTUDIANTE', 'Argentina', 'CONSUMIDOR_FINAL', 'SANTA FE', 'DNI'),
    (16, 'PIEDRAS', 77777777, NULL, 675, NULL, '345505578', 'AIMO', 3000, 'ANDREA@GMAIL.COM', '1975-12-03', 'SANTA FE', 'ARGENTINA', 'ANDREA', 77777777, 'CONTADOR', 'Argentina', 'RESPONSABLE_INSCRIPTO', 'SANTA FE', 'DNI'),
    (17, 'LAVAISSE', NULL, NULL, 342, NULL, '342567575', 'GARCIA', 3000, NULL, '2019-03-11', 'SANTO TOME', 'ARGENTINA', 'CATALINA', 88888888, 'ESTUDIANTE', 'Argentina', 'CONSUMIDOR_FINAL', 'SANTA FE', 'DNI'),
    (18, 'SAN MARTIN', NULL, NULL, 564, NULL, '342567823', 'FERRARI', 3000, 'MABEL@GMAIL.COM', '1965-09-19', 'SANTA FE', 'ARGENTINA', 'MABEL', 99999999, 'PROFESOR', 'Argentina', 'MONOTRIBUTISTA', 'SANTA FE', 'PASAPORTE'),
    (19, 'LAS ROSAS', NULL, NULL, 5432, NULL, '345678901', 'DALLO', 3000, 'FELIPE@GMAIL.COM', '2020-11-16', 'SANTO TOME', 'ARGENTINA', 'FELIPE', 1010101010, 'ESTUDIANTE', 'Argentina', 'CONSUMIDOR_FINAL', 'SANTA FE', 'OTRO'),
    (20, NULL, NULL, NULL, NULL, NULL, '342784672', 'ROMERO', NULL, NULL, NULL, NULL, NULL, 'LUCAS', 1212121212, NULL, NULL, NULL, NULL, 'DNI');


-- 7. Reservas
INSERT INTO railway.reservas (
    id_reserva,
    estado,
    fecha_desde,
    fecha_hasta,
    monto,
    id_habitacion,
    id_huesped
) VALUES
    (13, 'CANCELADA',  '2025-12-19', '2025-12-25', 355600.00, 1, 10),
    (14, 'CONFIRMADA', '2025-12-19', '2025-12-25', 355600.00, 1, 11),
    (15, 'PENDIENTE',  '2025-12-19', '2025-12-24', 304800.00, 2, 10),
    (16, 'PENDIENTE',  '2025-12-19', '2025-12-22', 203200.00, 3, 12),
    (17, 'CANCELADA',  '2025-12-23', '2025-12-25', 152400.00, 4, 12);


-- 8. Estadias
INSERT INTO railway.estadias (
    id,
    cant_personas,
    costo_estadia,
    descuento,
    estado,
    fecha_desde,
    fecha_hasta,
    id_habitacion,
    id_reserva_origen,
    id_huesped_responsable
) VALUES
    (4, 1, 355600.00, 0, 'ACTIVA', '2025-12-18', '2025-12-25', 1, 14, 11),
    (5, 1, 304800.00, 0, 'ACTIVA', '2025-12-19', '2025-12-25', 4, NULL, 13),
    (6, 4, 304800.00, 0, 'ACTIVA', '2025-12-19', '2025-12-25', 6, NULL, 16);


-- 9. Estadia Huespedes
INSERT INTO railway.estadia_huespedes (
    id_estadia,
    id_huesped
) VALUES
    (6, 14),
    (6, 17),
    (6, 19);


-- 10. Estadia Servicios
INSERT INTO railway.estadia_servicio (
    fecha,
    id_estadia,
    id_servicio
) VALUES
    ('2025-12-20', 4, 1),
    ('2025-12-22', 4, 7),
    ('2025-12-21', 5, 2),
    ('2025-12-25', 5, 8),
    ('2025-12-21', 6, 4),
    ('2025-12-21', 6, 5),
    ('2025-12-21', 6, 6);
