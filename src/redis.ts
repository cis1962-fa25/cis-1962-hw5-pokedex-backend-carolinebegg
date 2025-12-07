import { createClient } from "redis";

const url = process.env.REDIS_URL;

if (!url) {
    console.warn("REDIS_URL is not defined in environment variables. Redis client will not be created.");
}

const redisClient = createClient({ url });

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis", err);
});

export default redisClient;