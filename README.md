# Pokédex (Next.js 14 · App Router · JavaScript · Tailwind)

```bash
npm install
npm run dev      # http://localhost:3000
```

Datos: https://pokeapi.co (sin API key). Imágenes: repositorio oficial de sprites de PokeAPI.

## Estructura
```
src/
├─ app/                  layout, home (/), detalle (/pokemon/[id])
├─ components/           Explorer, Card, HeaderSearch, Pagination, ErrorState, NetworkBanner
│  └─ detail/            PokemonDetail, StatBars, EvolutionChain, Matchups, PokedexEntries, TypeBadge
├─ hooks/                useOnlineStatus (navigator.onLine), useAsyncData (loading/error/retry)
└─ lib/                  api (fetch + ApiError + caché), typeChart, evolution, pokedexEntries, constants
```

Se usaron 2 IA's para este proyecto, gemini y claude.
Gemini: Mejora de prompts, se le mandaba un prompt con todo lo necesario y lo pasaba a una estructura que claude pudiera entender mejor y trabajara más rapido
Claude: Creo toda la infraestructura, frontend y backend del proyecto

Sin ayuda de la IA se hizo: un cambio del idioma, el codigo creado por claude usaba la API en idioma ingles principal y español de secundario, se invirtio el orden a mano y se arreglaron vulnerabilidades del proyecto en la terminal.
