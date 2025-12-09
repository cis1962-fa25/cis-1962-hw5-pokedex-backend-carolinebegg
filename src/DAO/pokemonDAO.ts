// src/DAO/pokemonDAO.ts
import Pokedex from 'pokedex-promise-v2';

const pokedex = new Pokedex();

export async function fetchPokemonByName(name: string) {
  return pokedex.getPokemonByName(name.toLowerCase());
}

export async function fetchPokemonSpeciesByName(name: string) {
  return pokedex.getPokemonSpeciesByName(name.toLowerCase());
}

export async function fetchMoveByName(name: string) {
  return pokedex.getMoveByName(name.toLowerCase());
}

export async function fetchPokemonList(limit: number, offset: number) {
  // Returns { count, next, previous, results: [{ name, url }, ...] }
  return pokedex.getPokemonsList({ limit, offset });
}

export async function fetchAllTypes(): Promise<string[]> {
  const res = await pokedex.getTypesList();
  // res.results is an array like [{ name: "normal", url: "..." }, ...]
  return res.results.map((t: { name: string }) => t.name);
}
