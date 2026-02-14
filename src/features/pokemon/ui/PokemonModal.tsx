import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Fragment } from 'react';
import { useQueries } from '@tanstack/react-query';
import { XMarkIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePokemonDetails, useEvolutionTree } from '../model';
import { useFavoritesStore } from '@/store/favorites';
import { Button, toast } from '@/shared/ui';
import { Loader } from '@/shared/ui';
import type { EvolutionNode } from '@/entities/pokemon';
import { cn, getTypeBadgeClass } from '@/shared/utils';
import { pokemonApi } from '../lib/pokemonApi';

export interface PokemonModalProps {
  pokemonIdOrName: number | string | null;
  open: boolean;
  onClose: () => void;
  onNavigate?: (idOrName: number | string) => void;
}

export function PokemonModal({
  pokemonIdOrName,
  open,
  onClose,
  onNavigate,
}: PokemonModalProps) {
  const { data: pokemon, status, error, isFetching } = usePokemonDetails(pokemonIdOrName);
  const { data: evolutionTree } = useEvolutionTree(pokemonIdOrName);
  const { favorites, toggle } = useFavoritesStore();

  const isFavorite = pokemon ? favorites.includes(pokemon.id) : false;

  const typeQueries = useQueries({
    queries:
      pokemon?.types.map((t) => ({
        queryKey: ['types', 'damage', t],
        queryFn: () => pokemonApi.typeByIdOrName(t),
        enabled: !!pokemon,
        staleTime: 1000 * 60 * 60,
      })) ?? [],
  });

  const weaknesses = (() => {
    const details = typeQueries.map((q) => q.data).filter(Boolean) as Array<{
      name: string;
      damage_relations?: {
        double_damage_from: Array<{ name: string }>;
        half_damage_from: Array<{ name: string }>;
        no_damage_from: Array<{ name: string }>;
      };
    }>;
    if (!details.length) return [];
    const mult = new Map<string, number>();
    for (const d of details) {
      const dr = d.damage_relations;
      if (!dr) continue;
      for (const it of dr.double_damage_from) {
        mult.set(it.name, (mult.get(it.name) ?? 1) * 2);
      }
      for (const it of dr.half_damage_from) {
        mult.set(it.name, (mult.get(it.name) ?? 1) * 0.5);
      }
      for (const it of dr.no_damage_from) {
        mult.set(it.name, 0);
      }
    }
    const result = Array.from(mult.entries())
      .filter(([, v]) => v > 1)
      .sort((a, b) => b[1] - a[1]);
    return result;
  })();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden />
        </TransitionChild>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative flex items-center justify-center p-2 w-full max-w-2xl">
              <div className="relative w-full bg-[#e30000] rounded-tl-[60px] rounded-tr-2xl rounded-br-2xl rounded-bl-[40px] border-b-[12px] border-r-[12px] border-[#a00000] p-4 sm:p-6 shadow-2xl overflow-hidden">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-3 bg-[#c00000] border-r border-black/10 rounded-r-full" />
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full border-4 border-slate-200 shadow-lg">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-500 rounded-full border-2 border-blue-300 animate-pulse shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
                    <div className="absolute top-2 left-3 w-4 h-2 bg-white/40 rounded-full rotate-[-45deg]" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full border border-black/30 shadow-[0_0_5px_red]" />
                    <div className="w-4 h-4 bg-yellow-400 rounded-full border border-black/30 shadow-[0_0_5px_yellow]" />
                    <div className="w-4 h-4 bg-green-500 rounded-full border border-black/30 shadow-[0_0_5px_green]" />
                  </div>
                </div>
                <div className="bg-[#dedede] p-4 sm:p-6 pb-10 rounded-xl rounded-bl-[40px] border-b-4 border-r-4 border-gray-400 shadow-inner">
                  <DialogPanel className="relative mx-auto w-full max-h-[60vh] sm:max-h-[65vh] overflow-y-auto rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-2 border-black/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
                    {pokemon && onNavigate && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous Pokémon"
                          title="Previous Pokémon"
                          disabled={isFetching || pokemon.id <= 1}
                          onClick={() => {
                            const prevId = Math.max(1, pokemon.id - 1);
                            onNavigate(prevId);
                          }}
                          className="hidden sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 shadow hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-50"
                        >
                          <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next Pokémon"
                          title="Next Pokémon"
                          disabled={isFetching}
                          onClick={() => onNavigate(pokemon.id + 1)}
                          className="hidden sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 shadow hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-50"
                        >
                          <ChevronRightIcon className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    <div className="sticky top-0 flex justify-end p-2 bg-white/90 dark:bg-slate-900/90 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        aria-label="Close"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="p-4 pt-0">
                      {status === 'pending' && !pokemon && (
                        <Loader className="min-h-[200px]" />
                      )}
                      {status === 'error' && (
                        <p className="text-red-600 dark:text-red-400 py-6">
                          {error?.message ?? 'Error al cargar.'}
                        </p>
                      )}
                      {pokemon && (
                        <>
                          {isFetching && (
                            <div className="absolute inset-0 z-20 rounded-lg bg-black/10 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                              <Loader className="p-4" />
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              #{String(pokemon.id).padStart(3, '0')}
                            </p>
                            <h2 className="text-2xl font-bold capitalize text-slate-800 dark:text-slate-100">
                              {pokemon.name.replace(/-/g, ' ')}
                            </h2>
                            <div className="flex justify-center gap-2 mt- tar2 flex-wrap">
                              {pokemon.types.map((t) => (
                                <span
                                  key={t}
                                  className={cn(
                                    'text-sm font-medium px-3 py-1 rounded-full capitalize',
                                    getTypeBadgeClass(t)
                                  )}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                            {pokemon.image && (
                              <img
                                src={pokemon.image}
                                alt={pokemon.name}
                                className="mx-auto w-48 h-48 object-contain mt-4"
                              />
                            )}
                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                              <div>
                                <span className="text-slate-600 dark:text-slate-300">Height</span>
                                <p className="font-medium">{pokemon.height / 10} m</p>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-300">Weight</span>
                                <p className="font-medium">{pokemon.weight / 10} kg</p>
                              </div>
                            </div>
                            {weaknesses.length > 0 && (
                              <div className="mt-6 text-left">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                                  Weaknesses
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {weaknesses.map(([type, factor]) => (
                                    <span
                                      key={type}
                                      className={cn(
                                        'text-sm font-medium px-3 py-1 rounded-full capitalize',
                                        getTypeBadgeClass(type)
                                      )}
                                      title={`x${factor.toFixed(1)}`}
                                    >
                                      {type} ×{factor.toFixed(1)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {pokemon.moves.length > 0 && (
                              <Disclosure>
                                {({ open }) => (
                                  <div className="mt-6 text-left">
                                    <DisclosureButton className="w-full flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-2 text-left font-semibold text-slate-800 dark:text-slate-100">
                                      <span>Moves</span>
                                      <ChevronDownIcon
                                        className={cn(
                                          'w-5 h-5 transition-transform',
                                          open ? 'rotate-180' : ''
                                        )}
                                      />
                                    </DisclosureButton>
                                    <DisclosurePanel>
                                      <ul className="grid grid-cols-2 gap-2 p-3">
                                        {pokemon.moves.slice(0, 12).map((m) => (
                                          <li
                                            key={m}
                                            className="text-sm capitalize px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                                          >
                                            {m.replace(/-/g, ' ')}
                                          </li>
                                        ))}
                                      </ul>
                                    </DisclosurePanel>
                                  </div>
                                )}
                              </Disclosure>
                            )}
                            <Button
                              variant={isFavorite ? 'secondary' : 'primary'}
                              size="sm"
                              className="mt-4"
                              onClick={() => {
                                const wasFavorite = isFavorite;
                                toggle(pokemon.id);
                                const displayName = pokemon.name.replace(/-/g, ' ');
                                toast({
                                  variant: wasFavorite ? 'info' : 'success',
                                  title: wasFavorite ? 'Removed from favorites' : 'Added to favorites',
                                  message: wasFavorite
                                    ? `${displayName} was removed from your favorites.`
                                    : `${displayName} was added to your favorites.`,
                                });
                              }}
                            >
                              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            </Button>
                          </div>
                          {evolutionTree && (
                            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                Evolution chain
                              </h3>
                              <EvolutionChain chain={evolutionTree} onNavigate={onNavigate} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </DialogPanel>
                  <div className="flex justify-between items-center mt-4 px-2">
                    <div className="w-6 h-6 bg-red-600 rounded-full border border-black/20 shadow-md" />
                    <div className="flex gap-4">
                      <div className="w-10 h-1 bg-black/20 rounded-full" />
                      <div className="w-10 h-1 bg-black/20 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 px-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full border-b-4 border-black shadow-lg active:translate-y-1 transition-all" />
                  <div className="flex gap-3">
                    <div className="w-14 h-3 bg-blue-900 rounded-sm border border-black/40 shadow-inner" />
                    <div className="w-14 h-3 bg-green-900 rounded-sm border border-black/40 shadow-inner" />
                  </div>
                  <div className="relative w-16 h-16">
                    <div className="absolute top-1/2 left-0 w-16 h-5 -translate-y-1/2 bg-slate-800 rounded-sm border-b-2 border-black" />
                    <div className="absolute left-1/2 top-0 w-5 h-16 -translate-x-1/2 bg-slate-800 rounded-sm border-r-2 border-black" />
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

/** Convierte la cadena en lista lineal cuando es A → B → C (sin ramas). */
function flattenLinearChain(node: EvolutionNode): EvolutionNode[] {
  const steps: EvolutionNode[] = [node];
  if (node.children.length === 1) {
    steps.push(...flattenLinearChain(node.children[0]));
  }
  return steps;
}

/** Muestra la cadena en horizontal: [A] → [B] → [C]. Si hay ramas (ej. Eevee), las muestra debajo. */
function EvolutionChain({
  chain,
  onNavigate,
}: {
  chain: EvolutionNode;
  onNavigate?: (id: number | string) => void;
}) {
  const isLinear = chain.children.length <= 1;
  const steps = isLinear ? flattenLinearChain(chain) : [chain];

  if (steps.length > 1) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((node, i) => (
          <span key={node.id} className="inline-flex items-center gap-2">
            <EvolutionChip id={node.id} name={node.name} onClick={onNavigate} />
            {i < steps.length - 1 && (
              <span className="text-slate-500 dark:text-slate-300 shrink-0" aria-hidden>
                →
              </span>
            )}
          </span>
        ))}
      </div>
    );
  }

  if (chain.children.length > 1) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <EvolutionChip id={chain.id} name={chain.name} onClick={onNavigate} />
          <span className="text-slate-500 dark:text-slate-300">→</span>
        </div>
        <div className="flex flex-wrap gap-2 pl-2">
          {chain.children.map((child) => (
            <EvolutionChip key={child.id} id={child.id} name={child.name} onClick={onNavigate} />
          ))}
        </div>
      </div>
    );
  }

  return <EvolutionChip id={chain.id} name={chain.name} onClick={onNavigate} />;
}

function EvolutionChip({
  id,
  name,
  onClick,
}: {
  id: number;
  name: string;
  onClick?: (id: number | string) => void;
}) {
  const displayName = name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="inline-flex px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 capitalize text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition"
      aria-label={`View ${displayName}`}
      title={`View ${displayName}`}
    >
      {displayName}
    </button>
  );
}
