import { createId } from "@paralleldrive/cuid2";
import {
  BoxEntry,
  InsertBoxEntry,
  UpdateBoxEntry,
} from "../models/box";
import {
  getBoxEntryDAO,
  setBoxEntryDAO,
  deleteBoxEntryDAO,
  listBoxEntryIdsDAO,
  clearBoxEntriesDAO,
} from "../DAO/boxDAO";

export async function createBoxEntryService(
  pennkey: string,
  data: InsertBoxEntry
): Promise<BoxEntry> {
  const entry: BoxEntry = {
    ...data,
    id: createId(),
  };
  await setBoxEntryDAO(pennkey, entry);
  return entry;
}

export async function getBoxEntryService(
  pennkey: string,
  id: string
): Promise<BoxEntry | null> {
  return getBoxEntryDAO(pennkey, id);
}

export async function listBoxEntryIdsService(
  pennkey: string
): Promise<string[]> {
  return listBoxEntryIdsDAO(pennkey);
}

export async function updateBoxEntryService(
  pennkey: string,
  id: string,
  update: UpdateBoxEntry
): Promise<BoxEntry | null> {
  const existing = await getBoxEntryDAO(pennkey, id);
  if (!existing) return null;

  const merged: BoxEntry = { ...existing, ...update };
  await setBoxEntryDAO(pennkey, merged);
  return merged;
}

export async function deleteBoxEntryService(
  pennkey: string,
  id: string
): Promise<boolean> {
  const existing = await getBoxEntryDAO(pennkey, id);
  if (!existing) return false;
  await deleteBoxEntryDAO(pennkey, id);
  return true;
}

export async function clearBoxEntriesService(pennkey: string): Promise<void> {
  await clearBoxEntriesDAO(pennkey);
}