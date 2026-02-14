import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePokemonDetails, useEvolutionTree } from '../model';
import { useFavoritesStore } from '@/store/favorites';
import { Button, toast } from '@/shared/ui';
import { Loader } from '@/shared/ui';
import type { EvolutionNode } from '@/entities/pokemon';
import { cn, getTypeBadgeClass } from '@/shared/utils';

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

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl">
              <div className="sticky top-0 flex justify-end p-2 bg-white/90 dark:bg-slate-900/90 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Cerrar"
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
                      <div className="absolute top-2 right-2">
                        <Loader />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        #{String(pokemon.id).padStart(3, '0')}
                      </p>
                      <h2 className="text-2xl font-bold capitalize text-slate-800 dark:text-slate-100">
                        {pokemon.name.replace(/-/g, ' ')}
                      </h2>
                      <div className="flex justify-center gap-2 mt-2 flex-wrap">
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
                          <span className="text-slate-600 dark:text-slate-300">Altura</span>
                          <p className="font-medium">{pokemon.height / 10} m</p>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-300">Peso</span>
                          <p className="font-medium">{pokemon.weight / 10} kg</p>
                        </div>
                      </div>
                      <Button
                        variant={isFavorite ? 'secondary' : 'primary'}
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          const wasFavorite = isFavorite;
                          toggle(pokemon.id);
                          toast({
                            variant: wasFavorite ? 'info' : 'success',
                            title: wasFavorite ? 'Quitado de favoritos' : 'Añadido a favoritos',
                            message: wasFavorite
                              ? 'Se ha quitado de favoritos.'
                              : 'Se ha añadido a favoritos.',
                          });
                        }}
                      >
                        {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      </Button>
                    </div>
                    {evolutionTree && (
                      <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                          Cadena de evolución
                        </h3>
                        <EvolutionChain chain={evolutionTree} onNavigate={onNavigate} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
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
      aria-label={`Ver ${displayName}`}
      title={`Ver ${displayName}`}
    >
      {displayName}
    </button>
  );
}
