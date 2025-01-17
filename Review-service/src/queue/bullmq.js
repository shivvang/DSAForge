import Redis from "ioredis";
import { Queue, Worker } from "bullmq";

const cacheClient = new Redis(process.env.REDIS_URL);

// Create a queue named "reviewQueue"
const reviewQueue = new Queue("reviewQueue", {
    connection: cacheClient,
});

export { reviewQueue };
