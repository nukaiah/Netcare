import express from 'express';
const addressRouter = express.Router();
import getByIdValidation from '../Validations/GetByIdValidation.js';
import validateRequest from '../Utils/Vlaidations.js';
import getByUserIdValidation from '../Validations/GetByUserIdValidation.js';


import { AddressValidation, updateAddressValidation } from '../Validations/AddressValidation.js';
import { createAddressController, getAddressByIdController, getAddressByUserIdController, updateAddressController } from '../Controllers/AddressController.js';
import { checkAuth } from '../Utils/Jwt_Token.js';

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management APIs
 */


/**
 * @swagger
 * /api/address/create:
 *   post:
 *     tags:
 *       - Address
 *     summary: Create Address
 *     description: Create a new address for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddressRequest'
 *     responses:
 *       200:
 *         description: Address created successfully.
 */
addressRouter.post("/create",checkAuth,validateRequest(AddressValidation),createAddressController);


/**
 * @swagger
 * /api/address/getById:
 *   post:
 *     tags:
 *       - Address
 *     summary: Get Address By ID
 *     description: Fetch an address using its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetByIdRequest'
 *     responses:
 *       200:
 *         description: Address fetched successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
addressRouter.post("/getById",checkAuth,validateRequest(getByIdValidation),getAddressByIdController);


/**
 * @swagger
 * /api/address/getByUserId:
 *   post:
 *     tags:
 *       - Address
 *     summary: Get Address By User ID
 *     description: Fetch address details of a specific user.
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
 *         description: Address fetched successfully.
 */
addressRouter.post("/getByUserId",checkAuth,validateRequest(getByUserIdValidation),getAddressByUserIdController);


/**
 * @swagger
 * /api/address/update:
 *   put:
 *     tags:
 *       - Address
 *     summary: Update Address
 *     description: Update an existing address.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddressRequest'
 *     responses:
 *       200:
 *         description: Address updated successfully.
 */
addressRouter.put("/update",checkAuth,validateRequest(updateAddressValidation),updateAddressController);


export default addressRouter;