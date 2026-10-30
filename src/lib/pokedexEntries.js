import { ENTRY_LANGUAGES } from './constants';

/**
 * Fuente única de verdad: orden, nombre y región de cada juego.
 * El orden de las regiones se deduce de la primera aparición en esta lista.
 */
export const GAME_VERSIONS = [
  { id: 'red', label: 'Rojo', region: 'Kanto' },
  { id: 'blue', label: 'Azul', region: 'Kanto' },
  { id: 'yellow', label: 'Amarillo', region: 'Kanto' },
  { id: 'gold', label: 'Oro', region: 'Johto' },
  { id: 'silver', label: 'Plata', region: 'Johto' },
  { id: 'crystal', label: 'Cristal', region: 'Johto' },
  { id: 'ruby', label: 'Rubí', region: 'Hoenn' },
  { id: 'sapphire', label: 'Zafiro', region: 'Hoenn' },
  { id: 'emerald', label: 'Esmeralda', region: 'Hoenn' },
  { id: 'firered', label: 'Rojo Fuego', region: 'Kanto' },
  { id: 'leafgreen', label: 'Verde Hoja', region: 'Kanto' },
  { id: 'diamond', label: 'Diamante', region: 'Sinnoh' },
  { id: 'pearl', label: 'Perla', region: 'Sinnoh' },
  { id: 'platinum', label: 'Platino', region: 'Sinnoh' },
  { id: 'heartgold', label: 'Oro HeartGold', region: 'Johto' },
  { id: 'soulsilver', label: 'Plata SoulSilver', region: 'Johto' },
  { id: 'black', label: 'Negro', region: 'Teselia' },
  { id: 'white', label: 'Blanco', region: 'Teselia' },
  { id: 'black-2', label: 'Negro 2', region: 'Teselia' },
  { id: 'white-2', label: 'Blanco 2', region: 'Teselia' },
  { id: 'x', label: 'X', region: 'Kalos' },
  { id: 'y', label: 'Y', region: 'Kalos' },
  { id: 'omega-ruby', label: 'Rubí Omega', region: 'Hoenn' },
  { id: 'alpha-sapphire', label: 'Zafiro Alfa', region: 'Hoenn' },
  { id: 'sun', label: 'Sol', region: 'Alola' },
  { id: 'moon', label: 'Luna', region: 'Alola' },
  { id: 'ultra-sun', label: 'Ultrasol', region: 'Alola' },
  { id: 'ultra-moon', label: 'Ultraluna', region: 'Alola' },
  { id: 'lets-go-pikachu', label: "Let's Go, Pikachu", region: 'Kanto' },
  { id: 'lets-go-eevee', label: "Let's Go, Eevee", region: 'Kanto' },
  { id: 'sword', label: 'Espada', region: 'Galar' },
  { id: 'shield', label: 'Escudo', region: 'Galar' },
  { id: 'brilliant-diamond', label: 'Diamante Brillante', region: 'Sinnoh' },
  { id: 'shining-pearl', label: 'Perla Reluciente', region: 'Sinnoh' },
  { id: 'legends-arceus', label: 'Leyendas: Arceus', region: 'Hisui' },
  { id: 'scarlet', label: 'Escarlata', region: 'Paldea' },
  { id: 'violet', label: 'Púrpura', region: 'Paldea' },
  { id: 'colosseum', label: 'Colosseum', region: 'Orre' },
  { id: 'xd', label: 'XD', region: 'Orre' },
];

const clean = (t) => t.replace(/\u00ad\n/g, '').replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Agrupa los flavor texts por región.
 * Solo existen entradas para los juegos donde el Pokémon tiene registro,
 * así que el filtrado "por juegos donde aparece" sale directamente de los datos.
 * Se prefiere español y se cae a inglés si no hay traducción (lang: 'en').
 */
export function groupEntriesByRegion(species) {
  const byVersion = new Map();

  for (const e of species.flavor_text_entries) {
    const lang = e.language.name;
    const rank = ENTRY_LANGUAGES.indexOf(lang);
    if (rank === -1) continue;
    const current = byVersion.get(e.version.name);
    if (!current || rank < current.rank) {
      byVersion.set(e.version.name, { rank, lang, text: clean(e.flavor_text) });
    }
  }

  const regions = [];
  for (const game of GAME_VERSIONS) {
    const entry = byVersion.get(game.id);
    if (!entry) continue;
    let group = regions.find((r) => r.region === game.region);
    if (!group) regions.push((group = { region: game.region, games: [] }));
    group.games.push({ id: game.id, label: game.label, lang: entry.lang, text: entry.text });
  }
  return regions;
}
