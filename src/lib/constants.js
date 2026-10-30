export const API_BASE = 'https://pokeapi.co/api/v2';
export const PAGE_SIZE = 24;

// Idioma de la "especie" (genus). Cambia a 'es' si lo prefieres en español.
export const GENUS_LANGUAGE = 'es';
// Idiomas para los textos de Pokédex, por orden de preferencia.
export const ENTRY_LANGUAGES = ['en', 'es'];

// Etiqueta en español y color de cada tipo elemental.
export const TYPE_INFO = {
  normal:   { label: 'Normal',    color: '#A8A77A' },
  fire:     { label: 'Fuego',     color: '#EE8130' },
  water:    { label: 'Agua',      color: '#6390F0' },
  electric: { label: 'Eléctrico', color: '#F7D02C' },
  grass:    { label: 'Planta',    color: '#7AC74C' },
  ice:      { label: 'Hielo',     color: '#96D9D6' },
  fighting: { label: 'Lucha',     color: '#C22E28' },
  poison:   { label: 'Veneno',    color: '#A33EA1' },
  ground:   { label: 'Tierra',    color: '#E2BF65' },
  flying:   { label: 'Volador',   color: '#A98FF3' },
  psychic:  { label: 'Psíquico',  color: '#F95587' },
  bug:      { label: 'Bicho',     color: '#A6B91A' },
  rock:     { label: 'Roca',      color: '#B6A136' },
  ghost:    { label: 'Fantasma',  color: '#735797' },
  dragon:   { label: 'Dragón',    color: '#6F35FC' },
  dark:     { label: 'Siniestro', color: '#705746' },
  steel:    { label: 'Acero',     color: '#B7B7CE' },
  fairy:    { label: 'Hada',      color: '#D685AD' },
};

export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

// Generación -> región de introducción.
export const GENERATIONS = {
  'generation-i':    { region: 'Kanto',   numeral: 'I' },
  'generation-ii':   { region: 'Johto',   numeral: 'II' },
  'generation-iii':  { region: 'Hoenn',   numeral: 'III' },
  'generation-iv':   { region: 'Sinnoh',  numeral: 'IV' },
  'generation-v':    { region: 'Teselia', numeral: 'V' },
  'generation-vi':   { region: 'Kalos',   numeral: 'VI' },
  'generation-vii':  { region: 'Alola',   numeral: 'VII' },
  'generation-viii': { region: 'Galar',   numeral: 'VIII' },
  'generation-ix':   { region: 'Paldea',  numeral: 'IX' },
};
