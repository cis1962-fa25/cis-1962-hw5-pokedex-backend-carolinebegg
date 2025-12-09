export interface PokemonType {
    name: string;        // Type name in uppercase (e.g., "FIRE", "WATER")
    color: string;       // Hex color code for the type
}

export interface PokemonMove {
    name: string;
    power?: number;      // Optional, undefined if power is 0 or null
    type: PokemonType;
}

export interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
}

export interface PokemonStats {
  hp: number;
  speed: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
}

export interface Pokemon {
  id: number;
  name: string;
  description: string;
  types: PokemonType[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  stats: PokemonStats;
}