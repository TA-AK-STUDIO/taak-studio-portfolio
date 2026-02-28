# 🎨 Guía de Personalización - TAAK Studio

Esta guía te ayuda a actualizar el contenido del portfolio sin tocar el código de Three.js (que ya está optimizado).

## 📝 Contenido Principal

Editar `src/app/page.tsx` → buscar la sección `studioData`:

### Logo / Branding

```typescript
logo: "https://i.ibb.co/thLkGz7/Vale-Foto.png", // Actualizar con logo de TAAK
title: "TAAK STUDIO",
subtitle: "Desarrollo Web · Diseño · Experiencias Digitales",
description: "Creamos experiencias web únicas...",
```

**Cómo subir tu logo:**
1. Sube la imagen a imgbb.com (gratis)
2. Copia el "Direct link"
3. Reemplaza la URL en `logo`

---

## 🎯 Proyectos del Portfolio

Actualizar el array `projects`:

```typescript
projects: [
  {
    title: "Nombre del Proyecto",
    description: "Descripción breve (1-2 líneas)",
    url: "https://link-al-sitio.com",
    tech: ["Next.js", "React", "Tailwind"], // Tech stack usado
    image: "opcional-link-screenshot.jpg", // Opcional para futuro
  },
  // Agrega más proyectos aquí...
]
```

**Ejemplo real:**
```typescript
{
  title: "RLS Jerusalem #336",
  description: "Sitio público para logia masónica con diseño minimalista",
  url: "https://rls-jerusalem-336.vercel.app",
  tech: ["Next.js", "Tailwind", "Neon DB"],
},
{
  title: "JulianaFrausto Portfolio",
  description: "Portfolio artístico con diseño acuarela vibrante",
  url: "https://juliana-frausto.vercel.app",
  tech: ["Next.js", "Framer Motion", "Vercel Blob"],
},
```

---

## 🌐 Redes Sociales

Actualizar el array `socials`:

```typescript
socials: [
  { title: "github", url: "https://github.com/TA-AK-STUDIO" },
  { title: "twitter", url: "https://twitter.com/TAAKStudio" },
  { title: "instagram", url: "https://instagram.com/taakstudio" },
  { title: "mail", url: "mailto:hello@taakstudio.com" },
]
```

**Iconos disponibles:**
- `github`, `twitter`, `instagram`, `mail`, `warpcast`

Si necesitas agregar más iconos, avísame.

---

## 🎨 Colores

El tema actual usa:
- **Primary:** Cyan (`cyan-400`, `cyan-500`)
- **Background:** Black con overlays semi-transparentes
- **Accent:** Blue gradients

Para cambiar el color principal:
1. Buscar `cyan` en `src/app/page.tsx`
2. Reemplazar por otro color de Tailwind (ej: `purple`, `green`, `pink`)

---

## 🚀 Deploy

```bash
# 1. Instalar dependencias (primera vez)
npm install

# 2. Probar local
npm run dev
# Abrir http://localhost:3000

# 3. Deploy a producción (Vercel)
vercel --prod
```

---

## 📂 Estructura de Archivos

```
src/app/
├── page.tsx              ← Edita aquí el contenido
├── components/
│   └── portalscene.tsx   ← Escena 3D (NO tocar a menos que necesites)
└── layout.tsx
```

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar la escena espacial?**  
R: Sí, pero requiere conocimientos de Three.js. Si quieres cambios (ej: agregar nave 3D, cambiar colores del espacio), pídemelo.

**P: ¿Cómo agrego más secciones (ej: "Servicios")?**  
R: Necesitas editar el código. Dime qué sección quieres y te la agrego.

**P: ¿El sitio es responsive?**  
R: Sí, funciona en mobile/tablet/desktop. La escena 3D se adapta automáticamente.

---

**¿Necesitas ayuda?** Mándame un mensaje. 🐆
