import express from 'express';
import tokenRouter from './routes/token.routes';
import boxRouter from './routes/box.routes';
import { authenticateToken } from "./auth";

const app = express();

app.use(express.json());

app.use("/token", tokenRouter);
app.use("/box", boxRouter);

// Simple test route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/protected", authenticateToken, (req, res) => {
  // thanks to the global augmentation, req.pennkey is typed
  res.json({ message: `Hello, ${req.pennkey}` });
});

// // Routes
// // add routes here
// // app.use("/pokemon", pokemonRouter);
// // app.use("/box", boxRouter);
// // app.use("/", tokenRouter);

export default app;