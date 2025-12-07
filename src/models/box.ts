export interface BoxEntry {
    id: string;          // CUID2-generated unique identifier
    createdAt: string;   // ISO 8601 date string
    level: number;
    location: string;
    notes?: string;      // Optional notes about the entry
    pokemonId: number;   // Pokemon ID from the Pokemon API
}

export type InsertBoxEntry = Omit<BoxEntry, "id">;
export type UpdateBoxEntry = Partial<InsertBoxEntry>;