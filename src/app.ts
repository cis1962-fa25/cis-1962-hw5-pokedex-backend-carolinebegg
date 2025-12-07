import express from 'express';

const app = express();

app.use(express.json());

// Simple test route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// // Routes
// // add routes here
// // app.use("/pokemon", pokemonRouter);
// // app.use("/box", boxRouter);
// // app.use("/", tokenRouter);

export default app;