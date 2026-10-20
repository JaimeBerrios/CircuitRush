# CircuitRush: Restaura la Energía

Tercera iteración del minijuego individual de «Vibecoding Guiado» de KODIGO Academy, AI for Developers Jr. 3. Conecta la fuente ⚡ con el destino ◎ girando las piezas de tres tableros fijos de 4 × 4, 5 × 5 y 6 × 6. Sin servicios externos, cuentas ni base de datos.

## Ejecutar localmente

Requiere Python 3 y Flask. Desde esta carpeta:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

Abre http://127.0.0.1:5000. Detén el servidor con Ctrl+C. La instalación inicial requiere acceso a los paquetes; después el juego funciona sin Internet. El servidor escucha únicamente en el equipo local y no activa el depurador.

## Jugar

Haz clic o usa Tab y Enter/Espacio sobre las piezas. Cada giro horario de 90° suma un movimiento. La fuente amarilla y el destino marcado con un círculo son fijos. Las conexiones recíprocas con energía se iluminan en cian.

| Nivel | Tablero | Tiempo |
| --- | --- | --- |
| 01 — Encendido | 4 × 4 | 120 s |
| 02 — Reconexión | 5 × 5 | 180 s |
| 03 — Sobrecarga | 6 × 6 | 240 s |

El reloj comienza con la primera rotación válida. El tiempo sigue transcurriendo al cambiar de pestaña: se calcula con tiempo real transcurrido, no contando callbacks. Al llegar a cero, las piezas se bloquean y el modal permite reintentar. Reiniciar o cambiar de nivel cancela el reloj anterior.

Completa un nivel para desbloquear el siguiente. Puedes repetir cualquiera desbloqueado desde el selector. Al ganar, el modal muestra movimientos, segundos restantes, puntuación, mejor récord y las opciones de repetir o continuar. Esc cierra el resultado; «Reiniciar partida» permite volver a jugar.

**Puntuación por victoria:** `máximo(0, 1000 + segundos restantes × 10 − movimientos × 20)`. Una derrota no otorga puntos. Los segundos son enteros mostrados por el reloj al resolver. No hay suma acumulada entre niveles. En `localStorage`, clave `circuitrush-v1`, se guardan por separado la mayor puntuación, el menor número de movimientos y el último nivel desbloqueado. Recargar conserva las marcas, pero comienza una partida nueva en el nivel 01. Las marcas dependen del navegador y del origen (host/puerto); borrar sus datos las elimina. Si el almacenamiento falla, puedes jugar y conservar marcas durante esa sesión.

## Archivos y lógica

- `app.py`: instancia Flask y ruta GET `/`.
- `templates/index.html`: interfaz, tablero y estados accesibles.
- `static/css/style.css`: piezas con CSS local, colores, cuadrícula adaptable y transición de rotación.
- `static/js/game.js`: configuraciones, propagación, sesión con reloj, récords y adaptación al DOM.
- `tests/game.test.cjs`: pruebas sin paquetes adicionales, mediante Node.
- `docs/iteraciones.md`: decisiones, resultados y validaciones pendientes.

Las direcciones 0, 1, 2 y 3 representan arriba, derecha, abajo e izquierda. Cada giro suma 1; las conexiones se calculan módulo 4. La rotación visual conserva el número total de giros para evitar animaciones inversas al completar una vuelta. BFS parte de la fuente, exige conexiones recíprocas y utiliza un conjunto de visitados. Como cada casilla entra en la cola una vez, el recorrido termina incluso si existen ciclos. La vista se actualiza a partir del mismo estado utilizado para comprobar la victoria.

## Validar

Con Node 18 o posterior, sin instalar paquetes:

```bash
node tests/game.test.cjs
python3 -m py_compile app.py
```

Las pruebas de interfaz automatizadas utilizan un DOM simulado; no sustituyen la revisión visual en un navegador. Consulta el registro para ver qué se ejecutó realmente.

Solución reproducible desde el inicio (fila y columna empiezan en 1):

| Pieza | Clics |
| --- | ---: |
| Fila 1, columna 2 | 2 |
| Fila 2, columna 2 | 3 |
| Fila 3, columna 2 | 3 |
| Fila 3, columna 3 | 2 |
| Fila 4, columna 3 | 2 |

Esta secuencia gana en 12 movimientos; no se afirma que sea la solución mínima.

Validación de Iteración 03: **19 pruebas Node aprobadas**, conservando las siete originales. Comprueban soluciones mediante giros legales en los tres niveles, reloj controlado, puntuación, almacenamiento, progresión y DOM. Flask devuelve HTTP 200 para la página, CSS y JavaScript. En Firefox real se verificaron teclado, reloj, victoria, desbloqueo, recarga, derrota con reloj inyectado, los tres tamaños y movimiento reducido. Sin desbordamiento horizontal a 1366, 768 y 500 px. La captura de 390 px es una revisión visual con fixture de selección; no demuestra interacción táctil.

Los dos tableros nuevos se construyen a partir de rutas serpentinas fijas, sin aleatoriedad. El área y la longitud del recorrido crecen; `CircuitRush.LEVELS` contiene una secuencia reproducible de giros por nivel. Las pruebas confirman que empiezan sin resolver y que esas rotaciones alcanzan el destino. No se afirma que sean soluciones mínimas. La ruta del nivel 01 y su secuencia anterior se conservan.

Evidencias y límites de verificación: `docs/assets/contenido/evidencias/iteracion-03/README.md`. Historial y los tres prompts íntegros en `docs/iteraciones.md` y `docs/datos/info.md`. Pendientes: móvil físico, lector de pantalla y otros navegadores. La sesión no se guarda; no hay cuentas ni sincronización entre equipos.

## Reporte de la actividad

El [reporte académico para KODIGO](docs/pdf/reporte.pdf) contiene la descripción del juego, las explicaciones de los tres prompts, la comparación de iteraciones, capturas reales, validación y reflexión. Los tres prompts íntegros se incluyen como respaldo al final: siete páginas de reporte, incluida la portada, y veintiuna de transcripciones. La reflexión conserva una nota de revisión personal hasta que el autor confirme su contenido.

## Control de versiones

El código está preparado para Git con `.gitignore` para el entorno virtual y cachés. No se realizan commits ni pushes automáticamente. Node se usa solo para las pruebas; el juego requiere Python/Flask y un navegador con JavaScript.

Esta entrega conserva el diseño de la Iteración 02 e incorpora únicamente la jugabilidad de la Iteración 03. No se ha iniciado una cuarta iteración.
