import { Router } from "express";
import { body } from "express-validator";
import * as projectController from '../controllers/project.controller.js';
const router = Router();    // Create a new

router.post('/create',
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
    
)

export default router;
