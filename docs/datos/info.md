prompt 1

# PROMPT 01 — CIRCUITRUSH: DESARROLLO DEL MVP FUNCIONAL

## 1. Rol y contexto

Actúa como desarrollador full-stack senior, especialista en Python, Flask, HTML5, CSS3, JavaScript y desarrollo de videojuegos web 2D, con experiencia en programación asistida por inteligencia artificial y buenas prácticas de ingeniería de software.

Desarrollaremos **CircuitRush: Restaura la Energía**, un minijuego web de lógica y resolución de circuitos eléctricos, como parte de la actividad individual **«Vibecoding Guiado: Desarrollo de una Aplicación o Mini-Juego con IA como Copiloto»**, correspondiente al bootcamp AI for Developers Jr. 3 de KODIGO Academy.

El objetivo académico es demostrar el uso de IA como asistente de programación mediante prompts progresivos, iteraciones justificadas, comprensión del código, validación crítica y documentación del proceso.

La IA debe actuar como copiloto técnico, no como sustituto del criterio del desarrollador.

**Importante:** esta es la primera iteración de varias. No debes implementar todas las funcionalidades futuras ni generar un proyecto excesivamente complejo.

## 2. Concepto del videojuego

CircuitRush es un minijuego de lógica ambientado en una ciudad futurista que ha sufrido un apagón eléctrico.

El jugador debe restablecer el suministro de energía mediante la rotación de piezas de circuitos distribuidas sobre un tablero.

Cada pieza contiene conexiones eléctricas que pueden orientarse en distintas direcciones. Al hacer clic sobre una pieza, esta gira 90 grados en sentido horario.

La energía se transmite desde una fuente eléctrica hacia las piezas correctamente conectadas hasta alcanzar el nodo de destino.

**Objetivo de la primera versión:** conseguir que el jugador pueda completar un circuito funcional desde la fuente hasta el destino mediante una interfaz web interactiva.

## 3. Stack tecnológico obligatorio

Utiliza las siguientes tecnologías:

- Python 3 para el backend.
- Flask como framework web.
- HTML5 para la estructura.
- CSS3 para la presentación visual.
- JavaScript Vanilla para la lógica interactiva del videojuego.
- Git para el control de versiones.

Restricciones:

- No utilizar React, Vue, Angular ni frameworks frontend adicionales.
- No implementar bases de datos en esta iteración.
- No incorporar autenticación ni cuentas de usuario.
- No utilizar servicios externos ni APIs de terceros.
- No integrar modelos de IA dentro del videojuego.
- No incorporar Docker, microservicios ni arquitecturas complejas.
- Evitar dependencias innecesarias.

La aplicación debe ejecutarse localmente y funcionar sin conexión a Internet una vez instaladas sus dependencias.

## 4. Arquitectura del proyecto

Utiliza una estructura sencilla, organizada y comprensible:

```text
circuitrush/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── game.js
└── docs/
    └── iteraciones.md
```

Responsabilidades:

**app.py:** inicialización de Flask y ruta principal para servir el videojuego.

**index.html:** estructura de la interfaz.

**style.css:** estilos, diseño visual y adaptación a distintos tamaños de pantalla.

**game.js:** representación del tablero, rotación de piezas, conexiones eléctricas, propagación de energía y condiciones de victoria.

**iteraciones.md:** registro de los cambios, decisiones técnicas, pruebas y evidencias del desarrollo.

Mantén una separación clara de responsabilidades.

## 5. Funcionalidades obligatorias del MVP

### 5.1 Pantalla principal

Implementar una interfaz que contenga:

- Nombre del videojuego: CircuitRush.
- Subtítulo: Restaura la Energía.
- Breve instrucción para el jugador.
- Tablero interactivo.
- Indicador de movimientos.
- Estado de conexión eléctrica.
- Botón para reiniciar la partida.

### 5.2 Tablero

Crear un tablero de 4 × 4 casillas.

Cada casilla debe representar una pieza de circuito eléctrico.

Implementar inicialmente:

- Piezas rectas.
- Piezas en forma de esquina.
- Piezas en forma de T, si resultan necesarias.
- Una fuente de energía.
- Un nodo de destino.

Representar cada pieza mediante CSS o SVG local, evitando imágenes externas.

### 5.3 Rotación

Cuando el usuario haga clic sobre una pieza giratoria:

1. Girarla 90 grados en sentido horario.
2. Actualizar su orientación interna.
3. Incrementar el contador de movimientos.
4. Recalcular las conexiones eléctricas.
5. Actualizar visualmente el tablero.

La fuente y el destino deben permanecer fijos en esta primera versión.

### 5.4 Propagación eléctrica

Implementar un algoritmo sencillo de recorrido de grafos, como BFS o DFS.

Cada pieza debe definir las direcciones hacia las que posee conexiones: arriba, derecha, abajo e izquierda.

La energía únicamente puede pasar entre dos casillas adyacentes cuando ambas tienen conexiones orientadas una hacia la otra.

El algoritmo debe:

- Comenzar desde la fuente.
- Comprobar conexiones bidireccionales válidas.
- Evitar recorrer indefinidamente los mismos nodos.
- Identificar todas las piezas que reciben energía.
- Actualizar su estado visual.
- Determinar si la energía alcanza el destino.

Una pieza no debe considerarse energizada simplemente por estar junto a otra.

### 5.5 Condición de victoria

Cuando la energía alcance el destino:

- Mostrar un mensaje de victoria.
- Mostrar el número de movimientos realizados.
- Impedir movimientos adicionales hasta reiniciar.
- Permitir comenzar nuevamente.

### 5.6 Reinicio

El botón de reinicio debe:

- Restaurar las orientaciones iniciales.
- Reiniciar el contador de movimientos.
- Eliminar el estado de victoria.
- Recalcular la propagación eléctrica.
- Permitir jugar nuevamente.

### 5.7 Nivel inicial

Implementar un único nivel prediseñado.

Requisitos:

- Debe tener al menos una solución válida.
- Debe comenzar sin una conexión completa entre fuente y destino.
- Debe poder resolverse mediante rotaciones.
- Debe ser reproducible para facilitar las pruebas.

No generar niveles aleatorios todavía.

## 6. Diseño visual inicial

Crear una interfaz moderna inspirada en sistemas eléctricos futuristas.

Paleta sugerida:

- Azul oscuro para el fondo.
- Azul cian para los circuitos energizados.
- Gris azulado para las conexiones inactivas.
- Amarillo para la fuente de energía.
- Verde para indicar victoria.

Requisitos visuales:

- Diseño limpio y profesional.
- Tablero centrado.
- Piezas claramente diferenciadas.
- Estados visuales identificables.
- Transiciones suaves de rotación.
- Interfaz adaptable a escritorio y dispositivos móviles.
- Tipografía legible.
- Buen contraste entre texto y fondo.

Prioriza la claridad y la funcionalidad. Los efectos visuales avanzados se desarrollarán en una iteración posterior.

## 7. Requisitos de calidad

Aplicar las siguientes prácticas:

- Código modular y legible.
- Funciones con responsabilidades definidas.
- Nombres descriptivos para variables y funciones.
- Validaciones para evitar estados incorrectos.
- Manejo básico de errores.
- Sin código duplicado innecesario.
- Sin dependencias que no aporten valor.
- Comentarios únicamente cuando expliquen lógica no evidente.

No añadir funcionalidades que no hayan sido solicitadas.

## 8. Validación obligatoria

Antes de declarar terminada la implementación, comprobar los siguientes escenarios:

**Prueba 01:** Flask inicia correctamente y muestra la aplicación.

**Prueba 02:** el tablero contiene exactamente 16 casillas.

**Prueba 03:** hacer clic sobre una pieza giratoria modifica su orientación 90 grados.

**Prueba 04:** cada rotación válida incrementa el contador una sola vez.

**Prueba 05:** dos piezas con conexiones incompatibles no transmiten energía.

**Prueba 06:** dos piezas adyacentes con conexiones compatibles transmiten energía cuando existe un camino energizado desde la fuente.

**Prueba 07:** el algoritmo no entra en un ciclo infinito ante circuitos cerrados.

**Prueba 08:** existe una secuencia de movimientos que permite completar el nivel.

**Prueba 09:** al alcanzar el destino aparece el mensaje de victoria.

**Prueba 10:** reiniciar restaura correctamente el estado inicial.

**Prueba 11:** la interfaz sigue siendo utilizable en pantallas pequeñas.

Implementa pruebas automatizadas de la lógica pura cuando resulte sencillo. Complementa con pruebas manuales de la interfaz.

No declares que una prueba pasó si no fue ejecutada. Distingue entre pruebas ejecutadas, pendientes y no verificables desde el entorno.

## 9. Documentación académica

Esta actividad será evaluada según cuatro criterios:

1. Funcionamiento de la aplicación: 2.5 puntos.
2. Uso estratégico de IA y vibecoding: 2.5 puntos.
3. Iteración y mejora de prompts: 3 puntos.
4. Comprensión y validación del código: 2 puntos.

En `docs/iteraciones.md`, documenta la primera iteración incluyendo:

- Objetivo de la iteración.
- Prompt utilizado.
- Funcionalidades implementadas.
- Decisiones técnicas.
- Archivos creados.
- Pruebas ejecutadas y resultados reales.
- Errores encontrados, si los hubo.
- Correcciones aplicadas.
- Limitaciones conocidas.
- Funcionalidades pendientes.

No inventes errores, resultados, capturas ni evidencias.

La reflexión personal del estudiante se elaborará posteriormente y no debe redactarse como si ya hubiese sido realizada.

## 10. Metodología de trabajo

Trabaja en este orden:

**Fase 1 — Análisis**

Inspecciona el directorio de trabajo y determina si ya existe un proyecto.

Explica brevemente la arquitectura propuesta y las responsabilidades de los archivos.

**Fase 2 — Implementación**

Construye únicamente el MVP descrito.

**Fase 3 — Validación**

Ejecuta las pruebas posibles y comunica sus resultados.

**Fase 4 — Documentación**

Actualiza el README y el registro de iteraciones con información verificable.

**Fase 5 — Entrega de resultados**

Presenta un resumen conciso con:

- Archivos creados o modificados.
- Funcionalidades completadas.
- Pruebas realizadas.
- Errores y correcciones.
- Limitaciones pendientes.
- Comandos necesarios para ejecutar el proyecto.

## 11. Instrucciones finales

No avances hacia la segunda iteración sin mi autorización.

No agregues temporizadores, puntuaciones avanzadas, niveles adicionales, efectos de sonido, autenticación ni funcionalidades ajenas al MVP.

No modifiques archivos externos al proyecto.

No realices commits ni pushes automáticamente.

Prioriza que el videojuego funcione correctamente y que yo pueda comprender, explicar y validar su código.

**Comienza con el análisis de la estructura y continúa con la implementación de la primera versión funcional de CircuitRush.**

# PROMPT 02 — CIRCUITRUSH: REDISEÑO VISUAL FUTURISTA Y MEJORAS UX

## 1. Contexto del proyecto

Actúa como desarrollador full-stack senior y diseñador UI/UX especializado en videojuegos web 2D, utilizando Python, Flask, HTML5, CSS3 y JavaScript Vanilla.

Estamos desarrollando **CircuitRush: Restaura la Energía**, un minijuego académico para la actividad «Vibecoding Guiado: Desarrollo de una Aplicación o Mini-Juego con IA como Copiloto», del bootcamp AI for Developers Jr. 3 de KODIGO Academy.

La Iteración 01 ya fue implementada, probada manualmente y publicada en GitHub.

Actualmente, el videojuego permite:

- Visualizar un tablero de circuitos eléctricos.
- Girar piezas 90 grados mediante clics.
- Propagar energía a través de conexiones válidas.
- Contabilizar movimientos.
- Detectar la victoria.
- Reiniciar la partida.

El Prompt 01 se encuentra documentado en `info.md`.

**Objetivo de esta iteración:** transformar la interfaz inicial en una experiencia visual futurista, moderna, atractiva y responsive, conservando el funcionamiento existente.

## 2. Instrucción inicial obligatoria

Antes de modificar cualquier archivo:

1. Inspecciona la estructura actual del proyecto.
2. Lee `info.md`, `README.md` y `docs/iteraciones.md`, si existen.
3. Analiza `app.py`, `templates/index.html`, `static/css/style.css` y `static/js/game.js`.
4. Identifica las funciones responsables de rotación, propagación eléctrica, victoria y reinicio.
5. Determina qué archivos requieren modificaciones.
6. Conserva el comportamiento funcional de la Iteración 01.

No reconstruyas el proyecto desde cero.

No reemplaces innecesariamente la lógica de juego que ya funciona.

## 3. Dirección artística

Diseña una interfaz inspirada en paneles de control energéticos, videojuegos de ciencia ficción y sistemas eléctricos futuristas.

Utiliza una identidad visual coherente.

### Paleta de colores

- Fondo principal: `#080F1E`.
- Superficies: `#111D32`.
- Paneles secundarios: `#192B44`.
- Cian eléctrico: `#35E0F2`.
- Azul luminoso: `#4D9FFF`.
- Amarillo energético: `#FFD166`.
- Verde de éxito: `#4ADE80`.
- Texto principal: `#F1F5F9`.
- Texto secundario: `#94A3B8`.

Puedes ajustar ligeramente estos colores cuando sea necesario para mejorar contraste y accesibilidad.

Evita colores excesivamente saturados y efectos visuales que dificulten la lectura.

## 4. Rediseño de la interfaz

### 4.1 Encabezado

Crear un encabezado compacto con:

- Identidad visual de CircuitRush.
- Nombre del videojuego.
- Subtítulo «Restaura la Energía».
- Indicador de nivel actual: Nivel 01.

Utilizar una tipografía moderna y legible.

No depender de fuentes externas que requieran conexión a Internet.

### 4.2 Panel de estadísticas

Diseñar tarjetas o indicadores para:

- Movimientos realizados.
- Estado energético: desconectado, parcialmente conectado o restaurado.
- Nivel actual.

Los indicadores deben actualizarse según el estado real del juego.

No implementar todavía puntuaciones avanzadas ni temporizadores.

### 4.3 Tablero eléctrico

El tablero debe ser el elemento visual principal.

Requisitos:

- Diseño centrado.
- Casillas uniformes.
- Bordes sutiles.
- Separación consistente entre piezas.
- Circuitos claramente visibles.
- Estados visuales diferenciados.
- Indicadores reconocibles de fuente y destino.
- Respuesta visual al pasar el cursor sobre una pieza giratoria.
- Diseño adaptable a diferentes resoluciones.

Las piezas deben conservar su orientación y comportamiento actuales.

### 4.4 Estados eléctricos

Representar visualmente tres estados:

**Sin energía:** conexiones en gris azulado.

**Con energía:** conexiones iluminadas en cian eléctrico.

**Fuente:** identificador amarillo.

Cuando una conexión reciba energía, mostrar un brillo moderado.

La iluminación debe corresponder exactamente al estado calculado por el algoritmo existente.

### 4.5 Animación de rotación

Agregar una transición visual suave al girar una pieza.

Duración sugerida: entre 150 y 250 milisegundos.

Requisitos:

- La animación no debe alterar la lógica.
- El estado visual debe coincidir con la orientación interna.
- Evitar saltos visuales.
- No bloquear permanentemente la interacción.
- Prevenir inconsistencias ante clics rápidos.

### 4.6 Efectos de propagación eléctrica

Incorporar un efecto visual discreto cuando una pieza pase de inactiva a energizada.

Puede utilizarse:

- Resplandor.
- Cambio progresivo de color.
- Transición de intensidad.

No utilizar animaciones excesivas ni bibliotecas adicionales.

Respetar la preferencia `prefers-reduced-motion`.

### 4.7 Pantalla de victoria

Sustituir o mejorar el mensaje actual mediante un modal visual integrado.

Debe mostrar:

- Icono de energía restaurada.
- Mensaje «¡Energía restaurada!».
- Número de movimientos realizados.
- Botón «Jugar nuevamente».

El modal debe:

- Aparecer únicamente al completar el nivel.
- Permitir reiniciar correctamente.
- Ser accesible mediante teclado.
- Mantener un contraste adecuado.
- No impedir que el usuario comprenda el resultado.

### 4.8 Controles

Rediseñar el botón de reinicio.

Incluir estados visuales para:

- Normal.
- Hover.
- Focus.
- Presionado.

No agregar controles innecesarios.

### 4.9 Instrucciones

Incluir una sección breve con las instrucciones:

«Haz clic en las piezas para girarlas 90°. Conecta la fuente de energía con el destino para restaurar el suministro eléctrico».

Agregar una pequeña leyenda visual para identificar los estados de energía.

## 5. Diseño responsive

La interfaz debe funcionar correctamente en:

- Escritorio: 1920 × 1080.
- Laptop: 1366 × 768.
- Tablet: 768 × 1024.
- Móvil: 390 × 844.

Requisitos:

- Sin desplazamiento horizontal.
- Tablero completo visible en el ancho disponible.
- Piezas suficientemente grandes para interacción táctil.
- Paneles reorganizados en pantallas pequeñas.
- Texto legible.
- Espaciado consistente.
- Modal adaptable.

En pantallas pequeñas se permite desplazamiento vertical cuando sea necesario.

Prioriza que el tablero sea cómodo de utilizar.

## 6. Accesibilidad y experiencia de usuario

Implementar mejoras básicas:

- Botones semánticos para las piezas interactivas, cuando sea apropiado.
- Navegación mediante teclado.
- Indicadores visibles de foco.
- Etiquetas accesibles para fuente, destino y piezas.
- Mensajes de estado comprensibles.
- Contraste suficiente.
- Compatibilidad con `prefers-reduced-motion`.

No depender exclusivamente del color para comunicar estados importantes.

## 7. Restricciones técnicas

Mantener:

- Python.
- Flask.
- HTML5.
- CSS3.
- JavaScript Vanilla.

No incorporar:

- React, Vue ni Angular.
- Tailwind o Bootstrap.
- Bases de datos.
- Autenticación.
- APIs externas.
- Nuevos niveles.
- Temporizadores.
- Sistemas avanzados de puntuación.
- Nuevas mecánicas de juego.

Priorizar CSS y SVG existentes para la presentación visual.

Mantener el proyecto sencillo, organizado y comprensible.

## 8. Validación funcional

Después del rediseño, comprobar:

1. Flask inicia correctamente.
2. El tablero mantiene sus 16 casillas.
3. Las piezas giran 90 grados.
4. Cada rotación válida incrementa el contador exactamente una vez.
5. La propagación eléctrica sigue funcionando.
6. Las conexiones incompatibles no transmiten energía.
7. El nivel sigue siendo resoluble.
8. La victoria se detecta correctamente.
9. El modal muestra los movimientos reales.
10. Reiniciar restaura el estado inicial.
11. Los clics rápidos no producen inconsistencias.
12. La interfaz es utilizable en las resoluciones solicitadas.
13. La navegación por teclado funciona.
14. Las animaciones reducidas se respetan.

Ejecuta las pruebas automatizadas disponibles y realiza las comprobaciones visuales que permita el entorno.

No declares superadas pruebas que no hayas ejecutado.

Si no puedes verificar visualmente una resolución, indícalo como pendiente de validación manual.

## 9. Evidencias para KODIGO

Esta iteración debe demostrar una mejora clara respecto a la primera versión.

Conserva las evidencias de la Iteración 01.

Organiza las nuevas capturas en una carpeta correspondiente a la Iteración 02, siguiendo la estructura documental existente.

Capturas sugeridas:

- Captura 05: interfaz rediseñada.
- Captura 06: circuito parcialmente energizado.
- Captura 07: modal de victoria.
- Captura 08: visualización responsive.

Si puedes generar capturas reales mediante las herramientas disponibles, hazlo.

Si no puedes, indica exactamente cuándo y dónde debo tomarlas manualmente.

No inventes evidencias.

## 10. Documentación de la iteración

Actualiza `docs/iteraciones.md` incorporando:

**Iteración 02 — Rediseño visual futurista y mejoras UX**

Documentar:

1. Objetivo de la iteración.
2. Referencia al Prompt 02.
3. Justificación de la mejora.
4. Estado visual anterior.
5. Cambios implementados.
6. Archivos modificados.
7. Pruebas ejecutadas.
8. Errores identificados y correcciones reales.
9. Comparación antes y después.
10. Limitaciones pendientes.

Actualiza el README únicamente cuando sea necesario.

Respecto a `info.md`:

- Conserva íntegramente el Prompt 01.
- No elimines ni sobrescribas información anterior.
- Incorpora el Prompt 02 en una sección claramente identificada.
- Mantén ambos prompts en orden cronológico.
- Si `info.md` tiene una estructura particular, respétala.

La documentación debe reflejar acciones realmente realizadas.

No redactes una reflexión personal ficticia en nombre del estudiante.

## 11. Forma de trabajo

Trabaja en cuatro fases:

**Fase A — Análisis:** inspeccionar el proyecto y detectar las áreas visuales que necesitan mejoras.

**Fase B — Implementación:** aplicar el rediseño conservando las mecánicas.

**Fase C — Validación:** ejecutar pruebas y corregir regresiones detectadas.

**Fase D — Documentación:** registrar cambios y evidencias verificables.

Al finalizar, entrega un resumen técnico breve con:

- Archivos modificados.
- Mejoras visuales implementadas.
- Pruebas ejecutadas y sus resultados.
- Errores corregidos.
- Evidencias disponibles.
- Aspectos pendientes de validación manual.

## 12. Restricciones finales

No reconstruyas CircuitRush desde cero.

No alteres el algoritmo eléctrico salvo que identifiques un defecto real y justifiques su corrección.

No realices commits ni pushes automáticamente.

No avances a la Iteración 03.

No introduzcas sobreingeniería.

**Comienza inspeccionando el proyecto existente y ejecuta únicamente la Iteración 02.**