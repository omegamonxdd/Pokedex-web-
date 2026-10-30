import PokemonDetail from '@/components/detail/PokemonDetail';

// Next 14: `params` es un objeto síncrono (en Next 15 sería una Promise).
export default function PokemonPage({ params }) {
  return <PokemonDetail id={params.id} />;
}
