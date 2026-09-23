# 💚 Kasa · Finanzas Personales (PWA)

App de finanzas personales **offline-first**, instalable como app nativa en Android/iOS
desde GitHub Pages. Sin backend, sin cuentas: todos tus datos viven en **tu dispositivo**
(IndexedDB, con respaldo automático a `localStorage` y memoria).

## ✨ Funciones
- Ingresos, gastos, ahorros, gastos fijos y conciliación de saldos.
- **Cuentas Digitales**: reparte tu saldo digital entre tus cuentas reales
  (Nequi, Bancolombia, Daviplata…). Asigna cada transferencia a una cuenta,
  concilia su saldo real y consulta el desglose desde el Dashboard.
  Los movimientos sin asignar se agrupan y quedan siempre visibles.
- **Formato de moneda**: todos los campos de monto muestran separador de
  miles mientras escribes (`24194` → `24.194`) y se despliegan como `$ 24.194`.
- **Patrimonio**: registro de activos y pasivos para tu Balance General.
- **Reportes EEFF** descargables:
  - **Estado de Resultados** (Ingresos − Egresos = Flujo Neto).
  - **Balance General** (Activos vs. Pasivos = Patrimonio Neto).
  - **Análisis**: Nivel de Endeudamiento, Capacidad de Ahorro, Fondo de Emergencia.
  - **Diagnóstico + 3 acciones** concretas para decidir mejor.
  - Formato **PDF** (imprimible) y **CSV/Excel**.
- Modo claro/oscuro, diseño mobile-first, 100 % funcional sin conexión.

---

## 📁 Estructura del repositorio
```
kasa/
├── index.html                 ← app completa (HTML + CSS + JS)
├── manifest.json              ← metadatos de la PWA (instalación)
├── sw.js                      ← Service Worker (offline + caché)
├── icon-192.png              ← icono 192×192
├── icon-512.png              ← icono 512×512
└── icon-maskable-512.png     ← icono adaptable (Android)
```
> **Importante:** el archivo principal debe llamarse **`index.html`** (ya está listo).
> Tu archivo original `Kasa_RG.html` se conservó sin cambios como respaldo.

---

## 🚀 Desplegar en GitHub Pages (paso a paso)

### Opción A — Desde la web (sin instalar nada)
1. Entra a [github.com](https://github.com) e inicia sesión (crea cuenta si no tienes).
2. Botón **New** → nombre del repositorio, p. ej. `kasa` → **Public** → **Create repository**.
3. En el repo vacío pulsa **uploading an existing file** y arrastra **todos** estos archivos:
   `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`.
4. **Commit changes**.
5. Ve a **Settings → Pages**.
6. En **Build and deployment → Source** elige **Deploy from a branch**.
7. En **Branch** selecciona **`main`** y carpeta **`/ (root)`** → **Save**.
8. Espera ~1 minuto y recarga: aparecerá tu URL:
   `https://TU-USUARIO.github.io/kasa/`

### Opción B — Con Git (terminal)
```bash
cd kasa
git init
git add .
git commit -m "Kasa PWA inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/kasa.git
git push -u origin main
```
Luego activa Pages en **Settings → Pages** igual que en la Opción A (pasos 5–8).

> ✅ GitHub Pages sirve por **HTTPS**, requisito para que el Service Worker y la
> instalación de la PWA funcionen. En `file://` local **no** funcionará la instalación.

---

## 📲 Instalar como app nativa

### Android (Chrome)
1. Abre `https://TU-USUARIO.github.io/kasa/`.
2. Menú **⋮** → **Instalar aplicación** / **Agregar a pantalla de inicio**.
3. Confirma. El icono de Kasa quedará en tu pantalla de inicio y abrirá a pantalla completa.

### iPhone / iPad (Safari) — *obligatorio Safari, no Chrome*
1. Abre la URL en **Safari**.
2. Toca **Compartir** (cuadro con flecha ↑).
3. **Agregar a pantalla de inicio** → **Agregar**.
4. Se instala como app independiente (sin barra del navegador).

### Escritorio (Chrome/Edge)
- Icono **⊕ / instalar** en la barra de direcciones → **Instalar**.

---

## 🔄 Publicar una actualización
1. Sube el `index.html` (u otros archivos) nuevos al repo.
2. **Sube la versión** en `sw.js` para forzar el refresco del caché:
   ```js
   const CACHE_VERSION = 'kasa-v1.0.1'; // ← incrementa este número
   ```
3. Al abrir la app instalada, el Service Worker descargará la versión nueva.

---

## 💾 Tus datos y respaldos
- Todo se guarda **localmente** en el navegador/PWA del dispositivo.
- En **Exportar** puedes:
  - Descargar un **respaldo JSON** completo (incluye patrimonio).
  - Exportar **transacciones** y **EEFF** en CSV.
  - **Importar** un JSON para restaurar en otro dispositivo.
- Desinstalar la app o borrar los datos del sitio elimina la información: haz respaldos.

---

## 🧮 Cómo se calculan las métricas
| Métrica | Fórmula | Ideal |
|---|---|---|
| Flujo Neto | Ingresos − (Gastos fijos + Gastos variables) | > 0 |
| Patrimonio Neto | Activos − Pasivos | creciente |
| Nivel de Endeudamiento | Pasivos ÷ Activos × 100 | < 40 % |
| Capacidad de Ahorro | Flujo Neto ÷ Ingresos × 100 | ≥ 20 % |
| Fondo de Emergencia | (Ahorros + saldo disponible) ÷ Gasto mensual | 3 – 6 meses |

> Los activos incluyen automáticamente tus **ahorros acumulados**. Registra el resto de
> activos y tus pasivos en la sección **Patrimonio** para un Balance General completo.

---
*Kasa es una herramienta de organización personal; no constituye asesoría financiera profesional.*
