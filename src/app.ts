import express from 'express';
import tokenRouter from './routes/token.routes';
import boxRouter from './routes/box.routes';
import pokemonRouter from './routes/pokemon.routes';
import { authenticateToken } from "./auth";

const app = express();
app.use(express.json());

// --- Public routes ---
app.use("/token", tokenRouter);
app.use('/pokemon', pokemonRouter);

// --- Protected routes ---
//app.use("/box", boxRouter);
app.use('/box', authenticateToken, boxRouter);

// Simple test route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/protected", authenticateToken, (req, res) => {
  // thanks to the global augmentation, req.pennkey is typed
  res.json({ message: `Hello, ${req.pennkey}` });
});

export default app;