// import express from 'express';
// import avaialabilitySchema from '../Models/AvaialabilityModel.js';
// import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
// import { checkAuth } from '../MiddleWares/CheckAuth.js'
// const availabilityRouter = express.Router();

// availabilityRouter.post("/create", async (req, res, next) => {
//     try {
//         const data = req.body || {};
//         const response = await avaialabilitySchema.insertMany(data, { ordered: false });
//         return sendResponse(res, true, "Created successfully", response);
//     } catch (error) {
//         if (error.name === "ValidationError") {
//             const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
//             return sendValidationResponse(res, errors);
//         }
//         if (error.code === 11000) {
//             return sendDuplicateResponse(res, "Shifts already exists");
//         }
//         return sendErrorResponse(res, error.message);
//     }
// });


// availabilityRouter.post('/getAvailability', checkAuth, async (req, res, next) => {
//     try {
//         var query = { userId: req.userId };
//         var response = await avaialabilitySchema.find(query);
//         return sendResponse(res, true, "Data found", response);
//     } catch (error) {
//         return sendErrorResponse(res, error.message);
//     }
// });


// export default availabilityRouter;