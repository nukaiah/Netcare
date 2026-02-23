import express from 'express';
import qualificationSchema from '../Models/QualifaicationModel.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import upload from '../MiddleWares/UploadFile.js';
import { deleteFile } from '../MiddleWares/UploadFile.js';
import { sendErrorResponse, sendResponse, sendValidationResponse } from '../MiddleWares/Response.js';
const qualificationRouter = express.Router();


qualificationRouter.post('/insert', checkAuth, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return sendErrorResponse(res, "No file uploaded");
        }
        const data1 = {
            "documentUrl": req.file.filename
        };
        const docData = { ...data1, ...req.body };
        const response = await qualificationSchema.insertOne(docData);
        return sendResponse(res, true, "Qualification added successfully", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        return sendErrorResponse(res, error.message);
    }
});


qualificationRouter.delete('/delete', checkAuth, async (req, res, next) => {
    try {
        const { sId } = req.body;
        if (!sId) {
            return sendErrorResponse(res, "Qualification ID is required");
        }
        const response = await qualificationSchema.findById(sId);
        if (!response) {
            return sendErrorResponse(res, "Qualification not found");
        }

        if (response.documentUrl) {
            deleteFile(`uploads/${response.documentUrl}`);
        }
        const deleteResponse = await qualificationSchema.findByIdAndDelete(sId);
        return sendResponse(res, true, "Qualification deleted successfully", deleteResponse);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


qualificationRouter.post('/update', checkAuth, async (req, res, next) => {
    try {
        const data = req.body || {};
        const response = await qualificationSchema.findByIdAndUpdate({ _id: req.body.sId }, { $set: data }, { new: true, runValidators: true });
        return sendResponse(res, true, "Qualification updated successfully", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


qualificationRouter.post('/updateFile', checkAuth, upload.single("file"), async (req, res, next) => {
    try {

        const { sId } = req.body || {};

        if (!sId) {
            return sendErrorResponse(res, "Qualification id is required");
        }

        if (!req.file) {
            return sendErrorResponse(res, "No file uploaded");
        }

        const existingQualification = await qualificationSchema.findById(sId);

        if (!existingQualification) {
            return sendErrorResponse(res, "Experience not found");
        }

        if (existingQualification.documentUrl) {
            deleteFile(`uploads/${existingQualification.documentUrl}`);
        }

        const response = await qualificationSchema.findByIdAndUpdate(sId, { $set: { documentUrl: req.file.filename } }, { new: true, runValidators: true });
        return sendResponse(res, true, "Qualification updated successfully", response);
    } catch (error) {

        return sendErrorResponse(res, error.message);
    }
});


qualificationRouter.post('/deleteFile', checkAuth, async (req, res, next) => {
    try {
        const { sId } = req.body || {};
        if (!sId) {
            return sendErrorResponse(res, "Qualification id is required");
        }
        const existingResponse = await qualificationSchema.findById(sId);
        if (!existingResponse) {
            return sendErrorResponse(res, "Qualification not found");
        }

        if (existingResponse.documentUrl) {
            deleteFile(`uploads/${existingResponse.documentUrl}`);
        }
        const response = await qualificationSchema.findByIdAndUpdate(sId, { $set: { documentUrl: "" } }, { new: true });
        return sendResponse(res, true, "Qulification file deleted successfully", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


export default qualificationRouter;