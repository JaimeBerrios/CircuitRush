# Registro de iteraciones

## Iteración 01 — MVP funcional (2026-10-20)

### Objetivo y prompt utilizado

Implementar un único circuito reproducible de 4 × 4 que permita rotar piezas y restaurar energía desde una fuente hasta un destino, con Flask y JavaScript Vanilla.

Se utilizó el prompt del estudiante titulado **«PROMPT 01 — CIRCUITRUSH: DESARROLLO DEL MVP FUNCIONAL»**, recibido en esta sesión. Resumen de sus instrucciones (no transcripción literal): inspeccionar el directorio; separar servidor, HTML, CSS y lógica; implementar rotaciones horarias, BFS/DFS con conexiones recíprocas, victoria, contador y reinicio; validar once escenarios; documentar resultados reales sin inventar evidencias; no avanzar a la segunda iteración, instalar complejidad ajena al MVP ni realizar commits o pushes.

La IA actuó como asistente de implementación y validación técnica. La revisión y reflexión personal del estudiante permanecen pendientes; este registro no pretende sustituirlas. Solo existe un prompt de producto en esta entrega: no se atribuyen al estudiante prompts adicionales ni iteraciones posteriores.

### Estado inicial y decisiones

El directorio inspeccionado no contenía una aplicación ni instrucciones AGENTS.md aplicables. Se creó `circuitrush/` respetando la estructura solicitada, añadiendo únicamente pruebas y `.gitignore`.

Flask sirve una plantilla y archivos locales; toda la partida reside en el navegador. No se utilizan APIs, imágenes remotas ni bibliotecas frontend. Las piezas son botones nativos con brazos CSS. Fuente y destino están fijos. No se requieren piezas T para resolver este nivel.

El estado define tipo y rotación por pieza. Se separan creación del nivel, cálculo de conexiones, BFS y rotación de la actualización del DOM. BFS usa conexiones recíprocas y un conjunto de visitados. El reinicio crea un estado independiente. Las etiquetas accesibles describen posición, conexiones y energía; los botones admiten teclado. Se respeta la preferencia de movimiento reducido.

### Funcionalidades y archivos creados

Implementados: tablero de 16 casillas, rectas y esquinas, fuente y destino, giro horario, contador, propagación de energía, señal visual, mensaje de victoria con movimientos, bloqueo al ganar y reinicio reproducible. CSS adaptable a pantallas pequeñas.

Archivos: `app.py`, `requirements.txt`, `README.md`, `.gitignore`, `templates/index.html`, `static/css/style.css`, `static/js/game.js`, `tests/game.test.cjs` y este registro.

### Pruebas ejecutadas y evidencia real

Comandos ejecutados desde el directorio padre:

```bash
node circuitrush/tests/game.test.cjs
python3 -m py_compile circuitrush/app.py
```

Resultado: **7 pruebas JavaScript aprobadas, 0 fallos**; compilación sintáctica Python con código de salida 0. También se ejecutó `node --test circuitrush/tests/game.test.cjs`, que informó éxito del archivo; la ejecución directa posterior mostró individualmente las siete pruebas.

| Escenario solicitado | Resultado real y alcance |
| --- | --- |
| 01. Flask inicia y muestra la aplicación | Pendiente: importar Flask produjo `ModuleNotFoundError`. No se inició el servidor ni se comprobó HTTP. |
| 02. Exactamente 16 casillas | Aprobado en estado y montaje con DOM simulado. |
| 03. Giro de 90° | Aprobado en lógica; animación visual pendiente de navegador. |
| 04. Un incremento por giro | Aprobado; fuente, destino e índices inválidos no suman movimientos. |
| 05. Conexiones incompatibles | Aprobado: la pieza contigua sin puerto recíproco no recibe energía. |
| 06. Conexiones compatibles | Aprobado: el camino desde la fuente energiza las piezas conectadas. |
| 07. Ciclos | Aprobado: ciclo cerrado aislado no recibe energía; recorrido recíproco termina y no vuelve a encolar visitados. Con piezas de grado máximo 2 y fuente de grado 1, un ciclo cerrado no puede además conectarse a la fuente. |
| 08. Nivel resoluble | Aprobado con la secuencia documentada de 12 giros. |
| 09. Mensaje de victoria | Aprobado en DOM simulado; también se verifica bloqueo de todas las piezas. Navegador real pendiente. |
| 10. Reinicio | Aprobado en DOM simulado: orientaciones, contador, mensaje y desbloqueo restaurados. |
| 11. Pantallas pequeñas | Pendiente de revisión visual e interacción en navegador; disponer de CSS adaptable no prueba su usabilidad. |

También se comprobó rechazo de tableros y tipos de pieza inválidos. No se generaron capturas ni se efectuaron pruebas manuales de interfaz. Node v22.23.3 estaba disponible. No se instalaron dependencias durante estas pruebas.

### Errores y correcciones

La comprobación del entorno detectó que Flask no estaba instalado. Se solicitó autorización para instalarlo en un entorno virtual local; hasta recibirla, la validación del servidor permanece pendiente. No se presentó esta ausencia como un fallo del código del juego.

Antes de ejecutar las pruebas, se ajustó la casilla de fila 4, columna 3 a una esquina, para permitir que el recorrido previsto llegue al destino por la izquierda. Las pruebas posteriores confirmaron la solución. No se observaron fallos en las siete pruebas ejecutadas; no se inventan errores adicionales.

### Limitaciones y siguientes pasos autorizables

Completar la prueba de Flask y la revisión manual de escritorio, móvil y teclado usando la guía del README. La suite no utiliza un motor de navegador ni demuestra la calidad visual, y la compilación de Python no demuestra funcionamiento de Flask. La partida no se guarda al recargar, conforme al alcance local sin persistencia.

Se mantiene un único nivel. Temporizadores, más niveles, sonido y puntuaciones avanzadas quedan fuera de esta entrega y no se implementarán sin instrucciones posteriores. La reflexión personal del estudiante y la segunda iteración quedan pendientes de su participación y autorización.

## Iteración 02 — Rediseño visual futurista y mejoras UX (2026-10-20)

### Objetivo, prompt y justificación

Aplicar el **PROMPT 02 — CIRCUITRUSH: REDISEÑO VISUAL FUTURISTA Y MEJORAS UX**, conservado en `datos/info.md` después del Prompt 01. Ambos textos mantienen su orden; no se sustituye el prompt anterior. El segundo prompt fue añadido al archivo durante esta sesión; se conservó su contenido. La autorización actual permite únicamente esta segunda iteración. No se realizaron commits, pushes ni una Iteración 03.

La interfaz inicial ya tenía colores oscuros, piezas CSS, botones semánticos y transición de giro, pero solo dos estadísticas y un mensaje de victoria en línea. Se mejoró la jerarquía del tablero, la lectura del estado eléctrico y la presentación del resultado. Las capturas 01–04 en `assets/contenido/imagenes/` permanecen intactas.

### Análisis y cambios implementados

Se inspeccionaron estructura, README, registro, servidor, plantilla, estilos y JavaScript antes de editar. `info.md` estaba en `docs/datos/`, no en la raíz. `createGame` genera el estado inicial; `connections` calcula los puertos; `propagate` recorre BFS y detecta el destino; `rotate` suma un giro y un movimiento; `mount` conecta el estado al DOM. No se modificaron esas funciones puras ni el nivel: el algoritmo eléctrico sigue siendo el de la primera iteración.

- Encabezado compacto, identidad CircuitRush, nivel 01 y panel energético de ciencia ficción con fuentes locales del sistema.
- Tres estadísticas: movimientos, estado real (desconectado cuando solo la fuente tiene energía, parcialmente conectado cuando existe al menos otra pieza energizada, restaurado al alcanzar el destino) y nivel fijo 01.
- Piezas uniformes, fuente amarilla, conexiones activas cian con brillo moderado, destino con borde discontinuo y verde al ganar. Etiquetas accesibles describen energía, posición y conexiones.
- Giro horario acumulativo de 200 ms y transición discreta de energía; sin temporizadores, bloqueos de interacción ni dependencias nuevas. Movimiento reducido desactiva animaciones y transiciones.
- Modal nativo `dialog` con título, icono, movimientos reales, botón de repetición, foco inicial, retención de Tab y cierre con Esc. Al cerrar se puede reiniciar desde el botón principal; el juego ganado permanece bloqueado.
- Reinicio común para ambos botones; restaura orientaciones sin giro inverso animado y enfoca la primera pieza giratoria.
- Instrucciones, ayuda de teclado, leyenda con símbolos y texto, estilos hover/focus/presionado y paneles reorganizados en móvil.

Archivos modificados: `templates/index.html`, `static/css/style.css`, `static/js/game.js`, `tests/game.test.cjs`, `README.md`, `docs/iteraciones.md`. `docs/datos/info.md` contiene la incorporación del Prompt 02 observada durante la sesión. Evidencias nuevas y su guía en `docs/assets/contenido/evidencias/iteracion-02/`. `app.py` y `requirements.txt` no necesitaron cambios. No se editaron los entregables LaTeX ni las presentaciones de la plantilla documental incluida en `docs/`.

### Validación ejecutada

| Comprobación | Resultado y alcance |
| --- | --- |
| `node tests/game.test.cjs` | 7 pruebas aprobadas, 0 fallos. Incluyen 16 casillas, giro 90°, contador, conexiones compatibles/incompatibles, ciclos, solución, bloqueo, reinicio y rechazo de datos inválidos. |
| Ampliación de prueba DOM | Comprueba tres estados energéticos, 40 clics consecutivos y rotación acumulada de 3600°, movimientos reales del modal, ambos reinicios y recuperación del foco. |
| `.venv/bin/python -m py_compile app.py` | Aprobado. |
| Cliente de pruebas Flask | GET `/`, CSS y JavaScript devuelven HTTP 200. |
| `.venv/bin/python app.py` y `curl -I http://127.0.0.1:5000` | Servidor iniciado en loopback; HTTP 200 confirmado. No se instalaron paquetes. |
| Firefox real, mediante Marionette | Enter y Espacio suman un movimiento cada uno; estado parcial tras dos giros; 40 clics DOM consecutivos suman exactamente 40; solución muestra modal de 12 movimientos; foco inicial y Tab en botón del modal; repetición reinicia contador y enfoca pieza. |
| 1920 × 1080, 1366 × 768 y 768 × 1024 | Viewport exacto comprobado, 16 botones y sin desbordamiento horizontal. Casillas medidas: 144, 97.5 y 144 px respectivamente. Capturas guardadas; laptop revisada visualmente. |
| 390 × 844 | Captura real con Firefox headless y revisión visual: tablero completo en el ancho disponible, paneles reorganizados y controles legibles. Se permite desplazamiento vertical. No se automatizó interacción táctil. |
| Movimiento reducido | Firefox iniciado con `ui.prefersReducedMotion = 1`: media query activa y duración calculada de `.wires` igual a `0s`. Aprobado. |

La automatización de navegador se ejecutó con scripts temporales Python usando el protocolo integrado de Firefox; no requiere paquetes adicionales ni forma parte del servidor. Las comprobaciones de clics rápidos verifican estado y orientación final, no una evaluación humana de cada fotograma.

### Errores identificados y correcciones reales

El servidor no pudo abrir sockets dentro del sandbox; tras autorización se inició correctamente fuera de esa restricción. Firefox inicialmente carecía de la carpeta de perfil temporal: se creó y se repitió la captura. No eran defectos del algoritmo.

La prueba real de Tab detectó que el foco podía abandonar el botón del modal; se añadió manejo de Tab dentro del diálogo y la prueba posterior aprobó. La revisión de laptop mostró un tablero demasiado alto: se redujo el ancho máximo del panel a 440 px en escritorios de poca altura y se regeneró la captura.

Marionette impone un mínimo de ventana de 500 px en este entorno; la aserción de 390 px falló por esa limitación. Se utilizó el modo de captura de Firefox con ventana de 390 × 844 para obtener evidencia móvil real. La modificación de preferencias desde el contexto privilegiado fue rechazada por Firefox; se verificó movimiento reducido reiniciándolo con la preferencia en su perfil temporal.

### Comparación y evidencias

Antes: panel de dos indicadores, una única columna sencilla y victoria en un párrafo. Después: consola energética con jerarquía visual, tres estadísticas, distinción explícita de conexión parcial, modal accesible y adaptación específica para móvil y laptop. La solución reproducible continúa requiriendo 12 giros en la secuencia documentada; no se afirma que sea mínima.

Capturas 05 (tres tamaños), 06 (parcial), 07 (victoria) y 08 (móvil) en `assets/contenido/evidencias/iteracion-02/`. El README de esa carpeta identifica cada archivo y cómo reproducirlo. No se crearon imágenes ilustrativas para sustituir capturas.

### Limitaciones pendientes

Revisión táctil en móvil/tablet físicos, lector de pantalla, otros navegadores y valoración humana de suavidad durante clics rápidos. La captura móvil no acredita interacción táctil ni medición automática del desbordamiento a 390 px. Las instrucciones inferiores requieren desplazamiento vertical en pantallas bajas. No se hizo una auditoría completa de contraste WCAG. No se atribuye ninguna reflexión personal al estudiante ni se regeneraron los PDF académicos de ejemplo.

## Iteración 03 — Ampliación de jugabilidad (2026-10-20)

### 1. Objetivo

Extender el juego existente con tres niveles progresivos, cuenta regresiva, puntuación por victoria y récords locales. Se conservaron Flask, JavaScript Vanilla, las piezas CSS, la estética futurista y el nivel 01 original. No se implementó una cuarta iteración ni se realizaron commits o pushes.

### 2. Justificación

El selector permite progresar y repetir sectores; el incremento de tamaño y longitud del recorrido añade dificultad reproducible. El reloj limita cada intento y la fórmula visible permite entender cómo tiempo y movimientos afectan al resultado. Los récords ofrecen una referencia local sin cuentas ni infraestructura adicional. Estas son decisiones técnicas de implementación, no reflexiones personales atribuidas al estudiante.

### 3. Prompt utilizado

**PROMPT 03 — CIRCUITRUSH: NIVELES PROGRESIVOS, TEMPORIZADOR Y SISTEMA DE PUNTUACIÓN**, conservado íntegramente en `datos/info.md` después de los Prompts 01 y 02. Ya estaba incorporado como modificación previa al iniciar este trabajo; se verificó su presencia y se conservó sin duplicarlo. Las cuatro fases solicitadas fueron análisis del código y línea base, implementación incremental, validación y documentación.

### 4. Archivos modificados

- `../static/js/game.js`: configuración de niveles, BFS adaptable, sesión, reloj, fórmula, almacenamiento y DOM.
- `../templates/index.html`: selector, reloj, etiquetas dinámicas y controles del resultado.
- `../static/css/style.css`: adaptación de paneles y selector, casillas móviles y derrota.
- `../tests/game.test.cjs`: se conservaron las siete pruebas originales sin eliminarlas; se añadieron doce.
- `../tests/browser-smoke.py`: prueba reproducible con el protocolo Marionette de Firefox, usando solo la biblioteca estándar de Python.
- `../README.md`, este registro y evidencias en `assets/contenido/evidencias/iteracion-03/`.

No se modificaron `app.py`, dependencias, entregables LaTeX ni presentaciones de la plantilla académica incluida. Esta entrega se limita al juego y su documentación solicitada.

### 5. Cambios funcionales

| Sector | Dimensión | Tiempo inicial |
| --- | --- | --- |
| Encendido | 4 × 4 | 120 s |
| Reconexión | 5 × 5 | 180 s |
| Sobrecarga | 6 × 6 | 240 s |

El nivel 01 conserva exactamente sus piezas y su solución de 12 movimientos. Los otros tableros se construyen mediante rutas serpentinas fijas; no usan números aleatorios. Cada configuración incluye un testigo de solución en `LEVELS.solution`. Las pruebas aplican rotaciones legales hasta energizar el destino, sin reemplazar piezas para simular una victoria. No se afirma que los testigos sean soluciones mínimas.

`createGame` carga niveles; `connections`, `propagate` y `rotate` conservan la lógica eléctrica con límites dinámicos; `createSession` gestiona selección autorizada, reloj y resultados; `readRecords` y `saveWin` validan y guardan marcas. `mount` adapta la interfaz. No se introdujo una refactorización general ni nuevas dependencias.

El reloj comienza con el primer giro válido, usa `performance.now()` y resta segundos transcurridos reales. Un intervalo actualiza la vista; las rotaciones y `visibilitychange` también comprueban vencimiento. Ganar, perder, reiniciar o seleccionar otro nivel cancelan el intervalo anterior. Al volver de una pestaña suspendida, la primera comprobación incluye todo el tiempo transcurrido.

La fórmula es **máximo(0, 1000 + segundos restantes × 10 − movimientos × 20)**, calculada una sola vez al ganar. La derrota no puntúa. Cada nivel guarda su mejor puntuación y menor número de movimientos de forma independiente, aunque esas marcas provengan de partidas distintas. `localStorage` usa `circuitrush-v1`; entradas inválidas se descartan y excepciones no impiden jugar. Solo se guardan récords y desbloqueos, no partidas en curso. Los bloqueos se validan en la interfaz y en `session.select`, no solo mediante CSS.

Un único modal nativo muestra victoria o derrota; se evita reabrirlo por actualizaciones repetidas. El foco de Tab contempla los dos botones de victoria. Los botones del selector se conservan entre actualizaciones para evitar perder el foco al avanzar el reloj.

### 6. Pruebas ejecutadas

| Comprobación | Resultado real |
| --- | --- |
| Línea base `node tests/game.test.cjs` | 7 aprobadas, 0 fallos. |
| Suite ampliada, mismo comando | 19 aprobadas, 0 fallos; salida TAP guardada. |
| Tamaños y soluciones | 16, 25 y 36 piezas, inicialmente sin resolver, soluciones legales aprobadas en los tres niveles. |
| Reloj controlado | Inicio válido, tiempo real con callbacks retrasados, intervalo único, parada por victoria/derrota/cambio, reinicio y bloqueo al vencer aprobados. |
| Puntuación y almacenamiento | Fórmula, mínimo cero, cálculo único, récords independientes, recarga simulada, JSON corrupto y excepciones de lectura/escritura aprobados. |
| Progresión y DOM | Selección bloqueada rechazada, desbloqueo sucesivo, cuadrícula dinámica, derrota única, reintento y conservación de botones del selector aprobados. |
| Python | `python3 -m py_compile app.py tests/browser-smoke.py` aprobado tras corregir el script auxiliar. |
| Cliente Flask del entorno virtual | GET `/`, CSS y JavaScript: HTTP 200. |
| Firefox real / `tests/browser-smoke.py` | Selector bloqueado, Enter/Espacio, reloj tras espera real, victoria de 1960 puntos en nivel 01, continuación a 25/36 piezas, recarga con récords y desbloqueos, derrota con reloj inyectado y movimiento reducido aprobados. |
| Responsive Firefox | Los tres tableros sin desbordamiento horizontal en viewports de 1366 × 915, 768 × 915 y 500 × 915. |
| Capturas a 390 px de ancho | Revisión visual real de cada nivel con la plantilla actual y fixture de selección. Sin validación táctil ni aserciones DOM a ese ancho. |

La derrota de navegador se aceleró inyectando un reloj en una sesión de prueba; no se esperaron dos minutos ni se cambió el tiempo inicial de producción. Las pruebas Node usan reloj e intervalos controlados para demostrar casos límite. La prueba real de pestaña oculta queda pendiente; su comportamiento temporal se valida mediante retraso simulado y cálculo real transcurrido.

### 7. Resultados obtenidos

Las siete pruebas originales continúan aprobadas, incluidos energía recíproca, ciclos, giro acumulado, solución y reinicio. Las nuevas comprobaciones confirman los tres tableros y el ciclo de partida completo. Se generaron capturas reales 09–15, capturas móviles adicionales y registros de resultados. La carpeta de evidencias identifica alcance y método de cada una.

### 8. Errores reales encontrados

El sandbox impidió abrir sockets. Fuera del sandbox, el puerto 5000 estaba ocupado por un servidor anterior cuya plantilla en caché no contenía el selector. Esto produjo una aserción fallida de interfaz, no un fallo de desbloqueo. Una espera inicial de 1.2 s no alcanzó a observar el refresco del reloj. Marionette impuso un mínimo de 500 px aunque se solicitaran 390. El modo screenshot requirió crear previamente su carpeta de perfil.

Al guardar el script auxiliar de navegador, una sustitución introdujo un paréntesis sobrante; la comprobación sintáctica lo detectó. Otro comando de generación de fixtures usó el Python del sistema sin Flask y falló con `ModuleNotFoundError`.

### 9. Correcciones aplicadas

Se solicitó permiso técnico para sockets/Firefox, se inició la versión actual en el puerto 5001 y se repitieron las pruebas contra ese proceso. Se dio margen de 2.2 s al muestreo del reloj. Para 390 px se utilizó el modo screenshot de Firefox con fixtures de selección, sin presentar esas capturas como pruebas de interacción. Se creó el perfil temporal, se corrigió el paréntesis y se ejecutó la generación de plantillas con `.venv/bin/python`. La revisión visual detectó además que el texto de sector seguía fijo en 01; ahora cambia junto con el nivel y la derrota usa el acento amarillo del diseño.

### 10. Limitaciones pendientes

Pruebas táctiles en equipos físicos, lector de pantalla, otros navegadores, pestaña realmente suspendida por el sistema operativo y revisión humana de la dificultad. Las soluciones son testigos válidos, no óptimos. Las capturas móviles usan una altura ampliada para mostrar el tablero completo; en teléfonos bajos se requiere desplazamiento vertical. No se afirma cumplimiento total de WCAG. Los datos locales pueden editarse desde herramientas del navegador: no existe un sistema competitivo ni antitrampas. No se inventaron reflexiones del estudiante ni se regeneraron los PDF de ejemplo fuera del alcance solicitado.
