import express from 'express';
import { createBankController, getAllBanksController } from "../Controllers/BankController.js";
import { createBankValidation } from '../Validations/BanksValidation.js';
import validateRequest from '../Utils/Vlaidations.js';
import { checkAuth } from "../Utils/Jwt_Token.js";

const bankRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Banks Master
 *   description: Banks Master APIs
 */


/**
 * @swagger
 * /api/banks/create:
 *   post:
 *     tags: [Banks Master]
 *     summary: Create a bank
 *     description: Creates a new bank with its universal branch code.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBankMasterRequest'
 *     responses:
 *       200:
 *         description: Bank created successfully.
 */
bankRouter.post("/create", checkAuth,validateRequest(createBankValidation), createBankController);

/**
 * @swagger
 * /api/banks/getAll:
 *   get:
 *     tags: [Banks Master]
 *     summary: Get all banks
 *     description: Returns all available banks sorted alphabetically.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Banks fetched successfully.
 */
bankRouter.get("/getAll", checkAuth, getAllBanksController);


export default bankRouter;