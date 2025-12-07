import redisClient from "../redis";
import { BoxEntry } from "../models/box";

function keyFor(pennkey: string, id: string): string {
    return `${pennkey}:pokedex:${id}`;
}

export async function getBoxEntryDAO(
    pennkey: string,
    id: string
): Promise<BoxEntry | null> {
    const data = await redisClient.get(keyFor(pennkey, id));
    return data ? (JSON.parse(data) as BoxEntry) : null;
}

export async function setBoxEntryDAO(
    pennkey: string,
    entry: BoxEntry
): Promise<void> {
    await redisClient.set(keyFor(pennkey, entry.id), JSON.stringify(entry));
}

export async function deleteBoxEntryDAO(
    pennkey: string,
    id: string
): Promise<void> {
    await redisClient.del(keyFor(pennkey, id));
}

export async function listBoxEntryIdsDAO(
    pennkey: string
): Promise<string[]> {
    const keys = await redisClient.keys(`${pennkey}:pokedex:*`);
    return keys.map((k) => k.split(":").pop() as string);
}

export async function clearBoxEntriesDAO(pennkey: string): Promise<void> {
    const keys = await redisClient.keys(`${pennkey}:pokedex:*`);
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
}