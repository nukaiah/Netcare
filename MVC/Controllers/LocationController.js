import express from 'express';
import locationSchema from "../Models/LocationModel.js";
import { sendErrorResponse, sendResponse, sendValidationResponse, sendDuplicateResponse } from "../MiddleWares/Response.js";
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const locationRouter = express.Router();

locationRouter.post('/createState',checkAuth, async (req, res, next) => {
    try {
        const stateData = req.body || {};
        if (stateData.type != 1) {
            return sendErrorResponse(res, "Type value should be 1");
        }
        const response = await locationSchema.insertOne(stateData);
        return sendResponse(res, true, "State created successfully", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return sendDuplicateResponse(res, `${field} "${value}" already exists`, error.keyValue);
        }
        return sendErrorResponse(res, error.message);
    }
});

locationRouter.post('/createCity', async (req, res, next) => {
    try {
        const cityData = req.body || {};
        if (cityData.type != 2) {
            return sendErrorResponse(res, "Type value should be 2");
        }
        if (!cityData.parentId) {
            return sendErrorResponse(res, "parentId is required to create city");
        }
        const response = await locationSchema.insertOne(cityData);
        return sendResponse(res, true, "City created successfully", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return sendDuplicateResponse(res, `${field} "${value}" already exists`, error.keyValue);
        }
        return sendErrorResponse(res, error.message);
    }
});

locationRouter.post('/getAllLocations',checkAuth, async (req, res, next) => {
    try {
        const { type } = req.body || {};
        const response = await locationSchema.find({ type: type });
        return sendResponse(res, true, "Location found", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});

locationRouter.post("/getAllCity",checkAuth, async (req, res, next) => {
    try {
        const { parentId } = req.body || {};
        const response = await locationSchema.find({ parentId: parentId });
        return sendResponse(res, true, "Location found", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});

export default locationRouter;