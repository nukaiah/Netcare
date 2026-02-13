import express from 'express';
import deparmentSchema from '../Models/DepartmentModel.js';
import { sendDuplicateResponse, sendErrorResponse, sendResponse, sendValidationResponse } from '../MiddleWares/Response.js';
const departmentRouter = express.Router();
import { checkAuth } from '../MiddleWares/CheckAuth.js';


departmentRouter.post('/create', checkAuth, async (req, res, next) => {
    try {
        const {sId,...data} = req.body;
        var response = await deparmentSchema.insertOne(data);
        return sendResponse(res, true, "Deparment created successfully", response);
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


departmentRouter.get("/getAll", async (req, res, next) => {
    try {
        const response = await deparmentSchema.find();
        return sendResponse(res, true, "Deparments found successfully", response);
    } catch (error) {
        console.log(error.message);
        return sendErrorResponse(res, false, error.message);
    }
});

export default departmentRouter;