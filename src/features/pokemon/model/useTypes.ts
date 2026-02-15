import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '../lib/pokemonApi';
import { mapTypeFromApi } from '@/entities/pokemon';

/** Lista de tipos para filtros (solo tipos principales, sin "unknown" etc si se desea filtrar). */
export function useTypes() {
  return useQuery({
    queryKey: ['pokemon', 'types'],
    queryFn: async () => {
      const res = await pokemonApi.types();
      const types = await Promise.all(
        res.results.map((t) => pokemonApi.typeByIdOrName(t.name))
      );
      return types.map(mapTypeFromApi);
    },
  });
}
