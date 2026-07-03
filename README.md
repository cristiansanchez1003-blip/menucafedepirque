# ☕ El Café de Pirque — Menú Digital

Menú digital premium para **El Café de Pirque** (Av. Ramón Subercaseaux 560, Local 1, Pirque, Chile). Los clientes escanean un QR y ven el menú en su celular; Marcela administra productos, precios, fotos y datos del local desde un panel privado con usuario y contraseña.

Construido con **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion** y **qrcode.react**. **Sin Supabase ni servicios pagados**: el menú vive en `data/menu.json` dentro de este repositorio y el panel admin lo edita mediante la **API de GitHub** (gratis, con historial de cambios). Las fotos se suben a **Cloudinary** (plan gratuito).

---

## ✨ Funcionalidades

- **Menú público** (`/menu`) — 12 categorías y 219 productos reales (importados desde el menú de Fudo con sus precios exactos). Hero con el logotipo, navegación de categorías con scrollspy, modal de producto tipo bottom-sheet con gesto de arrastre, animaciones de scroll, footer con canales de contacto (WhatsApp, Instagram, correo, Google Maps) y botón flotante de WhatsApp. 100 % mobile-first.
- **Panel admin** (`/admin`) — login con usuario y contraseña (cookie httpOnly firmada con HMAC).
  - Productos: crear, editar, eliminar, reordenar, disponibilidad, búsqueda y filtro por categoría.
  - Imágenes: subida directa a Cloudinary o pegando una URL.
  - Categorías: crear, renombrar, cambiar emoji, eliminar.
  - Ajustes del local: horario, dirección, WhatsApp, Instagram, correo, eslogan.
  - Código QR descargable en PNG.
- **Persistencia sin base de datos**: cada "Guardar cambios" hace un commit de `data/menu.json` al repo vía API de GitHub. Los cambios se ven en el menú público en segundos (no requiere redeploy).

---

## 🎨 Identidad visual (tomada del logotipo)

| Uso | Color |
|-----|-------|
| Fondo | `#F7F4EE` (papel cálido) |
| Tinta / principal | `#24282A` (charcoal del logo) |
| Menta | `#BFE5CB` (taza del logo) |
| Verde profundo | `#2F6B47` (precios y acciones) |

Fuentes: **Playfair Display** (títulos) + **Lato** (texto).

---

## 🚀 Puesta en marcha local

```bash
npm install
```

Crea `.env.local` a partir de `.env.local.example`. Para desarrollo basta con:

```env
ADMIN_USER=marcela
ADMIN_PASSWORD=una-contraseña
AUTH_SECRET=cualquier-texto-largo
```

Sin `GITHUB_TOKEN`, el panel guarda directamente en `data/menu.json` local (ideal para desarrollo).

```bash
npm run dev
```

- Menú: [http://localhost:3000/menu](http://localhost:3000/menu)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ☁️ Configuración en Vercel (producción)

En **Vercel → Project → Settings → Environment Variables** agrega:

| Variable | Valor |
|----------|-------|
| `ADMIN_USER` | usuario del panel (ej: `marcela`) |
| `ADMIN_PASSWORD` | contraseña fuerte para Marcela |
| `AUTH_SECRET` | texto aleatorio largo (firma las sesiones) |
| `GITHUB_TOKEN` | token *fine-grained* con permiso **Contents: Read & Write** solo sobre este repo |
| `GITHUB_REPO` | `cristiansanchez1003-blip/menucafedepirque` |
| `GITHUB_BRANCH` | `main` |
| `CLOUDINARY_CLOUD_NAME` | desde el dashboard de Cloudinary |
| `CLOUDINARY_API_KEY` | desde el dashboard de Cloudinary |
| `CLOUDINARY_API_SECRET` | desde el dashboard de Cloudinary |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ej: `https://menucafedepirque-chi.vercel.app`) |

### Crear el token de GitHub

1. GitHub → **Settings → Developer settings → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → este repo.
3. Permissions → Repository permissions → **Contents: Read and write**.
4. Expiración: 1 año (renovar cuando expire). Copia el token a Vercel.

### Crear la cuenta de Cloudinary (gratis)

1. Regístrate en [cloudinary.com](https://cloudinary.com).
2. En el **Dashboard** copia *Cloud name*, *API Key* y *API Secret* a Vercel.
3. Sin Cloudinary el panel funciona igual: se puede pegar la URL de cualquier imagen.

> Después de agregar o cambiar variables, haz **Redeploy** en Vercel.

---

## 📁 Estructura

```
app/
  layout.jsx              Root layout + fuentes
  page.jsx                Redirect a /menu
  menu/page.jsx           Menú público (scrollspy + modal)
  admin/
    layout.jsx            Guard de sesión
    login/page.jsx        Login usuario/contraseña
    dashboard/page.jsx    Panel: productos, ajustes, QR
  api/
    menu/route.js         GET menú (público)
    auth/…                login / logout / me (cookie firmada)
    admin/menu/route.js   PUT menú completo (commit a GitHub)
    admin/upload/route.js POST imagen a Cloudinary
components/
  menu/                   Hero, CategoryNav, CategorySection, ProductCard,
                          ProductModal, ProductImage, Footer, WhatsappFab
  admin/                  AdminHeader, ProductForm, ProductTable,
                          SettingsForm, CategoryManager, QRSection
data/menu.json            ⭐ La "base de datos": settings + categorías + productos
hooks/                    useMenu (público) · useAdmin (panel)
lib/                      auth.js (HMAC) · menuStore.js (GitHub/local) · format.js
public/images/products/   Fotos reales descargadas del menú de Fudo
public/logo.jpg           Logotipo (hero y login)
```

---

## 🔒 Notas de seguridad

- La contraseña **nunca** está en el código: vive en variables de entorno.
- La sesión es una cookie httpOnly firmada (HMAC-SHA256) con expiración de 7 días.
- El token de GitHub solo tiene acceso a este repositorio.

Menú digital por **Espíritu Digital**.
