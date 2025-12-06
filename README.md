# 🎵 Artbook by 910.WAV

**La plataforma oficial de 910.WAV para artistas emergentes de Rosario y la región.**

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-yellow)
![License](https://img.shields.io/badge/license-Privado-red)

---

## 📖 Sobre el Proyecto

**Artbook** es un catálogo digital premium donde artistas musicales emergentes pueden:
- ✅ Crear su perfil profesional
- ✅ Mostrar su música, videos y biografía
- ✅ Conectar con productores, managers y marcas
- ✅ Aparecer en el ranking mensual
- ✅ Gestionar su contenido desde un dashboard privado

---

## 🚀 Stack Tecnológico

### Frontend
- **React** 19.2.0
- **Vite** 7.2.4
- **React Router** 7.9.6
- **CSS puro** (sin frameworks)

### Backend
- **Supabase** (PostgreSQL + Auth + Storage)
- **Resend** (Email notifications)

### Deploy
- **Vercel** (Hosting + CI/CD)
- **GitHub** (Control de versiones)

---

## 📂 Estructura del Proyecto

```
Artbook/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── lib/             # Utilidades y clientes (Supabase)
│   ├── assets/          # Imágenes y recursos
│   ├── App.jsx          # Configuración de rutas
│   ├── index.css        # Estilos globales
│   └── main.jsx         # Entry point
├── supabase/
│   └── functions/       # Edge Functions
├── docs/                # Documentación y datos de prueba
├── public/              # Assets estáticos
└── package.json
```

---

## 🎯 Funcionalidades Principales

### Para Artistas
- 📝 **Inscripción pública** con formulario completo
- 🎨 **Perfil personalizable** con avatar y portada
- 🎵 **Showcase de música** (hasta 3 tracks)
- 📹 **Videos destacados** (hasta 2 videos)
- 🔗 **Redes sociales** integradas
- 📊 **Dashboard privado** para gestionar contenido
- 🔐 **Sistema de autenticación** seguro

### Para Visitantes
- 🏆 **Ranking mensual** de artistas más visitados
- 📚 **Catálogo completo** navegable
- 🔍 **Perfiles detallados** con toda la info del artista
- 📱 **Diseño responsive** mobile-first

### Para Administradores (910.WAV)
- 👑 **Panel de administración** con control total
- ✏️ **Edición de perfiles** de artistas
- 📧 **Sistema de notificaciones** por email

---

## 💻 Instalación y Desarrollo

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Supabase
- Cuenta de Vercel (para deploy)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/artbook-910wav.git
cd artbook-910wav

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con:
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:5173
```

### Build para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm preview
```

---

## 🗂️ Base de Datos

### Tabla Principal: `artists`

Contiene toda la información de los artistas:
- Datos personales (nombre, bio, ciudad)
- Multimedia (fotos, música, videos)
- Redes sociales
- Estadísticas de visitas
- Categorización (géneros, climas, eventos)

### Storage: `artist-photos`

Bucket para almacenar:
- Avatares de perfil
- Portadas de artista

---

## 🌐 Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal con ranking mensual |
| `/book` | Catálogo completo de artistas |
| `/apply` | Formulario de inscripción |
| `/login` | Login de artistas |
| `/dashboard` | Panel de control del artista |
| `/artist/:slug` | Perfil público del artista |
| `/admin` | Panel de administración 910.WAV |
| `/forgot-password` | Recuperación de contraseña |
| `/update-password` | Actualización de contraseña |

---

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Fondo:** Dark (#0a0a0f)
- **Cards:** #111
- **Bordes:** #1e293b
- **Accent Purple:** #9333ea
- **Accent Pink:** #ec4899
- **Texto:** White/Slate

### Características Visuales
- ✨ Gradientes violeta-rosas
- 🌟 Efectos glow sutiles
- 🔘 Botones tipo cápsula
- 🖼️ Portadas full-width
- 💫 Microanimaciones smooth

---

## 📊 Roadmap

### ✅ Versión 1.0 (Actual)
- [x] Sistema completo de autenticación
- [x] CRUD de artistas
- [x] Upload de imágenes
- [x] Ranking mensual
- [x] Dashboard privado
- [x] Perfiles públicos
- [x] Sistema de visitas

### 🔜 Versión 1.1 (Próxima)
- [ ] Paginación del catálogo
- [ ] Búsqueda y filtros
- [ ] SEO básico (meta tags)
- [ ] Microanimaciones avanzadas
- [ ] Verificación de email
- [ ] Anti-spam en inscripciones

### 🚀 Versión 2.0 (Futuro)
- [ ] Analytics avanzados
- [ ] Sistema de favoritos
- [ ] Suscripción premium
- [ ] Multi-idioma
- [ ] Marketplace de servicios
- [ ] Integración n8n

---

## 🤝 Contribución

Este es un proyecto privado de **910.WAV**. Para contribuir, contactar a:

**Alejandro Miranda Baremberg**  
Email: [tu-email]  
Instagram: [@910.wav](https://instagram.com/910.wav)

---

## 📄 Licencia

© 2025 910.WAV - Artbook. Todos los derechos reservados.

Este proyecto es de uso privado y no está disponible bajo ninguna licencia open source.

---

## 🙏 Agradecimientos

- **ChatGPT** por asistencia en desarrollo
- **Google Antigravity** por optimización de código
- **Supabase** por la infraestructura backend
- **Vercel** por el hosting
- **Resend** por el servicio de emails

---

## 📝 Documentación Adicional

Para contexto completo del proyecto, ver:
- `docs/project_context.md` - Documentación técnica completa
- `supabase/functions/README.md` - Documentación de Edge Functions
- `docs/Planilla Artistas/` - Datos de prueba

---

## 🐛 Reportar Issues

Si encontrás un bug o tenés una sugerencia, contactar directamente al equipo de 910.WAV.

---

**Desarrollado con 💜 por 910.WAV**  
*Where Music Meets Technology*
