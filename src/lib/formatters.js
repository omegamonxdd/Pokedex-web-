/** "mr-mime" -> "Mr Mime" */
export function formatName(slug = '') {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** 25 -> "#0025" */
export const formatDexNumber = (id) => `#${String(id).padStart(4, '0')}`;

/** "https://pokeapi.co/api/v2/pokemon/25/" -> 25 */
export const idFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());

export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/** Devuelve texto oscuro o claro según la luminosidad del fondo (#rrggbb). */
export function readableTextColor(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#1d1f27' : '#ffffff';
}
