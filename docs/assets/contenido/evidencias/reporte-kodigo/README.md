# Validación del reporte académico KODIGO

## Entregable actualizado

`docs/pdf/reporte.pdf`: 28 páginas, con portada KODIGO Academy, seis páginas de contenido principal y 21 páginas de respaldo con los tres prompts completos. Autor confirmado: Jaime Fernando Berrios Ortiz, sin código. Se utiliza el logo proporcionado; no aparecen marcas ni referencias a otra institución en el PDF. La firma final dice únicamente «Jaime Berrios» en tipografía manuscrita, sin línea, duplicado en letra de imprenta ni rótulo.

El reporte contiene descripción, evidencia de vibecoding, iteración y mejora, validación y reflexión. Los prompts se transcribieron íntegros: se comprobó que las 661 líneas con contenido coinciden con los originales, aplicando solo escape de caracteres para LaTeX. Las rutas conservadas dentro de esas transcripciones forman parte de las instrucciones originales, no son citas añadidas al reporte.

## Resultados reales

- `node --test tests/game.test.cjs`: ejecución satisfactoria; el entorno resume 1 archivo aprobado, 0 fallidos y 0 omitidos. Registro: `kodigo-node-test.tap`.
- `node tests/game.test.cjs`: 19 pruebas aprobadas, 0 fallidas y 0 omitidas. Registro: `kodigo-node-detalle.tap`. Ambos comandos se ejecutaron nuevamente después de los ajustes documentales.
- Cliente Flask: HTTP 200 para página, CSS y JavaScript, verificado nuevamente durante la revisión contra la rúbrica en `kodigo-flask.txt`. No acredita una nueva interacción visual del juego.
- `python3 compilar.py --verificar`: aprobado, en modo reporte.
- `python3 compilar.py`: PDF generado mediante el sistema existente y Tectonic; no se generan presentaciones.
- Inspección con pdfinfo y pdftotext: metadatos con el nombre completo, cinco secciones, resultados coherentes y ausencia de la identidad institucional retirada, códigos de estudiante o campos pendientes en la portada.
- Revisión visual de las 28 páginas mediante pdftoppm y hojas de contacto, más inspección ampliada de portada y firma: imágenes proporcionadas, tablero completo, tablas dentro de márgenes, prompts legibles y ninguna página vacía.
- Compilación final sin desbordamientos, referencias indefinidas ni caracteres faltantes. Permanece el aviso de perfil ICC 4.4 de una captura, no incorporado al PDF 1.5; no se observaron defectos visuales.

## Ajustes documentales y de compilación

Se sustituyeron portada e identidad visual por KODIGO y se simplificó la firma. La verificación inicial falló porque exigía tres logos retirados por el usuario: se cambió únicamente esa lista de recursos para verificar el logo KODIGO proporcionado, manteniendo la fuente de firma y el resto del motor. No se reconstruyó ni refactorizó el compilador.

La selección automática de una fuente variable Noto Sans Mono produjo `Invalid font` al generar el PDF. Se corrigió usando la versión estática ya instalada, incorporada como recurso local junto con su licencia; no se instalaron paquetes. La repetición generó el PDF correctamente.

Se preservaron las capturas originales. Los recortes para mostrar el MVP, el rediseño, el nivel 02 y la victoria están definidos solo en LaTeX. No se modificaron funcionalidades del juego.

La reflexión mantiene una nota de revisión personal porque el estudiante aún no ha confirmado sus afirmaciones concretas de aprendizaje y comprensión. Las limitaciones de interacción táctil física, lector de pantalla y otros navegadores siguen descritas con su alcance real. No se agregan referencias externas artificiales, commits ni pushes.


## Revisión contra la consigna de Semana 2

La comprobación detallada se encuentra en `revision-rubrica.md`. Se revisaron el PDF compilado, el README, el código, las pruebas, los prompts y las capturas conservadas. La firma corta se volvió a compilar y se inspeccionaron la portada y la última página. El nombre completo se conserva en la portada y los metadatos del PDF; la firma final dice solo Jaime Berrios.
