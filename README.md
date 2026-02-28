# 🚀 TAAK STUDIO - Portfolio Espacial

Portfolio interactivo de TAAK Studio con una experiencia espacial inmersiva usando Three.js.

## Stack

- **Framework:** Next.js 15
- **3D:** Three.js + post-processing (Bloom, FXAA, Sharpen)
- **UI:** React + Tailwind CSS
- **Icons:** React Icons

## Features

- ✨ Escena espacial interactiva (starfield, galaxias, nebulosas, planetas)
- 🎨 Post-processing avanzado para calidad visual
- 📱 Responsive design
- 🎯 Navegación por tabs (Inicio, Portfolio, Contacto)
- 🌌 Efecto de zoom en escena con scroll

## Setup

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build

# Start producción
npm start
```

Abrir [http://localhost:3000](http://localhost:3000)

## Estructura

```
src/
├── app/
│   ├── components/
│   │   └── portalscene.tsx    # Escena Three.js
│   ├── page.tsx                # Página principal
│   └── layout.tsx
└── ...
```

## Personalización

Para actualizar el contenido del portfolio, editar `src/app/page.tsx`:

- `studioData.logo` - Logo del estudio
- `studioData.projects` - Lista de proyectos
- `studioData.socials` - Links de redes sociales

## Deploy

El proyecto está configurado para deploy en Vercel:

```bash
vercel --prod
```

---

**TAAK STUDIO** - Desarrollo Web · Diseño · Experiencias Digitales 🌌
