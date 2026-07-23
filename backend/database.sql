-- Academia Virtual Nasser Group
-- Curso: Inteligencia Artificial para Lideres de Negocio - PDVSA
-- PostgreSQL Schema v1.0

CREATE DATABASE nasser_academia;

\c nasser_academia;

-- TABLA: roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (nombre_rol) VALUES
    ('Administrador'),
    ('Instructor'),
    ('Participante');

-- TABLA: usuarios_academia
CREATE TABLE usuarios_academia (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    cargo VARCHAR(150),
    correo VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: evaluaciones_cuestionarios
CREATE TABLE evaluaciones_cuestionarios (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    descripcion TEXT,
    ponderacion DECIMAL(5,2) NOT NULL DEFAULT 0,
    fecha_limite DATE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INTEGER REFERENCES usuarios_academia(id)
);

-- TABLA: preguntas
CREATE TABLE preguntas (
    id SERIAL PRIMARY KEY,
    evaluacion_id INTEGER NOT NULL REFERENCES evaluaciones_cuestionarios(id) ON DELETE CASCADE,
    enunciado TEXT NOT NULL,
    opciones JSONB NOT NULL,
    respuesta_correcta INTEGER NOT NULL,
    orden INTEGER NOT NULL DEFAULT 1
);

-- TABLA: registros_notas
CREATE TABLE registros_notas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios_academia(id),
    evaluacion_id INTEGER NOT NULL REFERENCES evaluaciones_cuestionarios(id),
    calificacion DECIMAL(5,2) NOT NULL DEFAULT 0,
    estatus_aprobacion VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, evaluacion_id)
);

-- TABLA: certificados
CREATE TABLE certificados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios_academia(id),
    codigo_verificacion VARCHAR(100) UNIQUE NOT NULL,
    qr_data TEXT,
    emitido_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_usuarios_rol ON usuarios_academia(rol_id);
CREATE INDEX idx_notas_usuario ON registros_notas(usuario_id);
CREATE INDEX idx_notas_evaluacion ON registros_notas(evaluacion_id);
