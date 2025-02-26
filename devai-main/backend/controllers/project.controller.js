import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import { createProject as createProjectService } from "../services/project.service.js";  // ✅ Renamed import

export const createProject = async (req, res) => { 
    const errors = validationResult(req);           
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {    
        const { name } = req.body;

        // Find the logged-in user
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        // If user is not found
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = loggedInUser._id;  

        // Create a new project using the service function
        const newProject = await createProjectService({ name, userId });

        // Send the response
        res.status(201).json(newProject);            

    } catch (error) { 
        console.error(error);    
        res.status(500).json({ message: "Internal Server Error", error: error.message });    
    }   
};

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}