# Cafe Raiz - Demo SaaS gastronomica

Demo funcional de un ecosistema digital para cafeterias, restaurantes y bares. La carta publica es la puerta de entrada, pero el producto tambien administra sucursales, QR, promociones, reservas, pedidos, newsletter, resenas, integraciones, salud digital, metricas y recomendaciones accionables.

Stack: **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **qrcode.react** y persistencia JSON respaldada por GitHub para demos desplegadas en Vercel.

## Rutas publicas

- `/menu`: carta publica responsive.
- `/menu?branch=providencia&qr=mesa-01`: carta con sucursal y QR de origen.
- `/api/track`: registra eventos de QR, vistas, clics e interacciones.
- `/api/newsletter`: guarda suscriptores con consentimiento.
- `/api/reservations`: guarda solicitudes de reserva.
- `/api/orders`: guarda pedidos con pago al retirar.

## Rutas administrativas

- `/admin/login`: inicio de sesion.
- `/admin/dashboard`: panel SaaS con Inicio, Carta, Promos, Operaciones, Clientes, Sucursales, Analitica, Crecimiento, Integraciones, Salud, Ajustes y QR.
- `/api/platform`: datos operativos, metricas y recomendaciones.
- `/api/admin/menu`: guarda carta y configuracion.
- `/api/admin/subscribers/export`: exporta newsletter en CSV.

## Usuarios demo y roles

La autenticacion actual usa `ADMIN_USER` y `ADMIN_PASSWORD`. El seed crea usuarios/roles dentro de `data/platform.json` para modelar multi-tenant:

- `superadmin@cafedigital.cl`: superadmin.
- `duena@caferaiz.cl`: propietario.
- `admin@caferaiz.cl`: administrador.
- `encargada@caferaiz.cl`: editor.

La UI ya representa esos roles en datos, pero el control granular por rol sigue pendiente de migrar a una base real con sesiones multiusuario.

## Variables de entorno

Copia `.env.local.example` a `.env.local` para desarrollo local. En Vercel configura las mismas variables en `Project Settings > Environment Variables`.

```env
ADMIN_USER=admin
ADMIN_PASSWORD=cambia-esta-contrasena
AUTH_SECRET=genera-un-secreto-largo-aleatorio
NEXT_PUBLIC_SITE_URL=https://tu-demo.vercel.app

GITHUB_TOKEN=
GITHUB_REPO=usuario/repositorio
GITHUB_BRANCH=main

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=el-cafe-digital
```

Para Vercel, `GITHUB_TOKEN` y `GITHUB_REPO` son recomendados porque el filesystem serverless no conserva escrituras. Usa un token fine-grained de GitHub con permiso **Contents: Read and write** solo sobre este repositorio. Con eso se guardan cambios del admin, metricas QR, newsletter, reservas y pedidos en `data/menu.json` y `data/platform.json`.

Cloudinary es opcional. Sin esas variables el administrador puede pegar URLs de imagenes manualmente, pero no subir archivos desde el panel.

## Preparar datos demo

```bash
npm run seed
```

El seed es idempotente y crea:

- Negocio ficticio realista: Cafe Raiz.
- 2 sucursales: Casa Providencia y Terraza Nunoa.
- 25+ productos con variantes, extras, alergenos, disponibilidad, temporada y etiquetas.
- Promociones, menu del dia, brunch y happy hour.
- Fuentes QR, eventos historicos, reservas, pedidos, newsletter, fidelizacion, resenas de ejemplo e integraciones.

No hay migraciones SQL porque esta demo usa JSON. Al migrar a Supabase/Postgres, las entidades ya estan separadas por `business_id`.

## Verificacion local

```bash
npm run seed
npm run test
npm run verify:production
npm run build
```

`npm run test` ejecuta un smoke test de consistencia de datos SaaS. `npm run verify:production` revisa reglas de deploy: datos completos, marca demo limpia, variables ejemplo y ausencia de etiquetas sin stock.

## Deploy en Vercel

1. Sube el repositorio a GitHub.
2. En Vercel, importa el repositorio como proyecto Next.js.
3. Configura las variables de entorno de `.env.local.example`.
4. Asegura que `NEXT_PUBLIC_SITE_URL` tenga la URL final de Vercel o tu dominio.
5. Crea un `GITHUB_TOKEN` fine-grained con acceso solo a este repo y permiso `Contents: Read and write`.
6. Define `GITHUB_REPO` como `usuario/repositorio` y `GITHUB_BRANCH` como la rama de deploy.
7. Despliega.

Despues del deploy, prueba:

- `/menu`
- `/menu?branch=providencia&qr=mesa-01`
- `/admin/login`
- Pestaña `QR` del admin.
- Alta de newsletter, reserva o pedido.
- Pestaña `Analitica` despues de abrir una URL con `qr=...`.

## Probar QR y metricas

1. Ejecuta `npm run dev`.
2. Abre `/admin/dashboard` y entra a la pestaña `QR`.
3. Selecciona una fuente, por ejemplo `Mesa 1`.
4. Abre la URL generada, por ejemplo `/menu?branch=providencia&qr=mesa-01`.
5. El escaneo se registra en `data/platform.json` local o en GitHub si `GITHUB_TOKEN` esta configurado.
6. Abre un producto, cambia categoria o haz clic en WhatsApp/Maps/Reviews.
7. Vuelve a `Analitica`: las metricas usan eventos reales y deduplican escaneos repetidos dentro de una ventana corta por sesion.

## Limitaciones reales

- GitHub JSON sirve para una demo vendible y de bajo trafico, pero no es una base de datos transaccional.
- Antes de operar clientes reales concurrentes conviene migrar persistencia a Supabase/Postgres con RLS, roles reales y auditoria.
- El RBAC granular esta modelado, pero no aplicado todavia a cada accion administrativa.
- Google Business, Google Ads, Meta Ads y proveedores de email estan preparados como estados/adaptadores, pero requieren OAuth y credenciales reales.
- No se simulan pagos exitosos: los pedidos quedan como pago al retirar.
- La ubicacion precisa no se obtiene ni se debe obtener sin permiso explicito; la demo usa QR por mesa/sucursal/campana e inferencia no invasiva.
