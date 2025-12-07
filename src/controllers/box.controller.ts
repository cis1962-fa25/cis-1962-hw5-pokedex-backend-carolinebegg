import { Request, Response } from "express";
import {
  createBoxEntryService,
  getBoxEntryService,
  listBoxEntryIdsService,
  updateBoxEntryService,
  deleteBoxEntryService,
  clearBoxEntriesService,
} from "../services/box.service";

export async function listBoxEntries(req: Request, res: Response) {
  const pennkey = req.pennkey!;
  const ids = await listBoxEntryIdsService(pennkey);
  return res.json(ids);
}

export async function createBoxEntry(req: Request, res: Response) {
  const pennkey = req.pennkey!;
  try {
    const entry = await createBoxEntryService(pennkey, req.body);
    return res.status(201).json(entry);
  } catch (err: any) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: err.message || "Invalid Box entry data",
    });
  }
}

export async function getBoxEntry(req: Request, res: Response) {
  const pennkey = req.pennkey!;
  const { id } = req.params;

  const entry = await getBoxEntryService(pennkey, id);
  if (!entry) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Box entry not found",
    });
  }
  return res.json(entry);
}

export async function updateBoxEntry(req: Request, res: Response) {
  const pennkey = req.pennkey!;
  const { id } = req.params;

  const updated = await updateBoxEntryService(pennkey, id, req.body);
  if (!updated) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Box entry not found",
    });
  }
  return res.json(updated);
}

export async function deleteBoxEntry(req: Request, res: Response) {
  const pennkey = req.pennkey!;
  const { id } = req.params;

  const ok = await deleteBoxEntryService(pennkey, id);
  if (!ok) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Box entry not found",
    });
  }
  return res.status(204).send();
}

export async function clearBoxEntries(req: Request, res: Response) {
  const pennkey = req.pennkey!;
  await clearBoxEntriesService(pennkey);
  return res.status(204).send();
}