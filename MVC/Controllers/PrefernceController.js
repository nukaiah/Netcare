// import express from 'express';
// import preferenceSchema from '../Models/PreferenceModel.js'
// import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from "../MiddleWares/Response.js";
// const preferenceRouter = express.Router();

// preferenceRouter.post("/create", async (req, res, next) => {
//     try {
//         const  { sId, ...payload } = req.body || {};
    
//         let response;

//         if (!sId) {
//             response = await preferenceSchema.insertOne(payload);
//             return sendResponse(res, true, "Prefernce created", response);
//         }
//         else {
//             response = await preferenceSchema.findByIdAndUpdate(sId,{$set:payload},{runValidators:true,new:true});
//             return sendResponse(res, true, "Prefernce details updated", response);

//         }

//     } catch (error) {
//         if (error.name === "ValidationError") {
//             const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
//             return sendValidationResponse(res, errors);
//         }
//         if (error.code === 11000) {
//             const field = Object.keys(error.keyValue)[0];
//             const value = error.keyValue[field];
//             return sendDuplicateResponse(res, "Preference already exists to you", error.keyValue);
//         }
//         return sendErrorResponse(res, error.message);
//     }
// });



// export default preferenceRouter;