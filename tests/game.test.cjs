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
    focus() { this.focused = true; }
    showModal() { this.open = true; }
    close() { this.open = false; if (this.events.close) this.events.close(); }
    click() { if (!this.disabled) this.events.click(); }
  }
  const ids = Object.fromEntries(['board', 'moves', 'status', 'victory', 'restart', 'victory-detail', 'play-again'].map(id => [id, new Element()]));
  mount({ getElementById: id => ids[id], createElement: () => new Element() });
  assert.equal(ids.board.children.length, 16);
  const initial = ids.board.children.map(b => b.wires.style.transform);
  assert.equal(ids.status.textContent, 'Desconectado');
  // Clics consecutivos sin esperas: conserva todos los giros y su orientación.
  for (let i = 0; i < 40; i++) ids.board.children[2].click();
  assert.equal(ids.moves.textContent, '40');
  assert.equal(ids.board.children[2].wires.style.transform, 'rotate(3600deg)');
  ids.restart.click();
  ids.board.children[1].click(); ids.board.children[1].click();
  assert.equal(ids.status.textContent, 'Parcialmente conectado');
  ids.restart.click();
  for (const [index, turns] of solution) for (let i = 0; i < turns; i++) ids.board.children[index].click();
  assert.equal(ids.victory.open, true); assert.match(ids['victory-detail'].textContent, /12 movimientos/);
  assert.equal(ids.status.textContent, 'Restaurado');
  assert.ok(ids.board.children.every(b => b.disabled));
  ids['play-again'].click();
  assert.equal(ids.moves.textContent, '0'); assert.equal(ids.victory.open, false);
  assert.equal(ids.status.textContent, 'Desconectado');
  assert.deepEqual(ids.board.children.map(b => b.wires.style.transform), initial);
  assert.equal(ids.board.children[1].disabled, false);
  assert.equal(ids.board.children[1].focused, true);
  for (const [index, turns] of solution) for (let i = 0; i < turns; i++) ids.board.children[index].click();
  ids.victory.close();
  assert.equal(ids.restart.focused, true);
  assert.ok(ids.board.children.every(b => b.disabled));
  ids.restart.click();
  assert.equal(ids.moves.textContent, '0');
});
test('rechaza tableros o piezas inválidos', () => {
  assert.throws(() => propagate([]), TypeError);
  assert.throws(() => connections({ type: 'unknown', rotation: 0 }), TypeError);
});

const { LEVELS, createSession, score, readRecords, saveWin } = require('../static/js/game.js');
function memoryStorage() {
  let value = null;
  return {getItem: () => value, setItem: (_, next) => { value = next; }};
}
function clockSession(storage = memoryStorage()) {
  let time = 0, serial = 0;
  const jobs = new Map();
  const session = createSession({storage, now: () => time,
    setInterval: fn => { jobs.set(++serial, fn); return serial; }, clearInterval: id => jobs.delete(id)});
  return {session, jobs, advance(ms) { time += ms; for (const fn of [...jobs.values()]) fn(); }};
}
function complete(session) {
  for (const [index, turns] of LEVELS[session.game.levelId - 1].solution)
    for (let i = 0; i < turns && !session.game.won; i++) session.rotate(index);
  assert.equal(session.game.won, true);
}
for (const level of LEVELS) {
  test(`nivel ${level.id}: ${level.size ** 2} piezas, sin resolver y solución mediante giros válidos`, () => {
    const game = createGame(level.id);
    assert.equal(game.pieces.length, level.size ** 2);
    assert.equal(propagate(game.pieces).won, false);
    for (const [index, turns] of level.solution) {
      assert.ok(index >= 0 && index < game.pieces.length);
      for (let i = 0; i < turns && !game.won; i++) assert.equal(rotate(game, index), true);
    }
    assert.equal(game.won, true);
    assert.deepEqual(createGame(level.id), createGame(level.id));
  });
}
test('reloj inactivo antes del primer giro válido, decremento real y un solo intervalo', () => {
  const {session, jobs, advance} = clockSession();
  advance(5000); assert.equal(session.game.remaining, 120); assert.equal(jobs.size, 0);
  session.rotate(0); assert.equal(jobs.size, 0);
  session.rotate(1); session.rotate(2); assert.equal(jobs.size, 1);
  advance(3100); assert.equal(session.game.remaining, 117);
  advance(1200); assert.equal(session.game.remaining, 116);
  session.restart(); assert.equal(jobs.size, 0); assert.equal(session.game.remaining, 120);
  advance(10000); assert.equal(session.game.remaining, 120);
});
test('ganar detiene el reloj, calcula puntos una sola vez y desbloquea', () => {
  const {session, jobs, advance} = clockSession();
  session.rotate(2); advance(2200); complete(session);
  assert.equal(jobs.size, 0); assert.equal(session.game.remaining, 118);
  assert.equal(session.game.score, score(118, session.game.moves));
  const points = session.game.score;
  assert.equal(session.rotate(1), false); advance(5000);
  assert.equal(session.game.score, points); assert.equal(session.game.remaining, 118);
  assert.equal(session.records.unlocked, 2);
  assert.equal(session.select(2), true); assert.equal(session.game.remaining, 180);
});
test('agotamiento detiene reloj, bloquea giros y no concede puntos', () => {
  const {session, jobs, advance} = clockSession();
  session.rotate(1); advance(121000);
  assert.equal(session.game.lost, true); assert.equal(session.game.remaining, 0); assert.equal(jobs.size, 0);
  assert.equal(session.rotate(1), false); assert.equal(session.game.moves, 1); assert.equal(session.game.score, null);
  assert.deepEqual(session.records.best, {});
  session.restart(); assert.equal(session.game.lost, false); assert.equal(session.game.remaining, 120);
});
test('un giro tras una pestaña suspendida comprueba el vencimiento antes de mover', () => {
  let time = 0;
  const session = createSession({now: () => time, setInterval: () => 1, clearInterval() {}});
  session.rotate(1); time = 120000;
  assert.equal(session.rotate(1), false); assert.equal(session.game.moves, 1); assert.equal(session.game.lost, true);
});
test('cambiar nivel cancela el intervalo y los niveles bloqueados no se seleccionan', () => {
  const {session, jobs} = clockSession();
  for (const id of [2,3,0,4,1.5,'1',NaN]) assert.equal(session.select(id), false);
  complete(session); session.restart(); session.rotate(1); assert.equal(jobs.size, 1);
  assert.equal(session.select(2), true); assert.equal(jobs.size, 0); assert.equal(session.game.startedAt, null);
  assert.equal(session.select(3), false);
  complete(session); assert.equal(session.records.unlocked, 3); assert.equal(session.select(3), true);
});
test('fórmula explicable, cero mínimo', () => {
  assert.equal(score(100, 12), 1760); assert.equal(score(0, 1000), 0);
});
test('récords independientes solo mejoran y persisten al recargar', () => {
  const storage = memoryStorage(), records = readRecords(storage);
  saveWin(records, {won: true, score: 1500, moves: 20, levelId: 1}, storage);
  saveWin(records, {won: true, score: 1400, moves: 25, levelId: 1}, storage);
  assert.deepEqual(records.best[1], {score:1500,moves:20});
  saveWin(records, {won: true, score: 1600, moves: 22, levelId: 1}, storage);
  saveWin(records, {won: true, score: 1300, moves: 18, levelId: 1}, storage);
  assert.deepEqual(records.best[1], {score:1600,moves:18});
  assert.deepEqual(createSession({storage}).records, records);
});
test('datos corruptos, inválidos y almacenamiento rechazado no impiden jugar', () => {
  for (const value of [null,'{','null','[]','{"unlocked":99,"best":{"1":{"score":-1,"moves":0}}}', '{"unlocked":"3"}']) {
    assert.deepEqual(readRecords({getItem: () => value}), {unlocked:1,best:{}});
  }
  const storage = {getItem() { throw Error('denegado'); }, setItem() { throw Error('cuota'); }};
  const {session} = clockSession(storage); complete(session); assert.equal(session.records.unlocked, 2);
});

test('DOM: tamaños dinámicos, selector protegido, derrota única, reintento y foco del selector estable', () => {
  class Element {
    constructor() { this.children=[]; this.events={}; this.style={}; this.attributes={}; this.classList={toggle(){}}; this.wires={style:{}}; this.opens=0; }
    appendChild(child) { this.children.push(child); }
    replaceChildren() { this.children=[]; }
    addEventListener(type, action) { this.events[type]=action; }
    querySelector() { return this.wires; }
    setAttribute(key, value) { this.attributes[key]=value; }
    focus() {}
    showModal() { this.open=true; this.opens++; }
    close() { this.open=false; this.events.close?.(); }
    click() { if (!this.disabled) this.events.click?.(); }
  }
  const ids=Object.fromEntries(['board','moves','status','victory','restart','victory-detail','play-again','levels','timer','next-level','victory-title'].map(id=>[id,new Element()]));
  let time=0;
  const session=mount({getElementById:id=>ids[id],createElement:()=>new Element()}, {now:()=>time,setInterval:()=>1,clearInterval(){},storage:memoryStorage()});
  ids.levels.children[1].click(); assert.equal(session.game.levelId,1);
  for(const [index,turns] of solution) for(let i=0;i<turns;i++) ids.board.children[index].click();
  assert.equal(ids.victory.opens,1); session.tick(); assert.equal(ids.victory.opens,1);
  ids['next-level'].click(); assert.equal(ids.board.children.length,25);
  assert.equal(ids.board.style.gridTemplateColumns,'repeat(5, minmax(0, 1fr))');
  const selectorButton=ids.levels.children[1];
  ids.board.children[1].click(); time=181000; session.tick();
  assert.equal(ids.levels.children[1],selectorButton);
  assert.equal(ids.victory.opens,2); assert.equal(ids['victory-title'].textContent,'Tiempo agotado');
  assert.ok(ids.board.children.every(button=>button.disabled));
  session.tick(); assert.equal(ids.victory.opens,2);
  ids['play-again'].click(); assert.equal(ids.timer.textContent,'3:00'); assert.equal(session.game.lost,false);
  complete(session); ids['next-level'].click(); assert.equal(ids.board.children.length,36);
});
