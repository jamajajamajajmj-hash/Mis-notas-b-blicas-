# 📖 Mi Libro de Notas

**Versión 2.66** · incluye **Conversa 7.18** (asistente de voz)

Aplicación de notas bíblicas para iPad y iPhone, organizada como JW Library: **libro → capítulo → notas por versículo**.
Es una sola página web (PWA) que se instala en la pantalla de inicio y funciona **sin internet**. Las notas viven
dentro del aparato; internet solo hace falta para usar Conversa.

---

## Contenido del repositorio

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (HTML + CSS + JavaScript puro, sin librerías ni servidor) |
| `conversa.html` | Conversa: asistente de voz que lee y comenta las notas (Gemini, con respaldos) |
| `sw.js` | Service Worker: guarda la app en el aparato para abrir sin internet y avisa cuando hay versión nueva |
| `icono-512.png` | Ícono de la pantalla de inicio |
| `CHANGELOG.md` | Historial de cambios de cada versión |
| `docs/INSTRUCCIONES-DE-DISENO.md` | Reglas permanentes de diseño que debe respetar cualquier cambio |

---

## Instalación

1. Subir **los cinco archivos juntos** (`index.html`, `conversa.html`, `sw.js`, `icono-512.png` y el
   historial) al mismo sitio. Hoy se publica en Tiiny Host: **tomato-lidia-75.tiiny.site**. Siempre en la
   misma dirección: si cambia la dirección, el aparato la trata como otra app y no ve las notas.
2. En el iPad o iPhone, abrir la dirección en **Safari** → Compartir → **Agregar a pantalla de inicio**.
3. Abrir siempre desde el ícono (así el aparato da más espacio y marca las notas como permanentes).

### Actualizar a una versión nueva

1. Subir el paquete nuevo completo, reemplazando el anterior, en la misma dirección.
2. Abrir la app: aparece **«Versión nueva lista · Abrir ahora»** → tocarlo.
3. Revisar en **Ajustes → Acerca de** el número de versión y «Conversa vX ✓».

> Requisitos: iPadOS / iOS 16.4 o más (17 o más recomendado). Safari.

---

## Uso diario

### Navegar
- **Portada:** libros en cuadrícula de colores (o «☰ Lista»), con el número de notas de cada libro.
- **Ir a…:** escribir `Jer 25`, `Jn 3:16` o `Judas 9` y tocar **Ir**.
- **Capítulo:** dos vistas: **☰ Notas** (lista numerada por versículo, cada una con su color) y
  **📖 Texto con marcas** (el capítulo completo con las notas marcadas; tocar un número abre la nota).
- **Deslizar** la nota pasa a la nota siguiente/anterior del mismo libro (se detiene al terminar el libro).
- **Divisor:** arrastrar la línea entre el panel izquierdo y la nota para darle más espacio; **◂ Panel** lo oculta.

### Escribir y editar una nota
- **+ Nota** en un capítulo crea una nota nueva. La nota se abre en **modo lectura**; **Editar** activa la barra
  de letras (a la izquierda). El guardado es automático («Guardado ✓»).
- **El teclado solo aparece cuando se pide:** botón **⌨️**. Sin teclado, el texto se selecciona fácil con el dedo
  (mantener sobre una palabra y arrastrar las marcas azules). Otro toque a ⌨️ regresa a seleccionar.
- **Barra de letras:**

| Botón | Hace |
|---|---|
| ↶ ↷ | Deshacer / rehacer (60 pasos; también ⌘Z / ⇧⌘Z con teclado) |
| N · C · S · Ma | Negrita, cursiva, subrayado, letra manuscrita |
| A+ · A− · A | Agrandar, achicar o regresar al tamaño normal. Sin selección, cambia el párrafo tocado |
| Aa | MAYÚSCULAS ↔ minúsculas |
| 🎨 · 🖍 | 10 colores de letra y 10 de resaltado (se despliegan dentro de la barra) |
| ✕ | Soltar la selección |
| TODO | Seleccionar todo (puede iniciar la lectura en voz alta) |
| Copiar · Cortar · Pegar | Lo de siempre |
| 📝 A BOSQUEJO | Envía lo seleccionado a «Mi bosquejo» |
| QUITAR | Quita el formato de lo seleccionado |

### Citas bíblicas
- Toda cita escrita en una nota se puede tocar y muestra el texto de la TNM cargada: `1 Cor. 1:6, 7`, `primera Cor`,
  `Mat. 5:3, 5, 7`, `vers. 13`, `Salmo 23` (capítulo completo). Si falta el libro, lo deduce por el contexto.
- El texto bíblico se carga una vez en **Ajustes** desde el **EPUB de la TNM** descargado de jw.org (la app no lo trae).

### Borrar o mover desde la lista
- Botón **⋯** en cada nota de la lista del capítulo: **Eliminar** (dos toques), **Mover a…** o **Cancelar**.
  Lo eliminado va a la Papelera y aparece **«Deshacer»** unos segundos.

---

## Herramientas de estudio

- **Buscar:** en las notas, con filtros de categoría, fuente y etiquetas; buscar `Jn 3:16` encuentra las notas de ese
  texto y las que lo citan.
- **📖 Buscar en la Biblia:** palabras o frases en la TNM cargada (sin importar acentos), en toda la Biblia, por
  sección o por libro.
- **Importar:** archivos `TÍTULO / TEXTO / CATEGORÍA / NOTA` separados por `---`, o un análisis completo pegado tal
  cual; cada nota se archiva en la primera cita de su TEXTO.
- **🃏 Repasar:** tarjetas con repaso espaciado (Otra vez · Difícil · Bien · Fácil).
- **📝 Mi bosquejo:** junta en una sola nota continua lo que se envía desde cualquier texto; ＋ Título, ＋ Mi idea,
  pantalla completa, Copiar, Compartir y «📥 Guardar como nota».
- **🎤 Discursos:** tema + palabras + duración (5–60 min) → bosquejo con introducción, puntos con citas y tiempos,
  y conclusión, armado con las notas; se guarda y se actualiza solo con las notas nuevas. PDF y Copiar.
- **🔎 Notas repetidas o mal ubicadas:** la app revisa cada 7 días (o en Ajustes) y propone **Mover**, **Combinar**,
  **Borrar** o **«Están bien»**. Nada cambia sin tocar un botón; todo tiene Deshacer.
- **PDF y Compartir** de cualquier nota.

---

## Escuchar las notas

- **🔊 Escuchar** (o TODO) lee la nota con la voz del iPad elegida en *Ajustes del iPad → Accesibilidad → Contenido
  leído → Voces* (descargar una voz «Mejorada» o «Premium»). Pausa y sigue en la misma palabra.
- **🎧 Conversa** abre el asistente con la nota lista para leer (micrófono apagado) con la voz de Gemini:
  marca en amarillo lo que va leyendo, velocidad 0.75×–1.6×, ⏮ ⏭ por párrafo, sigue con la pantalla bloqueada,
  y **⬇ Guardar audio** para oírlo en Archivos sin internet. Al volver, regresa a la misma nota y renglón.
- Conversa necesita una clave gratuita de Gemini (Conversa → Ajustes); acepta varias claves y plataformas de respaldo
  (Groq, Cerebras, Mistral, OpenRouter, DeepSeek). Conversa **solo lee** las notas; nunca las cambia.

---

## Respaldo y seguridad de las notas

- **💾 Guardar respaldo** (Ajustes → Respaldo y sincronización): un solo archivo con nombre fijo,
  `mi-libro-de-notas-respaldo.json`, que lleva notas, repaso, bosquejos y discursos. Guardarlo siempre en la misma
  carpeta («📖 Respaldos Mi Libro de Notas», en iCloud Drive) y elegir **Reemplazar**: queda solo el más nuevo.
- **📥 Leer respaldo:** recupera o trae notas de otro aparato (suma las nuevas, gana la más reciente, respeta las
  borradas). Antes guarda una copia «antes de leer respaldo».
- **Copias automáticas dentro del aparato:** una diaria, otra al guardar respaldo y otra al salir de la app si hubo
  cambios. Se conservan 7, 14 o 30 (a elegir); las viejas se borran solas. **Volver a esta** restaura una.
- **Papelera:** lo borrado queda 30 días; **Recuperar** lo regresa.
- **Aviso en la portada** si pasan más de 7 días sin respaldo.

> Las copias automáticas viven en el aparato. El respaldo en Archivos/iCloud es el que protege si se pierde el iPad.

### Espacio de almacenamiento
- **Ajustes → Espacio de almacenamiento** muestra el espacio que da el aparato (en iPadOS 17+, hasta ~60 % del disco
  para la app de pantalla de inicio), lo usado y lo libre, y si las notas están marcadas como **permanentes**
  (si no, tocar «Pedir que sean permanentes»).
- Desglose: notas, copias, texto de la Biblia y audio de Conversa, con botones para borrar el audio viejo.
  Conversa limita su audio a 300 MB (ajustable). Aviso en la portada al pasar del 80 %.

---

## Datos técnicos (para quien la modifique)

- **Sin librerías, sin servidor, sin paso de compilación.** Todo en archivos HTML únicos.
- **Almacenamiento:** IndexedDB `mln-db` (una entrada por nota desde la v2.54, repaso, bosquejos, discursos, copias,
  papelera), espejo pequeño en `localStorage` (`mln.v2`), texto bíblico en `mln-biblia`, audio de Conversa en
  `conversa-audio` (almacén `a`: `{voz, blob, t, bytes, uso}`). **No cambiar estas claves.**
- **Service Worker:** primero el aparato; solo acepta una página nueva si es del mismo sitio y trae su firma
  (`<title>`). Al subir versión, cambiar `VERSION` en `index.html`, `CONVERSA_VERSION` en `conversa.html`,
  `CONVERSA_ESPERADA` en `index.html` y `CACHE` en `sw.js`.
- **Pruebas:** Playwright con `hasTouch` en iPad 1180×820, iPad vertical 820×1180 e iPhone 393×852; sin errores de
  JavaScript; botones de 44 px o más.
- Antes de cualquier cambio, leer **`docs/INSTRUCCIONES-DE-DISENO.md`**.

---

Proyecto personal de Javier. Notas, respaldos y claves de API **no** se suben a este repositorio.
