# Evidencias reales — Iteración 02

Capturas de Firefox headless contra Flask local, generadas el 2026-10-20. Las capturas 01–04 originales permanecen en `../../imagenes/`.

| Archivo | Estado y reproducción |
| --- | --- |
| `captura-05-interfaz-1920x1080.png` | Abrir la partida inicial con viewport 1920 × 1080. |
| `captura-05-interfaz-1366x768.png` | Partida inicial con viewport 1366 × 768; panel compacto para laptop. |
| `captura-05-interfaz-768x1024.png` | Partida inicial con viewport 768 × 1024. |
| `captura-06-energia-parcial.png` | Desde inicio, girar dos veces fila 1, columna 2; se utilizó Enter y Espacio en Firefox real. |
| `captura-07-victoria.png` | Seguir la secuencia del README: 12 movimientos, modal con botón enfocado. |
| `captura-08-movil-390x844.png` | Partida inicial capturada a 390 × 844; contenido inferior disponible mediante desplazamiento vertical. |

La automatización midió ausencia de desbordamiento horizontal y 16 casillas en los tres viewports de la captura 05. Para móvil se revisó la imagen real; Firefox Marionette no permitió una ventana menor de 500 px, por lo que se usó su modo de captura independiente. Los tamaños 06/07 corresponden a la ventana de escritorio usada para las pruebas de interacción y no se presentan como viewports móviles.

Pendiente manual: abrir http://127.0.0.1:5000 en un móvil/tablet físico y probar giros táctiles, desplazamiento, victoria y reinicio; repetir con lector de pantalla y otros navegadores. Si se amplían las evidencias, guardarlas aquí sin sobrescribir las capturas de la primera iteración.
