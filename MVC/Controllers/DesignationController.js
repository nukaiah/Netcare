import express from 'express';
import designationSchema from "../Models/DesignationsModel.js";
import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const designationRouter = express.Router();


designationRouter.post("/createUpdate",checkAuth, async (req, res, next) => {
    try {
        const { sId, ...data } = req.body || {};
        let response;
        if (sId) {
            response = await designationSchema.findByIdAndUpdate(sId, { $set: data });
            return sendResponse(res, true, "updated successfully", response);
        }
        response = await designationSchema.create(req.body);
        return sendResponse(res, true, "created successfully", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return sendDuplicateResponse(res, "Duplicate detials found", error.keyValue);
        }
        return sendErrorResponse(res, error.message);
    }
});

designationRouter.get('/getAll',checkAuth,async(req,res,next)=>{
    try {
        const response = await designationSchema.find();
        return sendResponse(res,true,"Data found",response);
    } catch (error) {
        return sendErrorResponse(res,error.message);
    }
});


export default designationRouter;