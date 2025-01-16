import Review from "../models/Review.model.js";
import logger from "../utils/logger.js";

/**
 * Handles the event when a problem is deleted.
 * Removes the deleted problem from the review service.
 * 
 * @param {Object} event - The event data containing the problem's ID and author ID.
 */
export const handleProblemDeletion = async (event) => {
    const { id, authorId } = event;

    if (!id || !authorId) {
        logger.error("❌ Missing required fields: 'id' or 'authorId' in the deletion event.");
        return;
    }

    logger.info(`📤 Handling problem deletion: Problem ID - ${id}, Author ID - ${authorId}`);

    try {
        // Check if the problem exists in the review service
        const problemToDelete = await Review.findById(id);

        if (!problemToDelete) {
            logger.warn(`⚠️ Problem with ID: ${id} doesn't exist in the review queue.`);
            return;
        }

        // Proceed with deleting the problem from the review service
        await Review.deleteOne({ _id: id });

        logger.info(`✅ Problem ID: ${id} deleted from the review service successfully.`);
    } catch (error) {
        logger.error(`❌ Error occurred while deleting problem ID: ${id} from review service.`, error);
    }
};