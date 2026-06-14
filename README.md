# ☕ El Café de Pirque — Menú Digital

Menú digital interactivo para **El Café de Pirque**, cafetería ubicada en Av. Ramón Subercaseaux 560, Pirque, Chile. Los clientes escanean un código QR en la mesa y ven el menú completo en su celular; el dueño administra productos, precios y disponibilidad desde un panel privado.

Construido con **Next.js 14 (App Router)**, **Supabase**, **Tailwind CSS**, **Framer Motion** y **qrcode.react**. Diseño mobile-first, estética rústica-premium.

---

## ✨ Funcionalidades

- **Menú público** (`/menu`) — vista a la que apunta el QR. Categorías con navegación sticky, tarjetas de productos, modal de detalle, badge de "No disponible", skeletons de carga.
- **Panel admin** (`/admin`) — protegido con Supabase Auth.
  - Gestión de productos por categoría (crear, editar, eliminar, activar/desactivar).
  - Generador de código QR descargable en PNG.
- **8 categorías** y **32 productos** de ejemplo precargados (precios en CLP).

---

## 🎨 Identidad visual

| Uso | Color |
|-----|-------|
| Fondo principal | `#FDF6EC` (crema cálido) |
| Primario | `#6B3A2A` (café oscuro) |
| Acento | `#C4843A` (ámbar dorado) |
| Texto | `#2C1A0E` (café muy oscuro) |
| Texto suave | `#8C6A4E` (café medio) |
| Bordes | `#E8D5B7` (beige) |

Fuentes: **Playfair Display** (títulos) + **Lato** (texto).

---

## 🚀 Puesta en marcha — paso a paso

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd "Cafetería de Pirque"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear un proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo (gratis).
2. Espera a que termine de aprovisionarse.

### 4. Ejecutar el esquema SQL

1. En Supabase, abre **SQL Editor**.
2. Copia y pega **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. Presiona **Run**. Esto crea las tablas `categories` y `products`, las políticas de seguridad (RLS) y carga las 8 categorías con 32 productos de ejemplo.

### 5. Crear el bucket de imágenes (opcional)

Si quieres subir imágenes propias en lugar de usar URLs de internet:

1. Ve a **Storage** → **New bucket**.
2. Nombre: `product-images`.
3. Marca la opción **Public bucket** y créalo.

> El proyecto funciona sin esto: en el formulario de productos puedes pegar cualquier URL de imagen.

### 6. Crear el usuario administrador

1. Ve a **Authentication** → **Users** → **Add user**.
2. Ingresa el correo y la contraseña que usará el dueño para entrar a `/admin`.
3. (Opcional) En **Authentication → Providers → Email**, desactiva "Confirm email" para que el usuario quede activo de inmediato.

### 7. Configurar las variables de entorno

Copia el archivo de ejemplo y complétalo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Encuentra la URL y la `anon key` en Supabase → **Project Settings → API**.

### 8. Correr en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) → te redirige a `/menu`. El panel está en [http://localhost:3000/admin](http://localhost:3000/admin).

### 9. Deploy en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com), **New Project** → importa el repo.
3. En **Environment Variables**, agrega las tres variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
   - En `NEXT_PUBLIC_SITE_URL` pon la URL final de Vercel (ej. `https://el-cafe-de-pirque.vercel.app`).
4. **Deploy**.

### 10. Generar el QR e imprimir

1. Entra a `tu-sitio.vercel.app/admin` y autentícate.
2. Baja a la sección **Código QR**, presiona **Descargar QR**.
3. Imprime el PNG y colócalo en mesas y mostrador. ¡Listo!

---

## 📁 Estructura del proyecto

```
app/
  layout.jsx            Root layout + fuentes Google
  page.jsx              Redirect a /menu
  menu/page.jsx         Vista pública del menú (destino del QR)
  admin/
    layout.jsx          Guard de autenticación
    login/page.jsx      Login con Supabase Auth
    dashboard/page.jsx  Panel de administración
components/
  menu/                 Header, CategoryNav, ProductCard, ProductModal, MenuGrid, Footer
  admin/                AdminHeader, ProductForm, ProductTable, QRSection
hooks/
  useMenu.js            Fetch de categorías + productos (público)
  useAdmin.js           CRUD de productos (admin)
lib/
  supabase.js           Cliente de Supabase
  format.js             Formato de precios CLP
supabase/
  schema.sql            SQL completo con seed
```

---

## 🛠️ Personalización rápida

- **Horario / Instagram / dirección:** edita `components/menu/Footer.jsx`.
- **Imagen de cabecera:** cambia la URL en `components/menu/Header.jsx`.
- **Productos y precios:** desde el panel `/admin` (no requiere tocar código).

---

Menú digital por **Espíritu Digital**.
