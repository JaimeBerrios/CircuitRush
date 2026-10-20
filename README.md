# CircuitRush: Restaura la Energía

Segunda iteración del minijuego individual de «Vibecoding Guiado» de KODIGO Academy, AI for Developers Jr. 3. Conecta la fuente ⚡ con el destino ◎ girando las piezas de un tablero fijo de 4 × 4. Sin servicios externos, cuentas ni base de datos.

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

Haz clic o usa Tab y Enter/Espacio sobre las piezas. Cada giro horario de 90° suma un movimiento. La fuente amarilla y el destino marcado con un círculo son fijos. Las conexiones con energía se iluminan en cian. Solo se transmite energía cuando coinciden los extremos de ambas piezas. Al ganar, el tablero se bloquea y aparece un modal con los movimientos reales. «Jugar nuevamente» restaura la configuración original; Esc cierra el modal y permite usar «Reiniciar partida».

## Archivos y lógica

- `app.py`: instancia Flask y ruta GET `/`.
- `templates/index.html`: interfaz, tablero y estados accesibles.
- `static/css/style.css`: piezas con CSS local, colores, cuadrícula adaptable y transición de rotación.
- `static/js/game.js`: nivel, funciones puras y adaptación al DOM.
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

Validación de Iteración 02: siete pruebas Node aprobadas, Flask real con HTTP 200 y comprobaciones en Firefox de teclado, modal, reinicio, clics rápidos y movimiento reducido. Capturas reales en `docs/assets/contenido/evidencias/iteracion-02/`; consultar su README para alcance y pendientes. El Prompt 01 y el Prompt 02 están en `docs/datos/info.md`.

Pendiente: interacción táctil en dispositivos físicos, revisión con lector de pantalla y compatibilidad en otros navegadores. La captura de 390 × 844 valida la presentación móvil; la automatización de interacción se ejecutó en escritorio.

## Control de versiones

El código está preparado para Git con `.gitignore` para el entorno virtual y cachés. No se realizan commits ni pushes automáticamente. Node se usa solo para las pruebas; el juego requiere Python/Flask y un navegador con JavaScript.

Esta entrega incorpora el rediseño visual y las mejoras UX de la Iteración 02. No incluye niveles adicionales, sonido, temporizador, puntuaciones avanzadas ni IA integrada.
