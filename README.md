# Academia Virtual Nasser Group - PDVSA
## Plataforma de Inteligencia Artificial para Líderes de Negocio

### Estructura del Proyecto

```
C:\Nasser Group Curso de Inteligencia Artificial\
├── backend\
│   ├── database\
│   │   ├── schema.sql          # Script SQL PostgreSQL
│   │   ├── connection.js       # Conexión a BD + almacenamiento en memoria
│   │   └── init.js            # Inicialización de datos
│   ├── middleware\
│   │   └── auth.js            # Middleware de autenticación JWT
│   ├── routes\
│   │   ├── auth.js            # Endpoints de login/registro
│   │   ├── users.js           # Gestión de usuarios
│   │   ├── evaluations.js     # Sistema de evaluaciones
│   │   ├── certificates.js    # Generación de certificados QR
│   │   └── simulators.js      # Simuladores de IA
│   ├── server.js              # Servidor Express principal
│   ├── package.json
│   └── .env                   # Variables de entorno
│
├── frontend\
│   ├── public\
│   │   └── index.html
│   ├── src\
│   │   ├── components\
│   │   │   └── Layout.js      # Layout principal con sidebar
│   │   ├── context\
│   │   │   └── AuthContext.js # Contexto de autenticación
│   │   ├── pages\
│   │   │   ├── Login.js       # Página de autenticación
│   │   │   ├── Dashboard.js   # Panel principal
│   │   │   ├── Evaluaciones.js # Sistema de cuestionarios
│   │   │   ├── Notas.js       # Boletín de calificaciones
│   │   │   ├── Certificados.js # Generación de certificados
│   │   │   └── Usuarios.js    # Gestión de usuarios (Admin)
│   │   ├── simulators\
│   │   │   ├── SimuladorTexto.js      # Simulador GPT
│   │   │   ├── SimuladorImagenes.js   # Simulador VAE/GANs
│   │   │   └── SimuladorVideoAudio.js # Simulador multimedia
│   │   ├── styles\
│   │   │   ├── index.css      # Estilos principales
│   │   │   └── App.css        # Estilos adicionales
│   │   ├── App.js             # Router principal
│   │   └── index.js           # Entry point
│   └── package.json
│
└── README.md
```

### Requisitos Previos

- Node.js v18+ (https://nodejs.org)
- npm o yarn
- PostgreSQL (opcional - la app funciona con almacenamiento en memoria)

### Instalación y Ejecución

#### 1. Backend

```bash
cd "C:\Nasser Group Curso de Inteligencia Artificial\backend"
npm install
npm run dev
```

El servidor iniciará en http://localhost:3001

#### 2. Frontend

```bash
cd "C:\Nasser Group Curso de Inteligencia Artificial\frontend"
npm install
npm start
```

La aplicación React iniciará en http://localhost:3000

### Credenciales por Defecto

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@nassergroup.com | admin123 |

### Funcionalidades Implementadas

#### Módulo de Autenticación
- Login seguro con JWT
- Registro de nuevos participantes
- Roles diferenciados: Administrador, Instructor, Participante

#### Simuladores Interactivos
1. **Simulador GPT**: Práctica de prompts para informes técnicos, auditorías y código
2. **Simulador de Imágenes**: Análisis con VAE/GANs para inspección de ductos y mapas de calor
3. **Simulador Video/Audio**: Síntesis de voz, generación de video y clonación de audio

#### Sistema de Evaluaciones
- 3 evaluaciones con 5 preguntas cada una
- Timer configurable
- Calificación automática con 80% mínimo de aprobación

#### Certificados Digitales
- Generación automática con código QR
- Sistema de verificación de certificados
- Descarga en formato texto

#### Gestión de Usuarios (Solo Admin)
- CRUD completo de usuarios
- Asignación de roles
- Búsqueda y filtrado

### Base de Datos

La aplicación utiliza almacenamiento en memoria por defecto. Para usar PostgreSQL:

1. Crear la base de datos ejecutando `backend/database/schema.sql`
2. Configurar las credenciales en `backend/.env`
3. La aplicación detectará automáticamente PostgreSQL

### Tecnologías Utilizadas

**Backend:**
- Node.js + Express
- JWT (JSON Web Tokens)
- bcryptjs (encriptación)
- QRCode (generación de códigos QR)

**Frontend:**
- React 18
- React Router v6
- Axios (peticiones HTTP)
- Lucide React (iconos)
- qrcode.react (códigos QR)

### Diseño Visual

Paleta de colores corporativa Oil & Gas:
- Azul institucional PDVSA: #0a2342
- Dorado/Naranja: #d4a843
- Verde éxito: #10b981
- Teal: #0d6e6e
