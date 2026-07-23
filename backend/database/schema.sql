-- Academia Virtual Nasser Group - PDVSA
-- Script de Base de Datos PostgreSQL (Actualizado)

DROP DATABASE IF EXISTS academia_nasser;
CREATE DATABASE academia_nasser;

\c academia_nasser;

-- =============================================
-- TABLAS ORIGINALES
-- =============================================

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios_academia (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(200) NOT NULL,
    cargo VARCHAR(150),
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    telefono VARCHAR(30),
    empresa_filial VARCHAR(150),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS evaluaciones_cuestionarios (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    modulo VARCHAR(100),
    ponderacion DECIMAL(5,2) DEFAULT 100.00,
    preguntas JSONB DEFAULT '[]',
    tiempo_limite_minutos INTEGER DEFAULT 60,
    fecha_limite TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registros_notas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    evaluacion_id INTEGER NOT NULL,
    calificacion DECIMAL(5,2) NOT NULL,
    estatus_aprobacion BOOLEAN DEFAULT FALSE,
    respuestas JSONB DEFAULT '{}',
    tiempo_empleado_minutos INTEGER,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones_cuestionarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS certificados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    codigo_verificacion VARCHAR(50) NOT NULL UNIQUE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calificacion_final DECIMAL(5,2),
    estatus VARCHAR(20) DEFAULT 'emitido',
    qr_code TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS simulaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOSQL NOT NULL,
    tipo_simulador VARCHAR(50) NOT NULL,
    parametros JSONB DEFAULT '{}',
    resultado JSONB DEFAULT '{}',
    fecha_ejecucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE
);

-- =============================================
-- NUEVAS TABLAS
-- =============================================

-- Tabla de Leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(30),
    empresa_filial VARCHAR(150),
    cargo VARCHAR(150),
    estado VARCHAR(30) DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'inscrito', 'rechazado')),
    origen_registro VARCHAR(100) DEFAULT 'sitio_web',
    notas_admin TEXT,
    usuario_creado_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_estado ON leads(estado);
CREATE INDEX idx_leads_email ON leads(email);

-- Tabla de Módulos del Curso
CREATE TABLE IF NOT EXISTS modulos (
    id SERIAL PRIMARY KEY,
    numero_modulo INTEGER NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    duracion_horas INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Lecciones
CREATE TABLE IF NOT EXISTS lecciones (
    id SERIAL PRIMARY KEY,
    modulo_id INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    contenido_markdown TEXT,
    video_url VARCHAR(500),
    orden INTEGER DEFAULT 0,
    recursos_descargables JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE
);

CREATE INDEX idx_lecciones_modulo ON lecciones(modulo_id);

-- Tabla de Progreso de Estudiantes
CREATE TABLE IF NOT EXISTS progresos_estudiantes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    leccion_id INTEGER NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    fecha_completado TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE,
    FOREIGN KEY (leccion_id) REFERENCES lecciones(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, leccion_id)
);

CREATE INDEX idx_progreso_usuario ON progresos_estudiantes(usuario_id);

-- Tabla de Asignaciones de Tutores
CREATE TABLE IF NOT EXISTS asignaciones_tutores (
    id SERIAL PRIMARY KEY,
    tutor_id INTEGER NOT NULL,
    estudiante_id INTEGER NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tutor_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE,
    UNIQUE(tutor_id, estudiante_id)
);

CREATE INDEX idx_asignaciones_tutor ON asignaciones_tutores(tutor_id);

-- Tabla de Retroalimentación de Tutores
CREATE TABLE IF NOT EXISTS retroalimentacion_tutores (
    id SERIAL PRIMARY KEY,
    tutor_id INTEGER NOT NULL,
    estudiante_id INTEGER NOT NULL,
    evaluacion_id INTEGER,
    comentario TEXT NOT NULL,
    tipo VARCHAR(30) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios_academia(id) ON DELETE CASCADE
);

-- =============================================
-- ROLES
-- =============================================

INSERT INTO roles (nombre_rol, descripcion) VALUES
    ('administrador', 'Acceso total al sistema, gestión de usuarios y configuración'),
    ('tutor', 'Gestión de cursos, seguimiento de estudiantes asignados y evaluaciones'),
    ('participante', 'Acceso a módulos, simuladores y evaluaciones del curso');
