-- ============================================
-- SCRIPT DE DATOS INICIALES (SEED)
-- ============================================
-- IMPORTANTE: Este script debe ejecutarse DESPUÉS de schema.sql
-- ============================================

-- 1. Tipos de Habitación
INSERT INTO tipos_habitacion (
    costo,
    descripcion,
    tipo_habitacion
) VALUES
    (50800.00, 'Una habitación asignada a una persona.', 'Individual Estándar'),
    (70230.00, 'Una habitación asignada a dos personas. Puede tener una o dos camas.', 'Doble Estándar'),
    (90560.00, 'Una habitación asignada a dos personas, con mayor confort que la doble estándar.', 'Doble Superior'),
    (110500.00, 'Una habitación con capacidad para cinco personas.', 'Superior Family Plan'),
    (128600.00, 'Una habitación asignada a una pareja.', 'Suite Doble');

-- 2. Habitaciones
INSERT INTO habitaciones (
    fuera_de_servicio,
    numero,
    piso,
    id_tipo_habitacion
) VALUES
    -- Piso 1
    (0, 101, 1, 1),
    (0, 102, 1, 1),
    (0, 103, 1, 1),
    (0, 104, 1, 1),
    (0, 105, 1, 1),
    (0, 106, 1, 1),
    (0, 107, 1, 1),
    (1, 108, 1, 1),
    (0, 109, 1, 1),
    (0, 110, 1, 1),
    (1, 111, 1, 2),
    (0, 112, 1, 2),
    (0, 113, 1, 2),
    (0, 114, 1, 2),
    (0, 115, 1, 2),
    (0, 116, 1, 2),
    (0, 117, 1, 2),
    (0, 118, 1, 2),
    (0, 119, 1, 2),
    (1, 120, 1, 3),
    (0, 121, 1, 3),
    (0, 122, 1, 3),
    (0, 123, 1, 3),
    (0, 124, 1, 5),
    -- Piso 2
    (0, 201, 2, 2),
    (0, 202, 2, 2),
    (0, 203, 2, 2),
    (0, 204, 2, 2),
    (0, 205, 2, 2),
    (0, 206, 2, 2),
    (0, 207, 2, 2),
    (0, 208, 2, 2),
    (0, 209, 2, 2),
    (0, 210, 2, 3),
    (0, 211, 2, 3),
    (0, 212, 2, 3),
    (0, 213, 2, 3),
    (0, 214, 2, 4),
    (0, 215, 2, 4),
    (0, 216, 2, 4),
    (0, 217, 2, 4),
    (0, 218, 2, 4),
    (0, 219, 2, 4),
    (0, 220, 2, 4),
    (1, 221, 2, 4),
    (0, 222, 2, 4),
    (0, 223, 2, 4),
    (0, 224, 2, 5);

-- 3. Personas Jurídicas
INSERT INTO personas_juridicas (
    calle,
    cuit,
    departamento,
    numero,
    piso,
    telefono,
    razon_social
) VALUES
    ('BLAS PARERA',       '20-20000007-8',  NULL, 305,  NULL, '123456789',  'EMPRESARIOS SA'),
    ('LA RIOJA',          '15-12131416-2',  '2',  87,   5,    '789456123',  'ECOS SRL'),
    ('SAN MARTIN',        '12-34567899-0',  NULL, 2598, NULL, '321654987',  'SOCIOS Y ASOCIADOS SA'),
    ('ALMIRANTE BROWN',   '98-76543210-1',  '1',  2560, 1,    '456789123',  'RACION SRL'),
    ('BUENOS AIRES',      '32-16549870-5',  NULL, 1523, NULL, '1122334455', 'HOTELEROS SA'),
    ('ROSARIO',           '66-55443322-9',  '4',  5487, 4,    '9876598765', 'DI & DA SRL');

-- 4. Servicios
INSERT INTO servicios (
    detalle,
    nombre,
    precio_unidad
) VALUES
    ('Desayuno en salón: café, jugo, tostadas, medialunas', 'Desayuno continental', 3500),
    ('Desayuno completo servido en la habitación', 'Desayuno a la habitación', 5000),
    ('Lavado y planchado de prendas por unidad', 'Lavandería', 1800),
    ('Servicio de comida y bebidas a la habitación', 'Room service 24hs', 2500),
    ('Acceso a sauna, ducha escocesa y sala de relax (1 hora)', 'Spa básico', 7000),
    ('Sesión de 45 minutos con masajista profesional', 'Masaje descontracturante', 12000),
    ('Estacionamiento por vehículo por día', 'Estacionamiento cubierto', 4000),
    ('Extensión de la salida hasta las 18:00 hs', 'Late check-out', 6000),
    ('Traslado hotel-aeropuerto en auto privado', 'Traslado aeropuerto', 15000),
    ('Cuna para bebé por día', 'Alquiler de cuna', 2500);

-- 5. Usuarios
INSERT INTO usuarios (
    contrasena,
    email,
    nombre
) VALUES
    ('tpdeso2025', 'lisandro.sandoval@hotel.com', 'Lisandro Sandoval'),
    ('tpdeso2025', 'tomas.rausch@hotel.com', 'Tomas Rausch'),
    ('tpdeso2025', 'alvaro.prono@hotel.com', 'Alvaro Prono'),
    ('tpdeso2025', 'juan.izquierdo@hotel.com', 'Juan Izquierdo'),
    ('tpdeso2025', 'conserje@hotel.com', 'Conserje');
