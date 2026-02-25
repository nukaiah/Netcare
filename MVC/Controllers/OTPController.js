import express from 'express';
import otpSchema from '../Models/OTPModel.js'
const otpRouter = express.Router();
import crypto from 'crypto';
import { sendDuplicateResponse, sendErrorResponse, sendResponse, sendValidationResponse } from '../MiddleWares/Response.js';
import healthCareWorkerSchema from '../Models/HealthCareWorkerModel.js';
import { sendEmail } from '../MiddleWares/Email.js';
import otpTemplate from "../MiddleWares/EmailotpTemplate.js";


otpRouter.post('/generateOtp', async (req, res, next) => {
    try {
        const { email, mobileNumber } = req.body || {};
        const cleanEmail = email?.trim().toLowerCase();
        const cleanMobile = mobileNumber?.trim();

        if (!cleanEmail) {
            return sendValidationResponse(res, [{ field: 'email', message: 'Email cannot be empty' }]);
        }
        if (!cleanMobile) {
            return sendValidationResponse(res, [{ field: 'mobileNumber', message: 'Mobile number cannot be empty' }]);
        }

        if (!healthCareWorkerSchema.validateEmail(cleanEmail)) {
            return sendValidationResponse(res, [{ field: 'email', message: `${cleanEmail} is not a valid email` }]);
        }

        if (!healthCareWorkerSchema.validateMobileNumber(cleanMobile)) {
            return sendValidationResponse(res, [{ field: 'mobileNumber', message: `${cleanMobile} is not a valid mobile number` }]);
        }

        const existingUser = await healthCareWorkerSchema.findOne({ $or: [{ "email": cleanEmail }, { "mobileNumber": cleanMobile }] });

        if (existingUser) {
            if (existingUser.email === cleanEmail) {
                return sendDuplicateResponse(res, "Email already existed");
            }
            if (existingUser.mobileNumber === cleanMobile) {
                return sendDuplicateResponse(res, "Mobile number already existed");
            }
            return sendDuplicateResponse(res, "Email/Mobile is already existed")
        }
        await otpSchema.deleteMany({
            $or: [
                { emailMobile: cleanEmail, type: "Register", isUsed: false },
                { emailMobile: cleanMobile, type: "Register", isUsed: false }
            ]
        });

        const emailOtp = crypto.randomInt(100000, 1000000);
        const mobileOtp = crypto.randomInt(100000, 1000000);
        const data = [{
            type: "Register",
            mode: "Email",
            emailMobile: cleanEmail,
            otp: emailOtp.toString(),
            expireDate: new Date(Date.now() + 10 * 60 * 1000),
        }, {
            type: "Register",
            mode: "Mobile",
            emailMobile: cleanMobile,
            otp: "123456",
            expireDate: new Date(Date.now() + 10 * 60 * 1000),
        }]

        const response = await otpSchema.insertMany(data);
        // Email OTP 
        const template = otpTemplate(emailOtp, cleanEmail);
        const emailResponse = await sendEmail(cleanEmail, template.subject, template.html);

        // Mobile OTP
        // await sendSms(cleanMobile, mobileOtp);
        return sendResponse(res, true, "OTP sent sucessfully");
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});

otpRouter.post('/resendOtp', async (req, res, next) => {

    try {
        const { mode, emailMobile } = req.body || {};

        if (!mode) return sendValidationResponse(res, "Mode is missing");

        if (!emailMobile) return sendValidationResponse(res, `${mode === "Email" ? "Email is missing" : "Mobile is missing"}`);

        await otpSchema.deleteMany({ emailMobile: emailMobile, type: "Register", isUsed: false });

        const otp = crypto.randomInt(100000, 1000000);
        const data = {
            type: "Register",
            mode: mode,
            emailMobile: emailMobile,
            otp: mode==="Email"?otp.toString():"123456",
            expireDate: new Date(Date.now() + 10 * 60 * 1000),
        };

        const response = await otpSchema.create(data);

        if (mode === "Email") {
            const template = otpTemplate(otp, emailMobile);
            const emailResponse = await sendEmail(emailMobile, template.subject, template.html);
        }
        if (mode === "Mobile") {
            // sending is in pogress
        }
        return sendResponse(res, `Otp sent to your ${mode} sucessfully`);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});

otpRouter.post("/verifyOtp", async (req, res, next) => {

    try {

        const { mode, emailMobile, otp } = req.body || {};

        if (!mode) return sendValidationResponse(res, "Mode is missing");

        if (!emailMobile) return sendValidationResponse(res, "Email is missing");

        if (!otp) return sendValidationResponse(res, "OTP is missing");

        const otpDoc = await otpSchema.findOne({ "mode": mode, "otp": otp, "emailMobile": emailMobile });

        if (!otpDoc) return sendErrorResponse(res, "Invalid OTP or already used");

        if (otpDoc.isUsed) return sendErrorResponse(res, "OTP already used")

        const now = new Date();

        if (otpDoc.expireDate < now) return sendErrorResponse(res, "OTP has expired");

        if (otpDoc.otp !== otp) return sendErrorResponse(res, "OTP  not matched");

        const response = await otpSchema.findByIdAndUpdate(otpDoc._id, { $set: { isUsed: true } });

        return sendResponse(res, true, "Otp verified sucessfully");
    } catch (error) {

        return sendErrorResponse(res, error.message);

    }
});


export default otpRouter;