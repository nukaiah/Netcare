import express from 'express';
import documentTypeSchema from '../Models/DocumentTypeModel.js';
import { sendResponse, sendErrorResponse, sendValidationResponse, sendDuplicateResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const documentTypeRouter = express.Router();

documentTypeRouter.post('/create', checkAuth, async (req, res, next) => {
    try {
        const documentData = req.body;
        const response = await documentTypeSchema.insertOne(documentData);
        return sendResponse(res, true, "Document created successfully", response);
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
        return sendErrorResponse(res, false, error.message);

    }
});

documentTypeRouter.post('/getAll', async (req, res, next) => {
    try {
        const { referTo } = req.body || {};

        const query = referTo ? { referTo } : {};

        const response = await documentTypeSchema.find(query);

        return sendResponse(res, true, "Document found successfully", response);

    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});

export default documentTypeRouter;
