import express from 'express';
import documentSchema from '../Models/DocumentsModel.js';
import { sendErrorResponse, sendResponse, sendValidationResponse, sendDuplicateResponse } from '../MiddleWares/Response.js';
import upload from '../MiddleWares/UploadFile.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import mongoose from 'mongoose';

const documentRouter = express.Router();



documentRouter.post("/upload", checkAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded");
    }
    const data1 = {
      "documentUrl": req.file.filename
    };
    const docData = { ...data1, ...req.body };
    const response = await documentSchema.insertOne(docData);
    return sendResponse(res, true, "File uploaded successfully", response);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendValidationResponse(res, messages);
    }
    if (error.code === 11000) {
      return sendDuplicateResponse(res, "File already exists", error.keyValue);
    }
    return sendErrorResponse(res, error.message);
  }
});

documentRouter.post("/getAll", checkAuth, async (req, res, next) => {
  try {
    var query = { "hospitalId": req.body.id };
    const response = await documentSchema.find(query);
    return sendResponse(res, true, "Documents found", response);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
});

documentRouter.post("/verify", checkAuth, async (req, res, next) => {
  try {
    var query = { _id: req.body.id };
    var updateData = { "verificationStatus": req.body.verificationStatus, "verifiedBy": req.userId, "verifiedAt": new Date(), "rejectionReason": req.body.rejectionReason }
    const response = await documentSchema.findByIdAndUpdate(query, { $set: updateData }, { upsert: true });
    return sendResponse(res, true, "Status got changed", response);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }

});


documentRouter.post('/delete', async (req, res, next) => {
  try {
    const response = await documentSchema.findByIdAndUpdate(sId, { $set: { documentUrl: documentUrl } }, { runValidators: true, new: true });
    return sendResponse(res, true, "File updated", response);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
});



export default documentRouter;