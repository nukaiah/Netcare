import express from 'express';
const locationRouter = express.Router();

import { createStateController, createCityController, getAllLocationsController, getAllCityController, updateStateController, updateCityController } from '../Controllers/LocationController.js';
import validateRequest from '../Utils/Vlaidations.js';
import { createStateValidation, createCityValidation, locationTypeValidation, getAllCityValidation, updateCityValidation, updateStateValidation } from '../Validations/LocationValidation.js';
import { checkSuperAdmin, checkAuth } from '../Utils/Jwt_Token.js';


/**
 * @swagger
 * tags:
 *   name: Location
 *   description: State and City Management APIs
 */


/**
 * @swagger
 * /api/location/createState:
 *   post:
 *     tags: [Location]
 *     summary: Create a new state
 *     description: Creates a new state in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStateRequest'
 *     responses:
 *       200:
 *         description: State created successfully.
 */
locationRouter.post("/createState", checkAuth,checkSuperAdmin, validateRequest(createStateValidation), createStateController);


/**
 * @swagger
 * /api/location/updateState:
 *   patch:
 *     summary: Update State
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStateRequest'
 *     responses:
 *       200:
 *         description: State updated successfully
 */
locationRouter.patch("/updateState", checkAuth,checkSuperAdmin, validateRequest(updateStateValidation), updateStateController);


/**
 * @swagger
 * /api/location/createCity:
 *   post:
 *     tags: [Location]
 *     summary: Create a new city
 *     description: Creates a city under a state.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCityRequest'
 *     responses:
 *       200:
 *         description: City created successfully.
 */
locationRouter.post("/createCity", checkAuth,checkSuperAdmin, validateRequest(createCityValidation), createCityController);


/**
 * @swagger
 * /api/location/updateCity:
 *   patch:
 *     summary: Update City
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCityRequest'
 *     responses:
 *       200:
 *         description: City updated successfully
 */
locationRouter.patch("/updateCity", checkAuth,checkSuperAdmin, validateRequest(updateCityValidation), updateCityController);


/**
 * @swagger
 * /api/location/getAllLocations:
 *   post:
 *     tags: [Location]
 *     summary: Get all locations
 *     description: Returns all locations based on the requested type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetAllLocationsRequest'
 *     responses:
 *       200:
 *         description: Locations fetched successfully.
 */
locationRouter.post("/getAllLocations", checkAuth, validateRequest(locationTypeValidation), getAllLocationsController);


/**
 * @swagger
 * /api/location/getAllCity:
 *   post:
 *     tags: [Location]
 *     summary: Get all cities by state
 *     description: Returns all cities for the specified state.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetAllCityRequest'
 *     responses:
 *       200:
 *         description: Cities fetched successfully.

 */
locationRouter.post("/getAllCity", checkAuth, validateRequest(getAllCityValidation), getAllCityController);


export default locationRouter;