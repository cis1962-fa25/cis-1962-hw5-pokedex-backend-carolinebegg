// src/services/pokemon.service.ts
import {
  fetchPokemonByName,
  fetchPokemonSpeciesByName,
  fetchMoveByName,
  fetchPokemonList,
  fetchAllTypes,
} from '../DAO/pokemonDAO';
import {
  Pokemon,
  PokemonMove,
  PokemonType,
  PokemonSprites,
  PokemonStats,
} from '../models/pokemon';

// ---------------------------------------------------------------------------
// Simple in-memory caches (reset when server restarts)
// ---------------------------------------------------------------------------

const pokemonCache = new Map<string, Pokemon>();
const moveCache = new Map<string, PokemonMove>();

// ---------------------------------------------------------------------------
// Mapping helpers: PokeAPI -> API.md shapes
// ---------------------------------------------------------------------------

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

/**
 * Convert a PokeAPI type name to our API.md PokemonType.
 * PokeAPI does NOT provide a color; our HW API requires one,
 * so we provide a simple default hex color for all types.
 */
function mapTypeToPokemonType(typeName: string): PokemonType {
    const lower = typeName.toLowerCase();
    
    return {
        name: typeName.toUpperCase(),
        color: TYPE_COLORS[lower] ?? "#A8A878"
    };
}

function mapSprites(pokemon: any): PokemonSprites {
  return {
    front_default: pokemon.sprites.front_default ?? '',
    back_default: pokemon.sprites.back_default ?? '',
    front_shiny: pokemon.sprites.front_shiny ?? '',
    back_shiny: pokemon.sprites.back_shiny ?? '',
  };
}

function mapStatsObject(pokemon: any): PokemonStats {
  const lookup: Record<string, number> = {};

  for (const s of pokemon.stats) {
    lookup[s.stat.name] = s.base_stat;
  }

  return {
    hp: lookup['hp'],
    attack: lookup['attack'],
    defense: lookup['defense'],
    specialAttack: lookup['special-attack'],
    specialDefense: lookup['special-defense'],
    speed: lookup['speed'],
  };
}

function extractEnglishName(names: any[]): string | null {
  const entry = names.find((n) => n.language.name === 'en');
  return entry ? entry.name : null;
}

function extractEnglishFlavorText(entries: any[]): string | null {
  const entry = entries.find((e) => e.language.name === 'en');
  if (!entry) return null;
  return entry.flavor_text.replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Move building: raw -> PokemonMove (with caching & graceful failure)
// ---------------------------------------------------------------------------

/**
 * Core move-building logic (no cache, may throw).
 */
async function buildMoveNoCache(moveName: string): Promise<PokemonMove> {
  const moveData = await fetchMoveByName(moveName);
  const englishName = extractEnglishName(moveData.names) ?? moveData.name;

  const rawPower: number | null = moveData.power;
  const typeName: string = moveData.type.name;

  const move: PokemonMove = {
    name: englishName,
    type: mapTypeToPokemonType(typeName),
  };

  // API.md: "power?: number; // Optional, undefined if power is 0 or null"
  if (typeof rawPower === 'number' && rawPower !== 0) {
    move.power = rawPower;
  }

  return move;
}

/**
 * Cached move fetcher.
 */
async function getOrFetchMove(moveName: string): Promise<PokemonMove> {
  const key = moveName.toLowerCase();
  const cached = moveCache.get(key);
  if (cached) return cached;

  const move = await buildMoveNoCache(moveName);
  moveCache.set(key, move);
  return move;
}

/**
 * Safe wrapper: if a move fails, we log and skip it
 * instead of failing the whole Pokemon.
 */
async function safeBuildMove(moveName: string): Promise<PokemonMove | null> {
  try {
    return await getOrFetchMove(moveName);
  } catch (err) {
    console.error(`Failed to fetch move "${moveName}" from PokeAPI:`, err);
    return null; // this move will be omitted
  }
}

// ---------------------------------------------------------------------------
// Pokemon building: PokeAPI -> Pokemon (with caching)
// ---------------------------------------------------------------------------

/**
 * Core builder for a single Pokemon (no cache).
 */
async function getPokemonByNameServiceNoCache(name: string): Promise<Pokemon> {
  // Fetch main pokemon data + species in parallel
  const [pokemon, species] = await Promise.all([
    fetchPokemonByName(name),
    fetchPokemonSpeciesByName(name),
  ]);

  const englishName =
    extractEnglishName(species.names) ?? pokemon.name;

  const description =
    extractEnglishFlavorText(species.flavor_text_entries) ?? '';

  const types: PokemonType[] = pokemon.types.map((t: any) =>
    mapTypeToPokemonType(t.type.name),
  );

  const sprites: PokemonSprites = mapSprites(pokemon);
  const stats: PokemonStats = mapStatsObject(pokemon);

  // Get move names and limit to a reasonable number for performance
  const moveNames: string[] = pokemon.moves
    .map((m: any) => m.move.name)
    .slice(0, 20);

  // Build moves in parallel, but don't let a single move kill the whole request
  const movesRaw = await Promise.all(
    moveNames.map((m) => safeBuildMove(m)),
  );

  const moves: PokemonMove[] = movesRaw.filter(
    (m): m is PokemonMove => m !== null,
  );

  return {
    id: pokemon.id,
    name: englishName,
    description,
    types,
    moves,
    sprites,
    stats,
  };
}

/**
 * Cached Pokemon fetcher.
 */
async function getOrFetchPokemon(name: string): Promise<Pokemon> {
  const key = name.toLowerCase();
  const cached = pokemonCache.get(key);
  if (cached) return cached;

  const pokemon = await getPokemonByNameServiceNoCache(name);
  pokemonCache.set(key, pokemon);
  return pokemon;
}

// ---------------------------------------------------------------------------
// Exported service functions used by controllers
// ---------------------------------------------------------------------------

/**
 * Get a single Pokemon by name (with caching).
 */
export async function getPokemonByNameService(name: string): Promise<Pokemon> {
  return getOrFetchPokemon(name);
}

/**
 * List Pokemon (with caching and parallel fetch).
 */
export async function listPokemonService(
  limit: number,
  offset: number,
): Promise<Pokemon[]> {
  const list = await fetchPokemonList(limit, offset);
  const names: string[] = list.results.map((p: any) => p.name);

  // Reuse cached fetcher so we don't rebuild the same Pokemon repeatedly
  return Promise.all(names.map((n) => getOrFetchPokemon(n)));
}

export async function getAllPokemonTypesFromApi(): Promise<PokemonType[]> {
  const typeNames = await fetchAllTypes();
  return typeNames.map(mapTypeToPokemonType);
}