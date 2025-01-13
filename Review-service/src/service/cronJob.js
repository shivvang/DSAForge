import cron from "node-cron";
import fetch from "node-fetch";
import logger from "../utils/logger.js";

const fetchProblems = async () => {
    try {
        const response = await fetch("http://localhost:8003/api/review/due");
        if (response.ok) {
            const data = await response.json();
            logger.info("Successfully fetched due problems:", data);
        } else {
            logger.warn(`Failed to fetch due problems. Status: ${response.status}`);
        }
    } catch (error) {
        logger.error("Error fetching due problems:", error.message);
    }
};

// Schedule a cron job to run every 15 minutes
const cronJob = cron.schedule(
    "*/15 * * * *",
    async () => {
        await fetchProblems();
    },
    { scheduled: false }
);

// Start the cron job
const startCronJob = () => {
    logger.info("Starting cron job to fetch due problems every 15 minutes.");
    cronJob.start();
};

export default startCronJob;
