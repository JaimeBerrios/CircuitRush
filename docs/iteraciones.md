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
