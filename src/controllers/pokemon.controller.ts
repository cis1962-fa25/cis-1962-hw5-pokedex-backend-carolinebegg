// src/controllers/pokemon.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import {
  getPokemonByNameService,
  listPokemonService,
} from '../services/pokemon.service';

const listQuerySchema = z.object({
  limit: z
    .string()
    .transform(Number)
    .refine((n) => Number.isFinite(n) && n > 0, 'limit must be > 0'),
  offset: z
    .string()
    .transform(Number)
    .refine((n) => Number.isFinite(n) && n >= 0, 'offset must be >= 0'),
});

export async function getPokemonByNameController(req: Request, res: Response) {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Pokemon name is required in the path',
      });
    }

    const pokemon = await getPokemonByNameService(name);
    return res.status(200).json(pokemon);
  } catch (err: any) {
    const status =
        err?.statusCode ??
        err?.status ??
        err?.response?.status ??
        err?.originalError?.response?.status;
    if (status === 404) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Pokemon not found',
      });
    }

    console.error('Error fetching pokemon:', err);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch Pokemon',
    });
  }
}

export async function listPokemonController(req: Request, res: Response) {
  try {
    const parsed = listQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Invalid or missing limit/offset query parameters',
      });
    }

    const { limit, offset } = parsed.data;

    const pokemons = await listPokemonService(limit, offset);
    return res.status(200).json(pokemons);
  } catch (err) {
    console.error('Error listing pokemon:', err);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to list Pokemon',
    });
  }
}
