import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { pokemonApi } from '../lib/pokemonApi';
import { mapPokemonFromApi } from '@/entities/pokemon';

export function usePokemonDetails(idOrName: string | number | null) {
  return useQuery({
    queryKey: ['pokemon', 'details', idOrName],
    queryFn: () => pokemonApi.byIdOrName(idOrName as string | number),
    enabled: idOrName != null && idOrName !== '',
    select: (data) => mapPokemonFromApi(data),
    placeholderData: keepPreviousData,
  });
}
