import Problem from "../models/Problem.model.js";
import logger from "../utils/logger.js";
import { publishEventToExchange } from "../utils/rabbitmq.js";
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

       
      // Notify other services about the newly created problem
        await publishEventToExchange('problem.new', {
            id: newlyCreatedProblem._id.toString(),
            authorId:user.toString(),
        });

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

export const deleteProblem = async (req, res) => {
    const problemId = req.params.id;
    logger.info(`Delete problem endpoint hit for problem ID: ${problemId}`);

    try {
     
        if (!problemId) {
            logger.warn("Problem ID is missing in the request parameters.");
            return res.status(400).json({
                success: false,
                message: "Problem ID is required.",
            });
        }

       
        const problem = await Problem.findById(problemId);
        if (!problem) {
            logger.warn(`No problem found with ID: ${problemId}`);
            return res.status(404).json({
                success: false,
                message: `Problem with ID ${problemId} not found.`,
            });
        }

        // Notify other services about the  deleted problem
        await publishEventToExchange('problem.deleted', {
        id: problem._id.toString(),
        authorId:req.body.user.toString(),
        });
    

       
        await problem.deleteOne({"_id": problem._id});

        logger.info(`Problem with ID ${problemId} successfully deleted from the database.`);

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

      
        delete req.body.user;

        const { error } = validateUpdateProblem(req.body);

        if (error) {
            logger.warn(`Validation error for Problem ID ${problemId}: ${error.details[0].message}`);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        
        const problem = await Problem.findById(problemId);
        if (!problem) {
            logger.warn(`Problem with ID ${problemId} not found`);
            return res.status(404).json({
                success: false,
                message: `Problem with ID ${problemId} not found`,
            });
        }

        
        const { title, description, datastructure, algorithm, sourcelink, notes } = req.body;

        if (title) problem.title = title;
        if (description) problem.description = description;
        if (datastructure) problem.datastructure = datastructure;
        if (algorithm) problem.algorithm = algorithm;
        if (sourcelink) problem.sourcelink = sourcelink;
        if (notes) problem.notes = notes;

        await problem.save();

        logger.info(`Updated Problem ID ${problemId}  successfully`);

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
