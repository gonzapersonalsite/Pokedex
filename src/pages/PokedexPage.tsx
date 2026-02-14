import { useState, useRef, useEffect, Suspense } from 'react';
import { PokemonList, PokemonModal } from '@/features/pokemon/ui';
import { usePokemonSearch, usePokemonNames, useTypes } from '@/features/pokemon/model';
import { Button, Loader, PokeballIcon } from '@/shared/ui';
import { cn, getTypeBadgeClass } from '@/shared/utils';
import { useTheme } from '@/app/providers';
import { SunIcon, MoonIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SUGGESTIONS_MAX = 8;

export function PokedexPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: allNames = [] } = usePokemonNames();
  const { data: typesList = [] } = useTypes();

  const handleSearch = () => {
    setSearchSubmitted(searchQuery.trim());
  };

  const handleSelectSuggestion = (name: string) => {
    setSearchQuery(name);
    setSearchSubmitted(name);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header tipo Pokédex: barra superior clara */}
      <header id="top" className="sticky top-0 z-20 border-b-4 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <PokeballIcon size={40} className="shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                Pokédex
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 sm:flex-initial sm:min-w-[280px] max-w-xl">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                onSelectSuggestion={handleSelectSuggestion}
                onClear={() => {
                  setSearchQuery('');
                  setSearchSubmitted('');
                }}
                suggestions={allNames}
                maxSuggestions={SUGGESTIONS_MAX}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="self-start sm:self-center"
                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido a ancho completo: scroll de toda la página */}
      <main id="main-content" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-12">
        {searchSubmitted ? (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <Loader />
              </div>
            }
          >
            <SearchResult
              query={searchSubmitted}
              onSelect={(id) => setSelectedId(id)}
              onClose={() => setSearchSubmitted('')}
            />
          </Suspense>
        ) : (
          <>
            <TypeFilter
              types={typesList}
              selectedType={typeFilter}
              onSelectType={(t) => {
                setTypeFilter(t);
                if (t !== null) setShowFavorites(false);
              }}
              showFavorites={showFavorites}
              onToggleFavorites={() => {
                const next = !showFavorites;
                setShowFavorites(next);
                if (next) setTypeFilter(null);
              }}
            />
            <Suspense fallback={<Loader className="min-h-[300px]" />}>
              <PokemonList
                onSelectPokemon={setSelectedId}
                typeFilter={typeFilter}
                favoritesOnly={showFavorites}
              />
            </Suspense>
          </>
        )}
      </main>

      <PokemonModal
        pokemonIdOrName={selectedId}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        onNavigate={(id) => setSelectedId(typeof id === 'number' ? id : Number(id))}
      />
    </div>
  );
}

function TypeFilter({
  types,
  selectedType,
  onSelectType,
  showFavorites,
  onToggleFavorites,
}: {
  types: { id: number; name: string }[];
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
        Filter by type
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectType(null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition',
            selectedType === null
              ? 'ring-2 ring-offset-2 ring-primary-500 bg-primary-500 text-white dark:ring-offset-slate-900'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={onToggleFavorites}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition',
            showFavorites
              ? 'ring-2 ring-offset-2 ring-amber-500 bg-amber-500 text-slate-900 dark:ring-offset-slate-900'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          )}
        >
          Favorites
        </button>
        {types.map((t) => {
          const isSelected = selectedType === t.name;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectType(isSelected ? null : t.name)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium capitalize transition',
                getTypeBadgeClass(t.name),
                isSelected && 'ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-100 ring-offset-slate-100 dark:ring-offset-slate-900'
              )}
            >
              {t.name.replace(/-/g, ' ')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  onSelectSuggestion,
  suggestions,
  maxSuggestions = 8,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onSelectSuggestion?: (name: string) => void;
  suggestions: { name: string; id: number }[];
  maxSuggestions?: number;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const q = value.trim().toLowerCase();
  const filtered =
    q.length < 1
      ? []
      : suggestions
          .filter(
            (s) =>
              s.name.toLowerCase().includes(q) || s.id.toString() === q
          )
          .slice(0, maxSuggestions);

  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (containerRef.current?.contains(ev.target as Node)) return;
      setOpen(false);
      setActiveIndex(-1);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = open && filtered.length > 0 && value.length > 0;

  useEffect(() => {
    if (showDropdown && activeIndex === -1) {
      setActiveIndex(0);
    }
    if (!showDropdown) {
      setActiveIndex(-1);
    }
  }, [showDropdown]);

  const pick = (name: string) => {
    onSelectSuggestion?.(name);
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full" ref={containerRef}>
      <div className="relative flex-1 min-w-0">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
        <input
          type="search"
          role="combobox"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => value.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!showDropdown) {
                setOpen(true);
                setActiveIndex(0);
                return;
              }
              setActiveIndex((prev) =>
                filtered.length === 0 ? -1 : Math.min((prev < 0 ? 0 : prev) + 1, filtered.length - 1)
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!showDropdown) return;
              setActiveIndex((prev) =>
                filtered.length === 0 ? -1 : Math.max((prev < 0 ? 0 : prev) - 1, 0)
              );
            } else if (e.key === 'Enter') {
              if (activeIndex >= 0 && filtered[activeIndex]) {
                pick(filtered[activeIndex].name);
              } else if (filtered.length > 0 && onSelectSuggestion) {
                pick(filtered[0].name);
              } else {
                onSubmit();
              }
            } else if (e.key === 'Escape') {
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
          placeholder="Search by name or ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Search Pokémon"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-haspopup="listbox"
          aria-expanded={!!showDropdown}
          aria-activedescendant={
            activeIndex >= 0 && filtered[activeIndex]
              ? `search-option-${filtered[activeIndex].id}`
              : undefined
          }
        />
        {showDropdown && (
          <ul
            className="absolute top-full left-0 right-0 mt-1 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg max-h-[240px] overflow-y-auto z-50"
            role="listbox"
            id="search-suggestions"
          >
            {filtered.map((s, i) => (
              <li
                key={s.id}
                role="option"
                id={`search-option-${s.id}`}
                tabIndex={0}
                aria-selected={i === activeIndex}
                className={cn(
                  'px-4 py-2.5 text-left flex justify-between items-center gap-2 cursor-pointer',
                  i === activeIndex
                    ? 'bg-slate-100 dark:bg-slate-700'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
                onClick={() => pick(s.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    pick(s.name);
                  }
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="font-medium capitalize text-slate-800 dark:text-slate-100">
                  {s.name.replace(/-/g, ' ')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  #{String(s.id).padStart(3, '0')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="primary" size="md" onClick={onSubmit}>
          Search
        </Button>
        {value ? (
          <Button variant="ghost" size="md" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SearchResult({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  const { data, status, error } = usePokemonSearch(query);

  if (query.length === 0) return null;
  if (status === 'pending')
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  if (status === 'error') {
    const message =
      error?.message?.startsWith('HTTP ')
        ? 'There is no Pokémon with that name or ID. Try "Pikachu" or "25".'
        : (error?.message ?? 'We could not find that Pokémon.');
    return (
      <div className="text-center py-12 px-4">
        <p className="text-slate-700 dark:text-slate-300 mb-2 font-medium">
          {message}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Type a name or number in the search or pick a suggestion.
        </p>
        <Button variant="secondary" onClick={onClose}>
          Back to list
        </Button>
      </div>
    );
  }
  if (!data) return null;
  const displayName = data.name.replace(/-/g, ' ');
  const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  return (
    <div className="max-w-md mx-auto">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Result for &quot;{query}&quot;
      </p>
      <button
        type="button"
        onClick={() => onSelect(data.id)}
        className="w-full rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-4 hover:border-primary-500 dark:hover:border-primary-500 transition text-left shadow-sm"
      >
        <span className="font-semibold capitalize text-slate-800 dark:text-slate-100">
          {capitalized}
        </span>
        <span className="text-slate-500 dark:text-slate-400 ml-2">
          #{String(data.id).padStart(3, '0')}
        </span>
      </button>
      <Button variant="ghost" className="mt-4 w-full sm:w-auto" onClick={onClose}>
        Back to list
      </Button>
    </div>
  );
}
