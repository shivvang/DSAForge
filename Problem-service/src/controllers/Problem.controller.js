import Problem from "../models/Problem.model.js";
import { deleteCachedKeys } from "../utils/deleteCachedKeys.js";
import logger from "../utils/logger.js";
import { validateCreateProblem, validateUpdateProblem } from "../utils/validateData.js";


export const createProblem = async(req,res)=>{

    logger.info("Create problem end point is hit");

    try {
       const {error} = validateCreateProblem(req.body);

        if(error) {
            logger.warn("Validation error at Creating Problem",error.details[0].message);
            return res.status(400).json({
                success:false,
                message: error.details[0].message
            })
        }

        const {title,description,datastructure,algorithm,sourcelink,notes,user} = req.body;

       const newlyCreatedProblem =  new Problem({
        user,
        title,
        description,
        datastructure,
        algorithm,
        sourcelink,
        notes,
       })

       await newlyCreatedProblem.save();

       logger.info("Problem created successfully");

       //delete previously paginated cached results

       await deleteCachedKeys(req.cacheClient, "problems:*");

       return res.status(201).json({
         success: true,
         message: `Problem created successfully with ID: ${newlyCreatedProblem._id}`,
         problem: newlyCreatedProblem,
       });

    } catch (error) {
        logger.error("Error creating problem",error);
        res.status(500).send({
            success:false,
            message:"Error creating problem"
        });
    }
}

export const getAllProblems = async (req, res) => {
    logger.info("Fetching all problems...");

    try {
        // Parse and validate query parameters for pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const startIndex = (page - 1) * limit;

        // Generate a cache key based on pagination parameters
        const cacheKey = `problems:page:${page}:limit:${limit}`;
        const cachedProblems = await req.cacheClient.get(cacheKey);

        if (cachedProblems) {
            logger.info("Cache hit for problems.");
            return res.status(200).json({
                success: true,
                message: "Problems fetched successfully from cache.",
                data: JSON.parse(cachedProblems),
            });
        }

        // Fetch problems from the database
        const problems = await Problem.find({})
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const totalProblemCount = await Problem.countDocuments();

        const response = {
            problems,
            currentPage: page,
            totalPages: Math.ceil(totalProblemCount / limit),
            totalProblems: totalProblemCount,
        };

        // Save response in cache with a TTL of 300 seconds
        await req.cacheClient.setex(cacheKey, 300, JSON.stringify(response));

        logger.info("Problems fetched successfully.");
        res.status(200).json({
            success: true,
            message: "Problems fetched successfully.",
            data: response,
        });
    } catch (error) {
        logger.error("Error while fetching problems:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching problems. Please try again later.",
        });
    }
};

export const getProblem = async (req, res) => {
    logger.info("Get problem endpoint hit...");

    try {
        const problemId = req.params.id;

        // Validate the problemId format
        if (!problemId || !problemId.match(/^[0-9a-fA-F]{24}$/)) {
            logger.warn("Invalid problemId provided");
            return res.status(400).json({
                success: false,
                message: "Invalid problemId. Please provide a valid ID.",
            });
        }

        const cacheKey = `problem:${problemId}`;
        const cachedProblem = await req.cacheClient.get(cacheKey);

        if (cachedProblem) {
            logger.info(`Cache hit for problemId: ${problemId}`);
            return res.json({
                success: true,
                problem: JSON.parse(cachedProblem),
            });
        }

        logger.info(`Cache miss for problemId: ${problemId}, querying database...`);
        const problem = await Problem.findById(problemId);

        if (!problem) {
            logger.warn(`Problem with ID ${problemId} not found`);
            return res.status(404).json({
                success: false,
                message: `Problem with ID ${problemId} not found`,
            });
        }

        // Store in cache
        await req.cacheClient.setex(cacheKey, 3600, JSON.stringify(problem));
        logger.info(`Problem with ID ${problemId} found and cached`);

        return res.json({
            success: true,
            problem,
        });
    } catch (error) {
        logger.error("Error retrieving problem", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the problem. Please try again later.",
        });
    }
};


export const deleteProblem = async (req, res) => {
    const problemId = req.params.id;
    logger.info(`Delete problem endpoint hit for problem ID: ${problemId}`);

    try {
        // Validate problemId
        if (!problemId) {
            logger.warn("Problem ID is missing in the request parameters.");
            return res.status(400).json({
                success: false,
                message: "Problem ID is required.",
            });
        }

        // Check if the problem exists
        const problem = await Problem.findById(problemId);
        if (!problem) {
            logger.warn(`No problem found with ID: ${problemId}`);
            return res.status(404).json({
                success: false,
                message: `Problem with ID ${problemId} not found.`,
            });
        }

        // Delete the problem from the database
        await problem.deleteOne({"_id": problem._id});

        logger.info(`Problem with ID ${problemId} successfully deleted from the database.`);

        // Clear related cache
        await deleteCachedKeys(req.cacheClient, "problems:*");
        await req.cacheClient.del(`problem:${problemId}`);
        logger.info(`Cache cleared for problem ID ${problemId} and paginated keys.`);

        // Send success response
        return res.status(200).json({
            success: true,
            message: `Problem with ID ${problemId} has been successfully deleted.`,
        });

    } catch (error) {
        logger.error(`Error occurred while deleting problem with ID ${problemId}:`, error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the problem. Please try again later.",
        });
    }
};


export const updateProblem = async (req, res) => {
    logger.info(`Update problem endpoint hit for Problem ID: ${req.params.id}`);

    try {
        const problemId = req.params.id;

        // Validate request body
        delete req.body.user;

        const { error } = validateUpdateProblem(req.body);
        if (error) {
            logger.warn(`Validation error for Problem ID ${problemId}: ${error.details[0].message}`);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        // Find problem by ID
        const problem = await Problem.findById(problemId);
        if (!problem) {
            logger.warn(`Problem with ID ${problemId} not found`);
            return res.status(404).json({
                success: false,
                message: `Problem with ID ${problemId} not found`,
            });
        }

        // Update fields (only if provided)
        const { title, description, datastructure, algorithm, sourcelink, notes } = req.body;

        if (title) problem.title = title;
        if (description) problem.description = description;
        if (datastructure) problem.datastructure = datastructure;
        if (algorithm) problem.algorithm = algorithm;
        if (sourcelink) problem.sourcelink = sourcelink;
        if (notes) problem.notes = notes;

        await problem.save();

        // Clear related cache
        const cacheKey = `problem:${problemId}`;
        await req.cacheClient.del(cacheKey);
        logger.info(`Cleared cache for Problem ID: ${problemId}`);

        //clear paginated problems cache 
        await deleteCachedKeys(req.cacheClient, "problems:*");

        // Cache updated problem
        await req.cacheClient.setex(cacheKey, 3600, JSON.stringify(problem));
        logger.info(`Updated Problem ID ${problemId} cached successfully`);

        return res.status(200).json({
            success: true,
            message: `Problem with ID ${problemId} updated successfully`,
            problem,
        });
    } catch (error) {
        logger.error(`Error updating Problem ID ${req.params.id}:`, error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the problem",
        });
    }
};
