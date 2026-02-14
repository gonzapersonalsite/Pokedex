import type {
  PokeApiPaginated,
  PokeApiPokemonListItem,
  PokeApiPokemon,
  PokeApiSpecies,
  PokeApiEvolutionChain,
  PokeApiType,
} from '@/entities/pokemon';

const BASE = 'https://pokeapi.co/api/v2';

async function fetchApi<T>(url: string, friendly404?: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404 && friendly404) throw new Error(friendly404);
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

export const pokemonApi = {
  /** Lista paginada (offset/limit) para infinite scroll */
  list(params: { offset: number; limit: number }) {
    const { offset, limit } = params;
    const url = `${BASE}/pokemon?offset=${offset}&limit=${limit}`;
    return fetchApi<PokeApiPaginated<PokeApiPokemonListItem>>(url);
  },

  /** Detalle de un Pokémon por ID o name */
  byIdOrName(idOrName: string | number) {
    const url = `${BASE}/pokemon/${idOrName}`;
    return fetchApi<PokeApiPokemon>(url, 'No hay ningún Pokémon con ese nombre o ID.');
  },

  /** Lista todos los Pokémon (nombre + id) para sugerencias. Máx ~1300. */
  async allNames(): Promise<{ name: string; id: number }[]> {
    const res = await fetchApi<PokeApiPaginated<PokeApiPokemonListItem>>(
      `${BASE}/pokemon?limit=2000`
    );
    return res.results.map((r) => {
      const id = parseInt(r.url.replace(/.*\/(\d+)\/$/, '$1'), 10);
      return { name: r.name, id };
    });
  },

  /** Especie (para evolution_chain url) */
  species(idOrName: string | number) {
    const url = `${BASE}/pokemon-species/${idOrName}`;
    return fetchApi<PokeApiSpecies>(url);
  },

  /** Cadena de evolución por ID de chain (número al final de la URL) */
  evolutionChain(chainId: number) {
    const url = `${BASE}/evolution-chain/${chainId}`;
    return fetchApi<{ id: number; chain: PokeApiEvolutionChain['chain'] }>(url);
  },

  /** Todos los tipos (para filtro) */
  types() {
    const url = `${BASE}/type?limit=100`;
    return fetchApi<PokeApiPaginated<{ name: string; url: string }>>(url);
  },

  /** Tipo por ID o nombre (incluye lista de pokemon de ese tipo) */
  typeByIdOrName(idOrName: string | number) {
    const url = `${BASE}/type/${idOrName}`;
    return fetchApi<PokeApiType>(url);
  },
};
