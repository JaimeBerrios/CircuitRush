/* Direcciones en sentido horario: norte, este, sur, oeste. */
(function (root) {
  'use strict';
  const SIZE = 4;
  const PORTS = Object.freeze({ straight: [0, 2], corner: [0, 1], source: [1], target: [3] });
  const OFFSETS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const INITIAL = [
    ['source', 0], ['corner', 0], ['straight', 0], ['corner', 1],
    ['corner', 2], ['straight', 1], ['corner', 3], ['straight', 1],
    ['straight', 0], ['corner', 1], ['corner', 0], ['corner', 2],
    ['corner', 3], ['straight', 0], ['corner', 2], ['target', 0],
  ];

  // Rutas fijas, serpenteantes y reproducibles; no hay generación aleatoria.
  function extendedLevel(size) {
    const path = [0];
    for (let row = 0; row < size; row++) {
      const columns = Array.from({length: size - 1}, (_, i) => row % 2 ? size - 1 - i : i + 1);
      for (const col of columns) path.push(row * size + col);
    }
    const pieces = Array.from({length: size * size}, (_, i) => ['corner', i % 4]);
    const solution = [];
    const direction = (from, to) => to === from + 1 ? 1 : to === from - 1 ? 3 : to > from ? 2 : 0;
    path.forEach((index, i) => {
      if (i === 0) { pieces[index] = ['source', 0]; return; }
      if (i === path.length - 1) {
        pieces[index] = ['target', (direction(index, path[i - 1]) + 1) % 4]; return;
      }
      const ports = [direction(index, path[i - 1]), direction(index, path[i + 1])];
      const type = Math.abs(ports[0] - ports[1]) === 2 ? 'straight' : 'corner';
      const rotation = [0, 1, 2, 3].find(r => PORTS[type].map(d => (d + r) % 4).every(d => ports.includes(d)));
      pieces[index] = [type, (rotation + 1) % 4];
      solution.push([index, 3]);
    });
    return {pieces, solution};
  }
  const LEVELS = [
    {id: 1, name: 'Encendido', size: 4, seconds: 120, pieces: INITIAL, solution: [[1,2],[5,3],[9,3],[10,2],[14,2]]},
    {id: 2, name: 'Reconexión', size: 5, seconds: 180, ...extendedLevel(5)},
    {id: 3, name: 'Sobrecarga', size: 6, seconds: 240, ...extendedLevel(6)},
  ];
  function createGame(id = 1) {
    const level = LEVELS.find(level => level.id === id);
    if (!level) throw new TypeError('Nivel inválido');
    return { levelId: id, size: level.size, remaining: level.seconds, startedAt: null,
      lost: false, score: null, pieces: level.pieces.map(([type, rotation]) => ({ type, rotation })), moves: 0, won: false };
  }
  const score = (seconds, moves) => Math.max(0, 1000 + seconds * 10 - moves * 20);
  const STORAGE_KEY = 'circuitrush-v1';
  function readRecords(storage) {
    const clean = {unlocked: 1, best: {}};
    try {
      const data = JSON.parse(storage.getItem(STORAGE_KEY));
      if (!data || typeof data !== 'object') return clean;
      if (Number.isInteger(data.unlocked) && data.unlocked >= 1 && data.unlocked <= 3) clean.unlocked = data.unlocked;
      for (const level of LEVELS) {
        const mark = data.best?.[level.id];
        if (mark && Number.isSafeInteger(mark.score) && mark.score >= 0 && Number.isSafeInteger(mark.moves) && mark.moves > 0)
          clean.best[level.id] = {score: mark.score, moves: mark.moves};
      }
    } catch (_) { /* Almacenamiento ausente, corrupto o deshabilitado: seguir jugando. */ }
    return clean;
  }
  function saveWin(records, game, storage) {
    if (!game.won || game.score === null) return;
    const previous = records.best[game.levelId];
    records.best[game.levelId] = {score: Math.max(previous?.score ?? 0, game.score), moves: Math.min(previous?.moves ?? Infinity, game.moves)};
    records.unlocked = Math.max(records.unlocked, Math.min(3, game.levelId + 1));
    try { storage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch (_) { /* Marcas en memoria durante esta sesión. */ }
  }
  function createSession(options = {}) {
    const now = options.now || (() => performance.now());
    const schedule = options.setInterval || root.setInterval.bind(root);
    const cancel = options.clearInterval || root.clearInterval.bind(root);
    const storage = options.storage;
    const records = readRecords(storage);
    let game = createGame(), interval = null;
    const stop = () => { if (interval !== null) cancel(interval); interval = null; };
    const notify = () => { if (options.onChange) options.onChange(); };
    function tick() {
      if (game.startedAt === null || game.won || game.lost) return;
      game.remaining = Math.max(0, LEVELS[game.levelId - 1].seconds - Math.floor((now() - game.startedAt) / 1000));
      if (!game.remaining) { game.lost = true; stop(); }
      notify();
    }
    return {
      get game() { return game; }, records, tick,
      rotate(index) {
        tick();
        if (!rotate(game, index)) return false;
        if (game.startedAt === null) game.startedAt = now();
        if (game.won) { stop(); game.score = score(game.remaining, game.moves); saveWin(records, game, storage); }
        else if (interval === null) { interval = schedule(tick, 1000); interval?.unref?.(); }
        notify(); return true;
      },
      select(id) {
        if (!Number.isInteger(id) || id < 1 || id > records.unlocked) return false;
        stop(); game = createGame(id); notify(); return true;
      },
      restart() { stop(); game = createGame(game.levelId); notify(); },
      dispose: stop,
    };
  }

  function connections(piece) {
    if (!piece || !PORTS[piece.type] || !Number.isInteger(piece.rotation)) {
      throw new TypeError('Pieza de circuito inválida');
    }
    return PORTS[piece.type].map(direction => (direction + piece.rotation % 4 + 4) % 4);
  }

  function propagate(pieces) {
    const size = Math.sqrt(pieces?.length);
    if (!Array.isArray(pieces) || !Number.isInteger(size) || size < 4 || size > 6 ||
        pieces.filter(piece => piece.type === 'source').length !== 1 ||
        pieces.filter(piece => piece.type === 'target').length !== 1) {
      throw new TypeError('El tablero requiere un cuadrado de 4 a 6, una fuente y un destino');
    }
    const ports = pieces.map(connections);
    const source = pieces.findIndex(piece => piece.type === 'source');
    const energized = new Set([source]);
    const queue = [source];
    for (let head = 0; head < queue.length; head += 1) {
      const index = queue[head];
      const row = Math.floor(index / size);
      const column = index % size;
      for (const direction of ports[index]) {
        const [dr, dc] = OFFSETS[direction];
        const nextRow = row + dr;
        const nextColumn = column + dc;
        if (nextRow < 0 || nextRow >= size || nextColumn < 0 || nextColumn >= size) continue;
        const next = nextRow * size + nextColumn;
        // Ambos extremos deben coincidir; Set evita volver a recorrer ciclos.
        if (!energized.has(next) && ports[next].includes((direction + 2) % 4)) {
          energized.add(next);
          queue.push(next);
        }
      }
    }
    return { energized, won: [...energized].some(index => pieces[index].type === 'target') };
  }

  function rotate(game, index) {
    if (game.won || game.lost || !Number.isInteger(index) || index < 0 || index >= game.pieces.length) return false;
    const piece = game.pieces[index];
    if (piece.type === 'source' || piece.type === 'target') return false;
    // Mantener el total de giros permite animar siempre en sentido horario.
    piece.rotation += 1;
    game.moves += 1;
    game.won = propagate(game.pieces).won;
    return true;
  }

  function mount(document, options = {}) {
    let game;
    let session;
    const board = document.getElementById('board');
    const moves = document.getElementById('moves');
    const status = document.getElementById('status');
    const victory = document.getElementById('victory');
    const victoryDetail = document.getElementById('victory-detail');
    const playAgain = document.getElementById('play-again');
    const restartButton = document.getElementById('restart');
    const names = { source: 'Fuente fija', target: 'Destino fijo', straight: 'Recta', corner: 'Esquina' };
    const directions = ['arriba', 'derecha', 'abajo', 'izquierda'];
    let buttons = [];
    let shownResult = false;
    const optional = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };

    function render() {
      game = session.game;
      const size = game.size;
      const level = LEVELS[game.levelId - 1];
      const result = propagate(game.pieces);
      optional('timer', `${Math.floor(game.remaining / 60)}:${String(game.remaining % 60).padStart(2, '0')}`);
      optional('current-level', `${String(level.id).padStart(2, '0')} / ${level.name}`);
      optional('sector-label', `RED URBANA / SECTOR ${String(level.id).padStart(2, '0')}`);
      victory.classList.toggle('lost', game.lost);
      optional('level-number', String(level.id).padStart(2, '0'));
      optional('board-size', `${size} × ${size}`);
      board.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
      board.setAttribute('aria-label', `Circuito de ${size} filas y ${size} columnas`);
      const selector = document.getElementById('levels');
      if (selector) {
        LEVELS.forEach((item, index) => {
          const button = selector.children[index] || document.createElement('button');
          button.type = 'button'; button.className = 'level-option';
          button.disabled = item.id > session.records.unlocked;
          button.setAttribute('aria-pressed', String(item.id === game.levelId));
          const mark = session.records.best[item.id];
          button.textContent = `${String(item.id).padStart(2,'0')} — ${item.name} · ${button.disabled ? 'Bloqueado' : 'Disponible'} · Récord: ${mark?.score ?? '—'}`;
          if (!selector.children[index]) { button.addEventListener('click', () => load(item.id)); selector.appendChild(button); }
        });
      }
      moves.textContent = String(game.moves);
      status.textContent = game.lost ? 'Tiempo agotado' : game.won ? 'Restaurado' : result.energized.size > 1 ? 'Parcialmente conectado' : 'Desconectado';
      status.classList.toggle('partial', !game.won && result.energized.size > 1);
      status.classList.toggle('connected', game.won);
      victoryDetail.textContent = game.won ? `Nivel ${level.id} — ${level.name}. Restauraste el suministro en ${game.moves} movimientos. Tiempo restante: ${game.remaining} s. Puntuación: ${game.score}. Mejor récord: ${session.records.best[level.id]?.score}.` : `Nivel ${level.id} — ${level.name}. ${game.moves} movimientos realizados.`;
      optional('victory-title', game.lost ? 'Tiempo agotado' : '¡Energía restaurada!');
      optional('result-label', `NIVEL ${level.id} / ${level.name}`);
      playAgain.textContent = game.lost ? 'Reintentar' : '↻ Jugar nuevamente';
      const next = document.getElementById('next-level');
      if (next) next.hidden = !game.won || game.levelId === 3;
      game.pieces.forEach((piece, index) => {
        const button = buttons[index];
        const fixed = piece.type === 'source' || piece.type === 'target';
        button.disabled = fixed || game.won || game.lost;
        button.classList.toggle('energized', result.energized.has(index));
        button.querySelector('.wires').style.transform = `rotate(${piece.rotation * 90}deg)`;
        button.setAttribute('aria-label', `${names[piece.type]}, fila ${Math.floor(index / size) + 1}, columna ${index % size + 1}. Conexiones: ${connections(piece).map(d => directions[d]).join(', ')}. ${result.energized.has(index) ? 'Con energía' : 'Sin energía'}`);
      });
      // Abrir después de actualizar las piezas: el foco queda dentro del modal.
      if ((game.won || game.lost) && !shownResult) { shownResult = true; victory.showModal(); }
    }

    function build() {
      game.pieces.forEach((piece, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `tile ${piece.type}`;
        const arms = PORTS[piece.type].map(direction => `<span class="arm direction-${direction}"></span>`).join('');
        button.innerHTML = `<span class="wires" aria-hidden="true">${arms}<span class="joint"></span></span>${piece.type === 'source' ? '<span class="node-label" aria-hidden="true">⚡</span>' : piece.type === 'target' ? '<span class="node-label" aria-hidden="true">◎</span>' : ''}`;
        button.addEventListener('click', () => { session.rotate(index); });
        buttons.push(button);
        board.appendChild(button);
      });
    }
    function load(id) {
      if (!Number.isInteger(id) || id < 1 || id > session.records.unlocked) return false;
      if (victory.open) victory.close();
      shownResult = false;
      // Reutilizar botones al repetir para conservar el foco y evitar giros inversos.
      if (id !== session.game.levelId) { board.replaceChildren(); buttons = []; }
      session.select(id); game = session.game;
      if (!buttons.length) build();
      buttons.forEach(button => { button.querySelector('.wires').style.transition = 'none'; });
      render(); void board.offsetWidth;
      buttons.forEach(button => { button.querySelector('.wires').style.transition = ''; });
      buttons.find(button => !button.disabled)?.focus();
      return true;
    }
    function restart() { load(session.game.levelId); }
    restartButton.addEventListener('click', restart);
    playAgain.addEventListener('click', restart);
    const next = document.getElementById('next-level');
    if (next) next.addEventListener('click', () => load(game.levelId + 1));
    victory.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const last = next && !next.hidden ? next : playAgain;
      if (last === playAgain || (!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === playAgain)) {
        event.preventDefault(); (event.shiftKey ? last : playAgain).focus();
      }
    });
    victory.addEventListener('close', () => { if (game.won) restartButton.focus(); });
    let storage;
    try { storage = root.localStorage; } catch (_) { /* Navegación privada. */ }
    session = createSession({...options, storage: options.storage ?? storage, onChange: () => { if (buttons.length === session.game.pieces.length) render(); }});
    game = session.game; build(); render();
    document.addEventListener?.('visibilitychange', session.tick);
    return session;
  }

  const api = { LEVELS, createSession, score, readRecords, saveWin, SIZE, createGame, connections, propagate, rotate, mount };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    root.CircuitRush = api;
    try { mount(root.document); }
    catch (error) {
      root.document.getElementById('status').textContent = 'No se pudo iniciar el tablero. Recarga la página.';
      root.console.error(error);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
