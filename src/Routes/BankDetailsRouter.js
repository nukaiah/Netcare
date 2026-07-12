import express from 'express';
const bankDetailsRouter = express.Router();

import validateRequest from '../Utils/Vlaidations.js';
import getByIdValidation from '../Validations/GetByIdValidation.js';
import getByUserIdValidation from '../Validations/GetByUserIdValidation.js';
import {createBankDetailsController,getBankDetailsByIdController,getBankDetailsByUserIdController,updateBankDetailsController} from '../Controllers/BankDetailsController.js';
import { BankValidation, updateBankValidation } from '../Validations/BankDetailsValidations.js';
import { checkAuth } from "../Utils/Jwt_Token.js";

/**
 * @swagger
 * tags:
 *   name: Bank Details
 *   description: Bank Details Management APIs
 */

/**
 * @swagger
 * /api/bankDetails/create:
 *   post:
 *     tags: [Bank Details]
 *     summary: Create bank details
 *     description: Creates bank details for a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBankRequest'
 *     responses:
 *       200:
 *         description: Bank details created successfully.
 */
bankDetailsRouter.post("/create",checkAuth,validateRequest(BankValidation),createBankDetailsController);

// /**
//  * @swagger
//  * /api/bank/getById:
//  *   post:
//  *     tags: [Bank]
//  *     summary: Get bank details by ID
//  *     description: Retrieves bank details using the bank record ID.
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/GetByIdRequest'
//  *     responses:
//  *       200:
//  *         description: Bank details fetched successfully.
//  *       401:
//  *         description: Unauthorized.
//  */
// bankRouter.post(
//     "/getById",
//     checkAuth,
//     validateRequest(getByIdValidation),
//     getBankDetailsByIdController
// );

// /**
//  * @swagger
//  * /api/bank/getByUserId:
//  *   post:
//  *     tags: [Bank]
//  *     summary: Get bank details by user ID
//  *     description: Retrieves bank details for a specific user.
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/GetByUserIdRequest'
//  *     responses:
//  *       200:
//  *         description: Bank details fetched successfully.
//  *       401:
//  *         description: Unauthorized.
//  */
// bankRouter.post(
//     "/getByUserId",
//     checkAuth,
//     validateRequest(getByUserIdValidation),
//     getBankDetailsByUserIdController
// );

/**
 * @swagger
 * /api/bankDetails/update:
 *   put:
 *     tags: [Bank Details]
 *     summary: Update bank details
 *     description: Updates existing bank details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBankRequest'
 *     responses:
 *       200:
 *         description: Bank details updated successfully.
 */
bankDetailsRouter.put("/update",checkAuth,validateRequest(updateBankValidation),updateBankDetailsController);

export default bankDetailsRouter;