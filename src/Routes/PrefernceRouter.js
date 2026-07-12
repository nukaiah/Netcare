import express from "express";
import { checkAuth } from "../Utils/Jwt_Token.js";
import { createPreferenceController, updatePreferenceController } from "../Controllers/PreferenceController.js";
import validateRequest from "../Utils/Vlaidations.js";
import { PreferenceValidation, updatePreferenceValidation } from "../Validations/PreferenceValidation.js"
const preferenceRouter = express.Router();



/**
 * @swagger
 * tags:
 *   name: Preference
 *   description: Preference Management APIs
 */


/**
 * @swagger
 * /api/preference/create:
 *   post:
 *     tags:
 *       - Preference
 *     summary: Create user preferences
 *     description: Creates shift, department, and location preferences for a healthcare worker.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePreferenceRequest'
 *     responses:
 *       201:
 *         description: Preferences created successfully.
 */
preferenceRouter.post('/create', checkAuth, validateRequest(PreferenceValidation), createPreferenceController);

/**
 * @swagger
 * /api/preference/update:
 *   put:
 *     tags:
 *       - Preference
 *     summary: Update user preferences
 *     description: Updates the authenticated user's shift, department, and location preferences.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePreferenceRequest'
 *     responses:
 *       200:
 *         description: Preferences updated successfully.
 */
preferenceRouter.put('/update', checkAuth, validateRequest(updatePreferenceValidation), updatePreferenceController);

export default preferenceRouter;