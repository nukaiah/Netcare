import { createAvailabilityController, getAvailabilityController } from "../Controllers/AvailabilityController.js";
import express from 'express';
import { checkAuth } from "../../MVC/MiddleWares/CheckAuth.js";
import validateRequest from "../Utils/Vlaidations.js";
import { createAvailabilityValidation } from "../Validations/AvaialbilityValidation.js";
import getByUserIdValidation from "../Validations/GetByUserIdValidation.js";
const availabilityRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Availability Management APIs
 */


/**
 * @swagger
 * /api/availability/create:
 *   post:
 *     tags:
 *       - Availability
 *     summary: Create or update availability
 *     description: Creates or updates the authenticated user's weekly availability.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAvailabilityRequest'
 *     responses:
 *       201:
 *         description: Availability created successfully.
 */
availabilityRouter.post("/create", checkAuth, validateRequest(createAvailabilityValidation), createAvailabilityController);


/**
 * @swagger
 * /api/availability/getAvailability:
 *   post:
 *     tags:
 *       - Availability
 *     summary: Get availability
 *     description: Returns the availability details for a specific user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetCurrentUserRequest'
 *     responses:
 *       200:
 *         description: Availability fetched successfully.
 */
availabilityRouter.post("/getAvailability", checkAuth, validateRequest(getByUserIdValidation), getAvailabilityController);

export default availabilityRouter;