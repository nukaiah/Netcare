import express from 'express';
import experienceSchema from '../Models/ExperianceModel.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import { sendValidationResponse, sendErrorResponse, sendResponse, sendNotFoundResponse } from '../MiddleWares/Response.js';
import { deleteFile } from '../MiddleWares/UploadFile.js';
import upload from '../MiddleWares/UploadFile.js';
import mongoose from 'mongoose';
const experienceRouter = express.Router();

experienceRouter.post('/insert', checkAuth, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return sendErrorResponse(res, false, "No file uploaded");
        }
        const data1 = {
            "documentUrl": req.file.filename
        };
        const docData = { ...data1, ...req.body };
        const response = await experienceSchema.insertOne(docData);
        return sendResponse(res, true, "Experiance added successfully", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        return sendErrorResponse(res, error.message);
    }
});


experienceRouter.post('/update', checkAuth, async (req, res, next) => {
    try {
        const {sId,data} = req.body || {};
        if (!sId) {
            return sendErrorResponse(res, "Experience ID is required");
        }

        if (!data || Object.keys(data).length === 0) {
            return sendErrorResponse(res, "Update data is required");
        }
        const response = await experienceSchema.findByIdAndUpdate(sId, { $set: data }, { new: true, runValidators: true });
        return sendResponse(res, true, "Experiance updated successfully", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


experienceRouter.delete('/delete', checkAuth, async (req, res, next) => {
    try {
        const { sId } = req.body;
        if (!sId) {
            return sendErrorResponse(res, "Experience ID is required");
        }
        const response = await experienceSchema.findById(sId);
        if (!response) {
            return sendErrorResponse(res, "Experience not found");
        }

        if (response.documentUrl) {
            deleteFile(`uploads/${response.documentUrl}`);
        }
        const deleteResponse = await experienceSchema.findByIdAndDelete(sId);
        return sendResponse(res, true, "Experiance updated successfully", deleteResponse);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});



experienceRouter.post('/insertNoFile', checkAuth, async (req, res, next) => {
    try {
        const docData = req.body;
        const response = await experienceSchema.insertOne(docData);
        return sendResponse(res, true, "Experiance added successfully", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        return sendErrorResponse(res, error.message);
    }
});



experienceRouter.post('/updateFile', checkAuth, upload.single("file"), async (req, res, next) => {
    try {

        const sId = req.body;


        if (!sId) {
            return sendErrorResponse(res, "Experience ID is required");
        }

        if (!req.file) {
            return sendErrorResponse(res, "No file uploaded");
        }

        const existingExperience = await experienceSchema.findById(sId);


        if (!existingExperience) {
            return sendErrorResponse(res, "Experience not found");
        }

        if (existingExperience.documentUrl) {
            deleteFile(`uploads/${existingExperience.documentUrl}`);
        }

        const response = await experienceSchema.findByIdAndUpdate(sId, { $set: { documentUrl: req.file.filename } }, { new: true, runValidators: true });
        return sendResponse(res, true, "Experiance updated successfully", response);
    } catch (error) {

        return sendErrorResponse(res, error.message);
    }
});


experienceRouter.post('/deleteFile', checkAuth, async (req, res, next) => {
    try {
        const { sId } = req.body || {};
        if (!sId) {
            return sendErrorResponse(res, "Experience ID is required");
        }
        const existingResponse = await experienceSchema.findById(sId);

        if (!existingResponse) {
            return sendErrorResponse(res, "Experience not found");
        }

        if (existingResponse.documentUrl) {
            deleteFile(`uploads/${existingResponse.documentUrl}`);
        }

        const response = await experienceSchema.findByIdAndUpdate(sId, { $set: { documentUrl: "" } }, { new: true });

        return sendResponse(res, true, "Experiance file deleted successfully", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});




export default experienceRouter;