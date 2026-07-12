import express from 'express';
const authenticationRouter = express.Router();
import { registrationController, loginController, forgotPasswordController, resetPasswordController, updatePasswordController, inserMultipleController, getAllUsersController } from '../Controllers/AuthenticationController.js';
import { registerValidationSchema, loginValidationSchema, forgotPasswordValidation, resetPasswordValidation, updatePasswordValidation } from '../Validations/AuthenticationValidation.js';
import validateRequest from '../Utils/Vlaidations.js';



/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication and Authorization APIs
 */

/**
 * @swagger
 * /api/authentication/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authenticationRouter.post('/register', validateRequest(registerValidationSchema), registrationController);

/**
 * @swagger
 * /api/authentication/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login an existing user
 *     description: Authenticates a user and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
authenticationRouter.post('/login', validateRequest(loginValidationSchema), loginController);

/**
 * @swagger
 * /api/authentication/forgotPassword:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Forgot Password
 *     description: Sends a password reset OTP or link to the user's registered email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authenticationRouter.post('/forgotPassword', validateRequest(forgotPasswordValidation), forgotPasswordController);

/**
 * @swagger
 * /api/authentication/resetPassword:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset Password
 *     description: Resets the user's password using a valid OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
authenticationRouter.post('/resetPassword',validateRequest(resetPasswordValidation),resetPasswordController);


authenticationRouter.post('/updatePassword', validateRequest(updatePasswordValidation), updatePasswordController);
authenticationRouter.post('/mutiple', inserMultipleController);
authenticationRouter.get('/getAllHospitals', getAllUsersController);


export default authenticationRouter;



