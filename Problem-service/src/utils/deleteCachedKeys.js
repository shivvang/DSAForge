import logger from "./logger.js";

export const deleteCachedKeys = async (cacheClient, pattern) => {
    try {
        const keys = [];

        //scanStream

       // It fetches keys in a non-blocking, paginated manner.

       //Keeps your application scalable even with a large number of keys.
       
        const stream = cacheClient.scanStream({ match: pattern });

        for await (const batch of stream) {
            keys.push(...batch);
        }

        if (keys.length > 0) {
            await cacheClient.del(keys);
            logger.info(`Deleted ${keys.length} cached keys matching pattern: ${pattern}`);
        } else {
            logger.info("No cached keys found matching the pattern.");
        }
    } catch (error) {
        logger.error("Error while deleting cached keys:", error);
    }
};
