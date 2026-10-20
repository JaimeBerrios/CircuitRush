const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createGame, connections, propagate, rotate, mount } = require('../static/js/game.js');
const solution = [[1, 2], [5, 3], [9, 3], [10, 2], [14, 2]];
function solve(game) { for (const [index, turns] of solution) for (let i = 0; i < turns; i++) assert.equal(rotate(game, index), true); }

test('02: tablero reproducible de 16 piezas, inicialmente sin resolver', () => {
  assert.equal(createGame().pieces.length, 16);
  assert.deepEqual(createGame(), createGame());
  assert.equal(propagate(createGame().pieces).won, false);
});
test('03 y 04: giro horario de 90 grados y un único movimiento', () => {
  const game = createGame(); const before = connections(game.pieces[1]);
  assert.equal(rotate(game, 1), true);
  assert.deepEqual(connections(game.pieces[1]), before.map(d => (d + 1) % 4));
  assert.equal(game.moves, 1);
  for (const index of [0, 15, -1, 16, 1.5]) assert.equal(rotate(game, index), false);
  assert.equal(game.moves, 1);
});
test('05 y 06: solo una conexión recíproca desde la fuente transmite energía', () => {
  const game = createGame();
  assert.deepEqual([...propagate(game.pieces).energized], [0]);
  rotate(game, 1); rotate(game, 1);
  assert.deepEqual([...propagate(game.pieces).energized], [0, 1]);
  for (let i = 0; i < 3; i++) rotate(game, 5);
  assert.ok(propagate(game.pieces).energized.has(5));
  assert.ok(!propagate(game.pieces).energized.has(2));
});
test('07: termina ante un circuito cerrado y no energiza ciclos aislados', { timeout: 1000 }, () => {
  const game = createGame();
  // Ciclo cuadrado 5 → 6 → 10 → 9 → 5, aislado de la fuente.
  for (const [index, rotation] of [[5, 1], [6, 2], [10, 3], [9, 0]]) game.pieces[index] = { type: 'corner', rotation };
  assert.deepEqual([...propagate(game.pieces).energized], [0]);
  // Camino recíproco: la arista hacia el nodo anterior no lo vuelve a visitar.
  rotate(game, 1); rotate(game, 1);
  game.pieces[5] = { type: 'straight', rotation: 0 };
  const result = propagate(game.pieces);
  assert.ok(result.energized.has(5));
  assert.ok(result.energized.size <= 16);
});
test('08: solución de 12 movimientos y bloqueo después de ganar', () => {
  const game = createGame(); solve(game);
  assert.equal(game.won, true); assert.equal(game.moves, 12);
  assert.ok(propagate(game.pieces).energized.has(15));
  assert.equal(rotate(game, 2), false); assert.equal(game.moves, 12);
});
test('09 y 10: montaje, mensaje de victoria y reinicio mediante DOM simulado', () => {
  class Element {
    constructor() { this.children = []; this.events = {}; this.style = {}; this.attributes = {}; this.classList = { toggle() {} }; this.wires = { style: {} }; }
    appendChild(child) { this.children.push(child); }
    addEventListener(type, action) { this.events[type] = action; }
    querySelector() { return this.wires; }
    setAttribute(key, value) { this.attributes[key] = value; }
    click() { if (!this.disabled) this.events.click(); }
  }
  const ids = Object.fromEntries(['board', 'moves', 'status', 'victory', 'restart'].map(id => [id, new Element()]));
  mount({ getElementById: id => ids[id], createElement: () => new Element() });
  assert.equal(ids.board.children.length, 16);
  const initial = ids.board.children.map(b => b.wires.style.transform);
  for (const [index, turns] of solution) for (let i = 0; i < turns; i++) ids.board.children[index].click();
  assert.equal(ids.victory.hidden, false); assert.match(ids.victory.textContent, /12 movimientos/);
  assert.ok(ids.board.children.every(b => b.disabled));
  ids.restart.click();
  assert.equal(ids.moves.textContent, '0'); assert.equal(ids.victory.hidden, true);
  assert.equal(ids.status.textContent, 'Destino sin energía');
  assert.deepEqual(ids.board.children.map(b => b.wires.style.transform), initial);
  assert.equal(ids.board.children[1].disabled, false);
});
test('rechaza tableros o piezas inválidos', () => {
  assert.throws(() => propagate([]), TypeError);
  assert.throws(() => connections({ type: 'unknown', rotation: 0 }), TypeError);
});
