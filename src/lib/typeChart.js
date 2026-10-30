import { TYPE_INFO } from './constants';

/**
 * Calcula multiplicadores de daño recibido combinando los tipos del Pokémon.
 * @param {object[]} typeDataList respuestas de /type/{name}
 */
export function computeMatchups(typeDataList) {
  const mult = Object.fromEntries(Object.keys(TYPE_INFO).map((t) => [t, 1]));
  const apply = (list, factor) =>
    list.forEach(({ name }) => {
      if (name in mult) mult[name] *= factor;
    });

  for (const { damage_relations: r } of typeDataList) {
    apply(r.double_damage_from, 2);
    apply(r.half_damage_from, 0.5);
    apply(r.no_damage_from, 0);
  }

  const group = (m) => ({
    multiplier: m,
    types: Object.keys(mult).filter((t) => mult[t] === m),
  });

  return {
    weaknesses: [group(4), group(2)],
    resistances: [group(0.5), group(0.25)],
    immunities: [group(0)],
  };
}
