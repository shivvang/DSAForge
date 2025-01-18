import Redis from "ioredis";
import { Queue} from "bullmq";

const cacheClient = new Redis(process.env.REDIS_URL);

// Create a queue named "reviewQueue"
const reviewQueue = new Queue("reviewQueue", {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});

export { reviewQueue };
