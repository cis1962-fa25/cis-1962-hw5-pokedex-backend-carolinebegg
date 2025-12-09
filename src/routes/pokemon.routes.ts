// src/routes/pokemon.routes.ts
import { Router } from 'express';
import {
  getPokemonByNameController,
  listPokemonController,
} from '../controllers/pokemon.controller';

const router = Router();

// GET /pokemon/?limit=&offset=
router.get('/', listPokemonController);

// GET /pokemon/:name
router.get('/:name', getPokemonByNameController);

export default router;
