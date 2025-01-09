import Problem from "../models/Problem.model.js";
import logger from "../utils/logger.js";
import { validateCreateProblem } from "../utils/validateData.js";

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

export const findAllProblem = async(req,res)=>{
    try {
        
    } catch (error) {
        logger.error("Error finding All Problem",error);
        res.status(500).send({
            success:false,
            message:"Error finding All Problem"
        });
    }
}
export const findProblem = async(req,res)=>{
try {
    
} catch (error) {
    logger.error("Error finding  Problem",error);
        res.status(500).send({
            success:false,
            message:"Error finding  Problem"
        });
}
}
export const deleteProblem = async(req,res)=>{
try {
    
} catch (error) {
    logger.error("Error deleting problem",error);
        res.status(500).send({
            success:false,
            message:"Error Deleting problem"
        });
}
}

export const updateProblem = async(req,res)=>{
    try {
        
    } catch (error) {
        logger.error("Error updating problem",error);
            res.status(500).send({
                success:false,
                message:"Error Deleting problem"
            });
    }
    }