import express from 'express';
const otpRouter = express.Router();
import validateRequest from '../Utils/Vlaidations.js';
import { genarateEmailMobileOtpValidation, verifyOtpValidation, resendOtpValidatiion } from "../Validations/OtpValidations.js";
import { saveOtpController, verifyOtpController, resendOtpController } from "../Controllers/OtpController.js";



/**
 * @swagger
 * tags:
 *   - name: OTP
 *     description: OTP Management APIs
 */

/**
 * @swagger
 * /api/otp/generateRegisterOtps:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Generate OTP for registration
 *     description: Generates email and mobile OTPs for a new user registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateRegisterOtpRequest'
 *     responses:
 *       201:
 *         description: OTP generated successfully
 */
otpRouter.post("/generateRegisterOtps", validateRequest(genarateEmailMobileOtpValidation), saveOtpController);

/**
 * @swagger
 * /api/otp/verifyOtp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Verify OTP
 *     description: Verifies the email or mobile OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
otpRouter.post("/verifyOtp", validateRequest(verifyOtpValidation), verifyOtpController);

/**
 * @swagger
 * /api/otp/resendOtp:
 *   post:
 *     tags:
 *       - OTP
 *     summary: Resend OTP
 *     description: Resends a new OTP to the registered email or mobile number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtpRequest'
 *     responses:
 *       202:
 *         description: OTP resent successfully
 */
otpRouter.post("/resendOtp", validateRequest(resendOtpValidatiion), resendOtpController);

export default otpRouter;



