/*
import express from 'express';
import documentSchema from '../Models/DocumentsModel.js';
import { sendErrorResponse, sendResponse, sendValidationResponse, sendDuplicateResponse, sendNotFoundResponse } from '../MiddleWares/Response.js';
import upload from '../MiddleWares/UploadFile.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import mongoose from 'mongoose';
import { deleteFile } from '../MiddleWares/UploadFile.js';
import { sendEmail } from '../MiddleWares/Email.js';
import { documentRejectedTemplate } from "../MiddleWares/EmailotpTemplate.js";

const documentRouter = express.Router();



documentRouter.post("/upload", checkAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded");
    }
    const data = {
      "documentUrl": req.file.filename
    };
    const docData = { ...data, ...req.body };
    const response = await documentSchema.create(docData);
    return sendResponse(res, true, "File uploaded successfully", response);
  } catch (error) {
    if (req.file) {
      try {
        deleteFile(`uploads/${req.file.filename}`);
      } catch (error) {

      }
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return sendValidationResponse(res, messages);
    }
    if (error.code === 11000) {
      return sendDuplicateResponse(res, "Document already uploaded", error.keyValue);
    }
    return sendErrorResponse(res, error.message);
  }
});


documentRouter.post("/getAll", async (req, res, next) => {
  try {
    var query = { "hospitalId": new mongoose.Types.ObjectId(req.body.id) };
    const response = await documentSchema.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: "documenttypes",
          as: "documenttypesData",
          localField: "documentTypeId",
          foreignField: "_id"
        }
      },
      { $unwind: { path: "$documenttypesData", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          documentName: "$documenttypesData.documentName",
        }
      },
      { $project: { documenttypesData: 0 } }
    ]
    );
    return sendResponse(res, true, "Documents found", response);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
});


documentRouter.post("/verify", checkAuth, async (req, res, next) => {
  try {
    const { id, verificationStatus, rejectionReason, email, documentName, facilityName } = req.body || {};
    const updateData = { "verificationStatus": verificationStatus, "verifiedBy": req.userId, "verifiedAt": new Date(), "rejectionReason": rejectionReason }
    const response = await documentSchema.findByIdAndUpdate({ _id: id }, { $set: updateData }, { upsert: true });
    if (verificationStatus === "Rejected") {
      const template = documentRejectedTemplate(facilityName, documentName, rejectionReason);
      await sendEmail(email, template.subject, template.html);
    }
    return sendResponse(res, true, "Status got changed", response);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
});


documentRouter.post('/deleteFile', async (req, res) => {
  try {
    const { sId } = req.body || {};

    if (!sId) {
      return sendValidationResponse(res, ["Document ID is required"]);
    }
    console.log(sId);

    const response = await documentSchema.findByIdAndUpdate(
      sId,
      { $set: { documentUrl: null } },
      { runValidators: true, new: true }
    );
    if (!response) {
      return sendNotFoundResponse(res, "Document not found");
    }

    if (response.documentUrl) {
      deleteFile(`uploads/${existedData.documentUrl}`);
    }

    return sendResponse(res, true, "File deleted successfully", response);

  } catch (error) {
    return sendErrorResponse(res,error.message);
  }
});


documentRouter.post("/updateFile", upload.single("file"), async (req, res) => {
  try {

    const { sId } = req.body || {};
    if (!sId) {
      if (req.file) {
        deleteFile(`uploads/${req.file.filename}`);
      }
      return sendValidationResponse(res, ["Document ID is required"]);
    }
    if (!req.file) {
      return sendValidationResponse(res, ["No file uploaded"]);
    }

    const oldDocument = await documentSchema.findByIdAndUpdate(
      sId,
      { $set: { documentUrl: req.file.filename, verificationStatus: "ReUploaded" } },
      { new: false,runValidators:true }
    );
    console.log(oldDocument);
    

    if (!oldDocument) {
      deleteFile(`uploads/${req.file.filename}`);
      return sendNotFoundResponse(res, "Document not found");
    }
    if (oldDocument.documentUrl) {
        deleteFile(`uploads/${oldDocument.documentUrl}`);
    }

    return sendResponse(res, true, "Document updated successfully");

  } catch (error) {
    deleteFile(`uploads/${req.file.filename}`);
    return sendErrorResponse(res, error.message);
  }
}
);


documentRouter.post('/updateDetails', async (req, res) => {
  try {
    const { sId, issuedBy, issueDate, expiryDate } = req.body || {};

    if (!sId) {
      return sendValidationResponse(res, ["Document ID is required"]);
    }

    const updateData = {};

    if (issuedBy !== undefined) updateData.issuedBy = issuedBy;
    if (issueDate !== undefined) updateData.issueDate = issueDate;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    updateData.verificationStatus = "ReUploaded";

    const response = await documentSchema.findByIdAndUpdate(
      sId,
      { $set: updateData },
      { runValidators: true, new: true }
    );

    if (!response) {
      return sendNotFoundResponse(res, "Document not found");
    }

    return sendResponse(res, true, "Document updated successfully", response);

  } catch (error) {
    return sendErrorResponse(res, "Something went wrong");
  }
});



export default documentRouter;

*/