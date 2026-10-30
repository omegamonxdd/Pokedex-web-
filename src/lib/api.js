import { API_BASE, GENERATIONS, GENUS_LANGUAGE } from './constants';
import { formatName, idFromUrl } from './formatters';
import { computeMatchups } from './typeChart';
import { attachMethods, buildEvolutionTree, collectRefs } from './evolution';
import { groupEntriesByRegion } from './pokedexEntries';

/**
 * Error tipado. `type`:
 *  - 'network'   -> sin internet / fetch falló
 *  - 'not-found' -> 404
 *  - 'http'      -> otro código de error
 */
export class ApiError extends Error {
  constructor(message, { type = 'http', status } = {}) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
  }
}

// Caché en memoria: evita repetir peticiones y deduplica las simultáneas.
const cache = new Map();

export function fetchJson(url) {
  if (cache.has(url)) return cache.get(url);

  const request = (async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new ApiError('Sin conexión', { type: 'network' });
    }
    let res;
    try {
      res = await fetch(url);
    } catch {
      // fetch solo rechaza por fallos de red (DNS, offline, CORS...)
      throw new ApiError('Fallo de red', { type: 'network' });
    }
    if (res.status === 404) throw new ApiError('No encontrado', { type: 'not-found', status: 404 });
    if (!res.ok) throw new ApiError(`Error ${res.status}`, { type: 'http', status: res.status });
    return res.json();
  })();

  cache.set(url, request);
  // Si falla no se cachea, para poder reintentar.
  request.catch(() => cache.delete(url));
  return request;
}

/** Nombre en español de un recurso (ability, item, move); cae al slug formateado. */
async function getLocalizedName(kind, name) {
  try {
    const data = await fetchJson(`${API_BASE}/${kind}/${name}`);
    return data.names.find((n) => n.language.name === 'es')?.name ?? formatName(name);
  } catch {
    return formatName(name);
  }
}

/** Índice ligero de todos los Pokémon (id + nombre) para listado y búsqueda. */
export async function getPokemonIndex() {
  const data = await fetchJson(`${API_BASE}/pokemon?limit=100000&offset=0`);
  return data.results
    .map((p) => ({ id: idFromUrl(p.url), name: p.name }))
    .filter((p) => p.id < 10000); // descarta formas alternativas (id > 10000)
}

async function buildEvolution(chain) {
  const tree = buildEvolutionTree(chain);
  const refs = collectRefs(tree);
  const labels = { item: {}, move: {} };
  await Promise.all([
    ...[...refs.item].map(async (n) => (labels.item[n] = await getLocalizedName('item', n))),
    ...[...refs.move].map(async (n) => (labels.move[n] = await getLocalizedName('move', n))),
  ]);
  return attachMethods(tree, labels);
}

/** Detalle completo de un Pokémon, ya normalizado para la UI. */
export async function getPokemonDetail(idOrName) {
  const pokemon = await fetchJson(`${API_BASE}/pokemon/${idOrName}`);
  const species = await fetchJson(pokemon.species.url);

  const [chainData, typeData, abilities] = await Promise.all([
    species.evolution_chain ? fetchJson(species.evolution_chain.url) : null,
    Promise.all(pokemon.types.map((t) => fetchJson(t.type.url))),
    Promise.all(
      pokemon.abilities.map(async (a) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
        label: await getLocalizedName('ability', a.ability.name),
      })),
    ),
  ]);

  const evolution = chainData ? await buildEvolution(chainData.chain) : null;
  const gen = GENERATIONS[species.generation.name] ?? { region: 'Desconocida', numeral: '?' };

  return {
    id: pokemon.id,
    name: pokemon.name,
    genus: species.genera.find((g) => g.language.name === GENUS_LANGUAGE)?.name ?? '—',
    region: gen.region,
    generation: gen.numeral,
    types: pokemon.types.map((t) => t.type.name),
    abilities: abilities.sort((a, b) => Number(a.isHidden) - Number(b.isHidden)),
    stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    evolution,
    matchups: computeMatchups(typeData),
    entries: groupEntriesByRegion(species),
  };
}
