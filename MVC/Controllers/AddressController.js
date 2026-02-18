import express from 'express';
import addressSchema from '../Models/AddressModel.js'
import { sendResponse, sendErrorResponse, sendValidationResponse, sendDuplicateResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const addressRouter = express.Router();
import sendNotification from "../MiddleWares/fcm.js";


addressRouter.post("/insertUpdate", async (req, res, next) => {
    try {
        const {sId,...addressData} = req.body;
        let response;
        if (!sId) {
            response = await addressSchema.insertOne(addressData);
            return sendResponse(res, true, "Address added successfully", response);
        }
        else {
            response = await addressSchema.findByIdAndUpdate(sId, { $set: addressData}, { new: true, runValidators: true });
            return sendResponse(res, true, "Address updated successfully", response);

        }
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return sendDuplicateResponse(res, "Duplicate address found", error.keyValue);
        }
        return sendErrorResponse(res, false, error.message, {});
    }

});

addressRouter.get("/getAll",async(req,res,next)=>{
    try {
        const response = await addressSchema.find();
        return sendResponse(res, true, "Address added successfully", response);
    } catch (error) {
        return sendErrorResponse(res, false, error.message, {})
    }
});

addressRouter.post("/notifyme",async(req,res,next)=>{
    sendNotification("cAwo682mQDO7bhlaoZ4OBG:APA91bGCpuXNnL9adA06ufLHsTfPJ1NAibWAcInOmdXOmB54h_ILashjyVgtTVWcn2jI41kdc6K4qd0mHy7xCWgNSB9rTgU6AjaphEb1HQE3ztRCDJ4vqM8","ShiftMatch","Hey you have new shift available.Please check your que");
});

export default addressRouter;