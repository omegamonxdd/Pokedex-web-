import { TYPE_INFO } from './constants';
import { formatName, idFromUrl } from './formatters';

/** Convierte la cadena de PokeAPI en un árbol { id, name, details, children }. */
export function buildEvolutionTree(link) {
  return {
    id: idFromUrl(link.species.url),
    name: link.species.name,
    details: link.evolution_details ?? [],
    children: link.evolves_to.map(buildEvolutionTree),
  };
}

/** Recoge objetos y movimientos que conviene traducir. */
export function collectRefs(node, acc = { item: new Set(), move: new Set() }) {
  for (const d of node.details) {
    if (d.item) acc.item.add(d.item.name);
    if (d.held_item) acc.item.add(d.held_item.name);
    if (d.known_move) acc.move.add(d.known_move.name);
  }
  node.children.forEach((c) => collectRefs(c, acc));
  return acc;
}

const SPECIAL_TRIGGERS = {
  shed: 'Nivel 20 con un hueco libre en el equipo y una Poké Ball',
  spin: 'Girar sobre sí mismo sosteniendo un dulce',
  'tower-of-darkness': 'Entrenar en la Torre Oscura',
  'tower-of-waters': 'Entrenar en la Torre de Agua',
  'three-critical-hits': 'Asestar 3 golpes críticos en un mismo combate',
  'take-damage': 'Recibir daño y llegar a un lugar concreto',
};

const TIME_OF_DAY = { day: 'de día', night: 'de noche', dusk: 'al atardecer' };
const STATS_CMP = { 1: 'con Ataque > Defensa', '-1': 'con Ataque < Defensa', 0: 'con Ataque = Defensa' };

/** Describe UN método de evolución en español. */
function describeOne(d, L) {
  const item = (r) => L.item[r.name] ?? formatName(r.name);
  const trigger = d.trigger?.name;
  let base;

  if (trigger === 'use-item') base = d.item ? `Usar ${item(d.item)}` : 'Usar un objeto';
  else if (trigger === 'trade') base = 'Intercambio';
  else if (SPECIAL_TRIGGERS[trigger]) base = SPECIAL_TRIGGERS[trigger];
  else base = d.min_level ? `Subir al nivel ${d.min_level}` : 'Subir de nivel';

  const c = [];
  if (d.min_happiness) c.push('con amistad alta');
  if (d.min_affinity) c.push('con gran afecto');
  if (d.min_beauty) c.push('con belleza alta');
  if (d.time_of_day) c.push(TIME_OF_DAY[d.time_of_day] ?? d.time_of_day);
  if (d.known_move) c.push(`conociendo ${L.move[d.known_move.name] ?? formatName(d.known_move.name)}`);
  if (d.known_move_type) c.push(`conociendo un movimiento tipo ${TYPE_INFO[d.known_move_type.name]?.label ?? formatName(d.known_move_type.name)}`);
  if (d.location) c.push(`en ${formatName(d.location.name)}`);
  if (d.held_item) c.push(`sosteniendo ${item(d.held_item)}`);
  if (d.gender) c.push(d.gender === 1 ? 'solo hembras' : 'solo machos');
  if (d.relative_physical_stats !== null && d.relative_physical_stats !== undefined) c.push(STATS_CMP[d.relative_physical_stats]);
  if (d.party_species) c.push(`con ${formatName(d.party_species.name)} en el equipo`);
  if (d.party_type) c.push(`con un Pokémon tipo ${TYPE_INFO[d.party_type.name]?.label ?? formatName(d.party_type.name)} en el equipo`);
  if (d.trade_species) c.push(`por ${formatName(d.trade_species.name)}`);
  if (d.needs_overworld_rain) c.push('mientras llueve');
  if (d.turn_upside_down) c.push('con la consola boca abajo');

  return c.length ? `${base} ${c.join(', ')}` : base;
}

/** Devuelve la lista (sin duplicados) de métodos para llegar a un nodo. */
export function describeEvolution(details, labels) {
  return [...new Set(details.map((d) => describeOne(d, labels)))];
}

/** Añade `methods: string[]` a cada nodo del árbol. */
export function attachMethods(node, labels) {
  return {
    ...node,
    methods: describeEvolution(node.details, labels),
    children: node.children.map((c) => attachMethods(c, labels)),
  };
}
