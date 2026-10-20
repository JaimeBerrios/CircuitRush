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

  function createGame() {
    return { pieces: INITIAL.map(([type, rotation]) => ({ type, rotation })), moves: 0, won: false };
  }

  function connections(piece) {
    if (!piece || !PORTS[piece.type] || !Number.isInteger(piece.rotation)) {
      throw new TypeError('Pieza de circuito inválida');
    }
    return PORTS[piece.type].map(direction => (direction + piece.rotation % 4 + 4) % 4);
  }

  function propagate(pieces) {
    if (!Array.isArray(pieces) || pieces.length !== SIZE * SIZE ||
        pieces.filter(piece => piece.type === 'source').length !== 1 ||
        pieces.filter(piece => piece.type === 'target').length !== 1) {
      throw new TypeError('El tablero requiere 16 piezas, una fuente y un destino');
    }
    const ports = pieces.map(connections);
    const source = pieces.findIndex(piece => piece.type === 'source');
    const energized = new Set([source]);
    const queue = [source];
    for (let head = 0; head < queue.length; head += 1) {
      const index = queue[head];
      const row = Math.floor(index / SIZE);
      const column = index % SIZE;
      for (const direction of ports[index]) {
        const [dr, dc] = OFFSETS[direction];
        const nextRow = row + dr;
        const nextColumn = column + dc;
        if (nextRow < 0 || nextRow >= SIZE || nextColumn < 0 || nextColumn >= SIZE) continue;
        const next = nextRow * SIZE + nextColumn;
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
    if (game.won || !Number.isInteger(index) || index < 0 || index >= game.pieces.length) return false;
    const piece = game.pieces[index];
    if (piece.type === 'source' || piece.type === 'target') return false;
    // Mantener el total de giros permite animar siempre en sentido horario.
    piece.rotation += 1;
    game.moves += 1;
    game.won = propagate(game.pieces).won;
    return true;
  }

  function mount(document) {
    let game = createGame();
    const board = document.getElementById('board');
    const moves = document.getElementById('moves');
    const status = document.getElementById('status');
    const victory = document.getElementById('victory');
    const victoryDetail = document.getElementById('victory-detail');
    const playAgain = document.getElementById('play-again');
    const restartButton = document.getElementById('restart');
    const names = { source: 'Fuente fija', target: 'Destino fijo', straight: 'Recta', corner: 'Esquina' };
    const directions = ['arriba', 'derecha', 'abajo', 'izquierda'];
    const buttons = [];

    function render() {
      const result = propagate(game.pieces);
      game.won = result.won;
      moves.textContent = String(game.moves);
      status.textContent = game.won ? 'Restaurado' : result.energized.size > 1 ? 'Parcialmente conectado' : 'Desconectado';
      status.classList.toggle('partial', !game.won && result.energized.size > 1);
      status.classList.toggle('connected', game.won);
      victoryDetail.textContent = game.won ? `Restauraste el suministro en ${game.moves} movimientos.` : '';
      game.pieces.forEach((piece, index) => {
        const button = buttons[index];
        const fixed = piece.type === 'source' || piece.type === 'target';
        button.disabled = fixed || game.won;
        button.classList.toggle('energized', result.energized.has(index));
        button.querySelector('.wires').style.transform = `rotate(${piece.rotation * 90}deg)`;
        button.setAttribute('aria-label', `${names[piece.type]}, fila ${Math.floor(index / SIZE) + 1}, columna ${index % SIZE + 1}. Conexiones: ${connections(piece).map(d => directions[d]).join(', ')}. ${result.energized.has(index) ? 'Con energía' : 'Sin energía'}`);
      });
      // Abrir después de actualizar las piezas: el foco queda dentro del modal.
      if (game.won && !victory.open) victory.showModal();
    }

    game.pieces.forEach((piece, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tile ${piece.type}`;
      const arms = PORTS[piece.type].map(direction => `<span class="arm direction-${direction}"></span>`).join('');
      button.innerHTML = `<span class="wires" aria-hidden="true">${arms}<span class="joint"></span></span>${piece.type === 'source' ? '<span class="node-label" aria-hidden="true">⚡</span>' : piece.type === 'target' ? '<span class="node-label" aria-hidden="true">◎</span>' : ''}`;
      button.addEventListener('click', () => { if (rotate(game, index)) render(); });
      buttons.push(button);
      board.appendChild(button);
    });
    function restart() {
      if (victory.open) victory.close();
      // Evitar un giro inverso animado al volver a las orientaciones iniciales.
      buttons.forEach(button => { button.querySelector('.wires').style.transition = 'none'; });
      game = createGame();
      render();
      void board.offsetWidth; // Aplicar las orientaciones antes de recuperar la transición.
      buttons.forEach(button => { button.querySelector('.wires').style.transition = ''; });
      buttons[1].focus();
    }
    restartButton.addEventListener('click', restart);
    playAgain.addEventListener('click', restart);
    victory.addEventListener('keydown', event => {
      if (event.key === 'Tab') { event.preventDefault(); playAgain.focus(); }
    });
    victory.addEventListener('close', () => { if (game.won) restartButton.focus(); });
    render();
  }

  const api = { SIZE, createGame, connections, propagate, rotate, mount };
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
