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
- **Gastos fijos con calendario**: día de pago y periodicidad (mensual a
  bianual, para SOAT o tecnomecánica). Semáforo de estado — Al día,
  Por pagar y Vencido — calculado sobre la fecha real de vencimiento.
  Al registrar el pago se descuenta de la cuenta elegida; si lo pagaste
  antes, se registra sin volver a descontar.
- **Ahorro mensual requerido**: prorratea los fijos mensuales más la
  fracción de los anuales, para saber cuánto apartar cada mes.
- **Buscador** en Transacciones y **deshacer** al eliminar un movimiento.
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
   const CACHE_VERSION = 'kasa-v2.0.0'; // ← incrementa este número
   ```
3. Al abrir la app instalada aparecerá el aviso **"Nueva versión
   disponible · Actualizar"**. Un toque y se recarga sola: ya no hace
   falta cerrarla desde el multitarea.

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
| Flujo Neto | Ingresos − (Gastos fijos prorrateados + Variables) | > 0 |
| Patrimonio Neto | Activos − Pasivos | creciente |
| Nivel de Endeudamiento | Pasivos ÷ Activos × 100 | < 40 % |
| Capacidad de Ahorro | Flujo Neto ÷ Ingresos × 100 | ≥ 20 % |
| Fondo de Emergencia | (Ahorros + saldo disponible) ÷ Gasto mensual | 3 – 6 meses |

> El semáforo del Dashboard compara los compromisos del mes contra tu
> **Total Disponible** (no contra los ingresos del mes), para que un mes
> sin ingresos registrados no marque alerta si tienes respaldo.

> Los activos incluyen automáticamente tus **ahorros acumulados**. Registra el resto de
> activos y tus pasivos en la sección **Patrimonio** para un Balance General completo.

---
*Kasa es una herramienta de organización personal; no constituye asesoría financiera profesional.*

---

## v2 · Conciliación que sí suma + Traslados internos

- **La conciliación ahora sí suma al total**: Total en Efectivo y Total en Digital
  son saldos en libros (movimientos ± conciliaciones ± traslados). Antes la
  diferencia solo se veía en el historial.
- **Saldo previo corregido**: antes tomaba el monto de la última conciliación e
  ignoraba los movimientos hechos después; ahora parte del saldo en libros actual.
- **Traslados internos**: mueve plata entre Efectivo y tus cuentas digitales
  (ej: cuenta X saca $30.000 a efectivo → efectivo +$30.000 y cuenta X −$30.000).
  No son ingreso ni gasto: el total no cambia. Con validación de saldo suficiente,
  historial propio en Conciliación, botón en el Dashboard y por cuenta.
- La bolsa "Sin asignar" ahora incluye los ajustes del Total digital y los
  traslados, y distingue movimientos sueltos de ajustes generales.
- Datos: nuevo almacén `traslados` (IndexedDB v5), incluido en exportar/importar
  JSON (versión 7). Al eliminar una cuenta, sus traslados pasan a Digital general.

---

## v3 · Préstamos con amortización + criterio contable

- **🏦 Préstamos**: crea el préstamo (monto, cuota, Nº cuotas, tasa E.A., desembolso a tus bolsillos), paga cuotas o abonos con split **interés/capital** (estimación automática editable), tabla de amortización por Saldos Insolutos, estados y alertas. El saldo restante alimenta Pasivos y reportes.
- **Pasivo por cuotas ⇒ tabla automática**: al agregar un pasivo, el checkbox "Es deuda por cuotas" pide solo lo necesario y crea el préstamo sin duplicar; el botón 📋 convierte pasivos manuales existentes.
- **Auto-cálculo**: si el banco da la cuota se despeja la tasa sola (y viceversa, o el plazo); solo se llena el campo vacío.
- **Criterio contable**: efectivo y digital en libros entran automáticos a Activos (con aviso anti-duplicado); en el ERI solo el interés es gasto, el capital amortiza el pasivo (fila de ajuste visible en PDF/CSV).
- Datos: almacén `prestamos` (IndexedDB v6), JSON versión 8. Pagos antiguos migran como 100% capital (sin cambios de saldo).

---

## v4 · Tarjetas de crédito, paleta Esmeralda, presupuestos y metas

**💵💳 Cuentas débito y crédito**
- Cada cuenta tiene modalidad: **débito** (plata tuya) o **crédito** (plata
  prestada). Las cuentas viejas quedan "sin modalidad" para asignarlas con un toque.
- **Crédito es deuda**: las compras la suben, los pagos la bajan y resta del total
  digital (no se duplica en Patrimonio). Muestra cuánto debes, el cupo disponible
  con barra de uso (verde < 30 %, amarillo, rojo ≥ 80 %) y las cuotas por facturar.
- **Ciclo de facturación real**: cada compra entra al extracto de su corte y se paga
  el día de pago siguiente. La tarjeta muestra cuánto pagar y hasta cuándo, lo que va
  del corte en curso y cuándo se paga. Cada compra en Movimientos dice "se paga el…".
- **🌟 Días oro**: los días después del corte, cuando una compra tiene el mayor plazo
  para pagar. Kasa avisa "¡Estás en días oro!" en el Dashboard, en Cuentas y al
  registrar una compra. La ventana (1 a 15 días, 5 por defecto) se ajusta por tarjeta.
- **💰 Pagar tarjeta**: desde efectivo o una cuenta débito, con el pago del extracto
  sugerido. No cuenta como gasto (las compras ya se registraron) y libera cupo.

**🛡 Sentido común financiero**
- El efectivo y las cuentas débito no pueden quedar en negativo: Kasa bloquea el
  gasto, ahorro, pago o eliminación que lo provocaría y avisa "saldo insuficiente".
- Las tarjetas no pueden pasar de su cupo. Un préstamo solo se desembolsa a efectivo
  o débito, y sus cuotas se pagan desde ahí.
- Si ya hay un saldo negativo, el Dashboard lo señala para conciliarlo.

**🎯 Presupuestos, metas y próximos pagos**
- **Presupuestos por categoría** (Insights): tope mensual con barra de avance,
  aviso al 80 % y al pasarte, y sugerencia según tu promedio de 3 meses.
- **Metas de ahorro** (Ahorros): objetivo, fecha límite opcional, avance, cuánto
  apartar al mes y botón "Aportar".
- **Próximos pagos** (Dashboard): gastos fijos, cuotas de préstamos y extractos de
  tarjeta que vencen en 7 días o ya vencieron.

**🎨 Diseño y rendimiento**
- Paleta **Esmeralda** en claro y oscuro (iconos incluidos), con más contraste en
  modo claro. El tema sigue al del celular hasta que eliges uno.
- Montos que no se cortan en pantallas angostas, zoom con dos dedos, icono correcto
  en iPhone y lista de movimientos por bloques para que no se ponga lenta.
- **Respaldo**: importar un JSON ahora sí reemplaza los datos. Si Kasa está abierta
  en otra pestaña durante una actualización, avisa que la cierres.
- Datos: IndexedDB v7 y JSON versión 9 (presupuestos y metas). La migración desde
  v6 conserva todo, pero **exporta un respaldo antes de actualizar**.

---

## v5 · Presupuesto general del mes

**🎯 Un solo presupuesto para todo**
- En Insights defines cuánto quieres gastar en total al mes (por ejemplo $929.000);
  ya no se elige categoría.
- Cuenta **todos** los gastos del mes: gastos normales, gastos fijos pagados, cuotas
  de préstamos y compras con tarjeta de crédito.
- **Aviso en cada gasto**: al guardarlo, Kasa dice cuánto te queda; desde el 80 %
  avisa en amarillo y, si te pasas, en rojo con cuánto vas por encima.
- **¿En qué se te va?**: desglose por categoría con monto y porcentaje; al tocar una
  categoría ves sus gastos uno por uno. El Dashboard muestra la barra general y las
  3 categorías con más gasto, y en el mes en curso cuánto puedes gastar por día.
- Si tenías presupuestos por categoría (v4), se suman solos en uno general (también
  al importar un respaldo viejo). El formato de datos no cambia (IndexedDB v7, JSON 9).

---

## v6 · Inicio mes a mes y auditoría

**📅 Inicio según el mes**
- Al navegar de mes, Inicio muestra los saldos de ese mes: en un mes pasado,
  "Saldo al cierre de…" (efectivo, digital, desglose y totales a fin de mes); en uno
  futuro, el saldo proyectado. Recientes muestra los movimientos de ese mes.
- Próximos pagos, días oro y avisos de saldo negativo solo aparecen en el mes en curso.
- Si la app queda abierta y cambia el mes, al volver se pasa al mes nuevo.

**🎯 Presupuesto**
- Cuentan también los pagos de gastos fijos y cuotas registrados "sin descontar"
  (pagados antes de anotarlos), en el mes en que se pagaron.
- **Mes a mes** en Insights: los últimos 6 meses con lo gastado y el % del tope;
  tocar un mes lo selecciona.

**🔧 Correcciones**
- Los gastos fijos ya no se cuentan dos veces en el semáforo, la regla 50/30/20 y el
  Estado de Resultados.
- Balance General: la deuda de las tarjetas de crédito va a Pasivos (antes, si superaba
  lo que había en débito, el exceso desaparecía).
- Eliminar una cuenta ya no borra su saldo inicial del total.
- Editar un movimiento conserva su categoría (pagos de fijos, préstamos).
- El movimiento de un pago de fijo o cuota se deshace desde su sección, no desde
  Movimientos, para que el pago no quede marcado sin plata.
- Importar un respaldo sanea los identificadores (seguridad).

---

## v7 · Fijos y cuotas apartados en el presupuesto

**🎯 El presupuesto ya cuenta lo que tienes que pagar**
- Desde el día 1, los gastos fijos y las cuotas de préstamos que vencen en el mes quedan
  **apartados** en el presupuesto. "Te quedan" muestra solo lo libre para lo demás.
- La barra tiene dos tramos: lo **gastado** (sólido) y lo **por pagar** (rayado).
  Al pagar un fijo o una cuota, el monto pasa de un tramo al otro: lo que te queda
  no cambia y nada se cuenta dos veces.
- Lo vencido sigue apartado hasta que lo pagues. Los fijos de periodicidad mayor
  (SOAT, impuestos) se apartan completos en el mes en que vencen; si aún no tienen
  ningún pago registrado, no se sabe cuándo vencen y no se apartan.
- Meses pasados: solo lo realmente gastado. Meses futuros: proyección de lo que vence.
- "¿En qué se te va?" marca lo que falta por pagar en cada categoría y lo lista primero.
- Al definir el tope, Kasa muestra cuánto suman tus fijos y cuotas del mes y cuánto
  te queda para lo demás, y avisa si el tope no alcanza.
- Pagar un fijo o una cuota que ya estaba apartado no dispara avisos de presupuesto.
  Un abono mayor a la cuota sí avisa por la diferencia.

**📌 Fijos mensuales: cada pago cubre un mes**
- Al registrar el pago eliges **qué mes pagas** (por defecto, el atrasado más antiguo
  o el siguiente sin pagar). El próximo vencimiento es el mes siguiente al último pagado.
- Antes se contaba desde la fecha del pago: pagar octubre el 3 de noviembre saltaba
  noviembre, y pagar diciembre por adelantado no lo dejaba cubierto. Ya no pasa.
- Si un mes atrasado no se debía (por ejemplo, pausaste el servicio), elige el mes que
  pagas y los anteriores quedan cerrados.
- Editar un pago permite corregir el mes que cubre. "Deshacer pago" quita el del
  último mes pagado.
- Los pagos registrados antes siguen valiendo sin migrar nada. Si alguno había
  saltado un mes, ese mes vuelve a aparecer como pendiente: págalo, regístralo
  "sin descontar" si ya lo pagaste por fuera, o elige un mes posterior para cerrarlo.
- Los fijos de periodicidad mayor (SOAT, impuestos) siguen contando desde la fecha
  del pago.
- El formato de datos no cambia (IndexedDB v7, JSON 9; los pagos nuevos guardan el
  campo `ciclo`).

---

## v8 · Pagar la tarjeta de crédito, fácil y cuadrado

**💳 Pagar tarjeta, a la vista**
- Nuevo botón **"💰 Pagar tarjeta · $X"** dentro de cada tarjeta en Cuentas (antes era un
  icono pequeño sin texto). Se pone en rojo si el extracto está vencido.
- También en **+ → Pagar tarjeta de crédito** y tocando la tarjeta en **Próximos pagos** del Inicio.
- Modal propio: eliges la tarjeta, ves cuánto debes, el pago del extracto y hasta cuándo,
  y tocas **Pago del extracto**, **Todo lo que debes** u **Otro valor**. Eliges de dónde sale
  la plata (efectivo o débito) y ves antes de guardar cómo quedan el origen, la deuda y el cupo.

**🧮 Que se descuente bien**
- **Intereses y cuota de manejo**: si el extracto del banco trae más de lo que Kasa dice, se
  anotan en el mismo pago. Se registran como gasto ("Intereses y comisiones") en la tarjeta,
  así la deuda cuadra con el banco y el pago la deja en cero.
- Ya no se puede pagar más de lo que se debe por error (antes la tarjeta quedaba "a favor").
  Aplica también al traslado genérico hacia una tarjeta.
- **Compras a cuotas**: la última cuota absorbe el redondeo. Antes 3 cuotas de $100.000
  sumaban $99.999 y quedaba un saldo "fantasma" que el extracto nunca cobraba.
- Si registras un **gasto** que dice "tarjeta" (ej. "Pago tarjeta Visa"), Kasa pregunta si es
  un pago: como gasto se contaba dos veces y la deuda no bajaba.
- **Pagos recientes** en cada tarjeta (con ✕ para deshacer). Antes el pago solo aparecía en
  Conciliación → Traslados y parecía que no se había guardado.
- El corte en curso muestra lo que ya abonaste por adelantado y lo que falta.
- Recordatorio: pagar la tarjeta **no es gasto** y no cambia el Total Disponible; cada compra
  ya se descontó al registrarla. Baja la plata del origen y baja la deuda en lo mismo.
- El formato de datos no cambia (IndexedDB v7, JSON 9).
