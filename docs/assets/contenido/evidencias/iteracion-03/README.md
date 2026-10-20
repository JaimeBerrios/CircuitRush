# Evidencias reales — Iteración 03

Generadas con Firefox headless local el 2026-10-20. No son imágenes ilustrativas.

| Archivo | Contenido y alcance |
| --- | --- |
| `captura-09-selector.png` | Inicio real: nivel 01 disponible y posteriores bloqueados. |
| `captura-10-nivel-02.png` | Tablero 5×5, desbloqueado tras victoria real del nivel 01. |
| `captura-11-nivel-03.png` | Tablero 6×6, desbloqueado tras victoria real del nivel 02. |
| `captura-12-temporizador.png` | Dos giros con teclado y reloj después de espera real. |
| `captura-13-victoria.png` | Victoria de 12 movimientos y 1960 puntos, récord y continuación. |
| `captura-14-derrota.png` | Modal y bloqueo tras vencer el reloj inyectado de prueba. |
| `captura-15-pruebas.png` | Captura del navegador mostrando la salida TAP real, formateada en HTML; no es una terminal. |
| `movil-nivel-01-390.png`, `movil-nivel-02-390.png`, `movil-nivel-03-390.png` | Capturas a 390×1200 de la plantilla actual, con fixture que desbloquea/selecciona el nivel para inspección visual. No prueban interacción táctil. |
| `pruebas-node.tap` | Salida original de las 19 pruebas Node: 19 aprobadas, 0 fallos. |
| `pruebas-node.html` | La misma salida escapada en HTML para capturarla de forma legible. |
| `pruebas-firefox.txt` | Mediciones DOM reales de los tres tamaños y confirmación de pruebas de navegador. |

## Reproducir

Ejecutar `node tests/game.test.cjs` desde la raíz. Para la prueba opcional real de navegador, iniciar Flask en 5001:

```bash
.venv/bin/python -m flask --app app run --host 127.0.0.1 --port 5001
```

En otra terminal, crear un perfil Firefox temporal con `user_pref("marionette.port", 2829);` y `user_pref("ui.prefersReducedMotion", 1);` en `user.js`; iniciar Firefox con `--headless --no-remote --profile RUTA --marionette about:blank`. Ejecutar `python3 tests/browser-smoke.py`. La variable `MARIONETTE_PORT` permite cambiar el puerto del protocolo. El script usa biblioteca estándar, un perfil exclusivo de pruebas y el origen local 5001; borra el almacenamiento de ese perfil/origen para comprobar la progresión desde cero y sobrescribe sus capturas.

Las capturas completas de escritorio se obtienen mediante Marionette. Las móviles usan `firefox --headless --screenshot RUTA --window-size 390,1200 URL_DE_FIXTURE`: HTML renderizado con Flask, recursos del servidor local y un listener DOMContentLoaded que establece desbloqueo 3 y pulsa el selector. La fixture no es una página de producción ni una funcionalidad incorporada al juego. Marionette no permitió bajar de 500 px en este entorno.

No hubo desbordamiento horizontal en mediciones a 1366, 768 y 500 px. A 390 px se realizó revisión visual. El reloj de derrota fue inyectado, mientras que el decremento normal se observó tras una espera real. Pendientes de obtener manualmente: interacción táctil en móvil físico, navegación con lector de pantalla, suspensión real de pestaña y compatibilidad fuera de Firefox.
