import express from 'express';
const userRouter = express.Router();

import validateRequest from '../Utils/Vlaidations.js';
import getByIdValidation from '../Validations/GetByIdValidation.js';
import { getUserDataByIdController, getWebUserDataByIdController,userDataUpdateController, updateProfileController, updateFcmController, getAllUsersController,updateVerificationStatusController } from "../Controllers/UserController.js";
import getByUserIdValidation from "../Validations/GetByUserIdValidation.js"
import { userUpdateValidationSchema, updateFcmTokenValidation,getUsersValidation,userStatusValidation } from "../Validations/UserValidations.js";
import { createUpload } from '../Utils/UploadFile.js';
const uploadProfileImage = createUpload();
import { checkAuth, checkSuperAdmin } from "../Utils/Jwt_Token.js"

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User Management APIs
 */


/**
 * @swagger
 * /api/user/getById:
 *   post:
 *     tags:
 *       - User
 *     summary: Get User by ID
 *     description: Retrieves a user's details using their unique ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetByIdRequest'
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 */
userRouter.post("/getById", checkAuth, validateRequest(getByIdValidation), getUserDataByIdController);


/**
 * @swagger
 * /api/user/getCurrentUser:
 *   post:
 *     tags:
 *       - User
 *     summary: Get authenticated user details
 *     description: Retrieves the details of the authenticated user using the JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 */
userRouter.post("/getCurrentUser", checkAuth, getWebUserDataByIdController);


/**
 * @swagger
 * /api/user/updateUserDetails:
 *   post:
 *     tags:
 *       - User
 *     summary: Update User Details
 *     description: Updates the details of an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDetailsRequest'
 *     responses:
 *       200:
 *         description: User details updated successfully
 */
userRouter.post("/updateUserDetails", checkAuth, validateRequest(userUpdateValidationSchema), userDataUpdateController);


/**
 * @swagger
 * /api/user/updateProfile/{userId}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update profile picture
 *     description: Upload or update the user's profile picture.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *           example: "6867d6d0b123456789abcdef"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (JPG, JPEG, PNG)
 *     responses:
 *       200:
 *         description: Profile picture updated successfully.
 */
userRouter.patch("/updateProfile/:userId", checkAuth, uploadProfileImage.single("file"), updateProfileController);


/**
 * @swagger
 * /api/user/updateFcm:
 *   post:
 *     tags:
 *       - User
 *     summary: Update FCM Token
 *     description: Adds or removes an FCM token for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFcmRequest'
 *     responses:
 *       200:
 *         description: FCM token updated successfully.
 */
userRouter.post("/updateFcm", checkAuth, validateRequest(updateFcmTokenValidation), updateFcmController);


/**
 * @swagger
 * /api/user/getAll:
 *   post:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Retrieves a paginated list of users based on the provided filters.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetUsersRequest'
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
userRouter.post("/getAll", checkAuth, validateRequest(getUsersValidation),getAllUsersController);



/**
 * @swagger
 * /api/user/verify:
 *   patch:
 *     summary: Verify or update user status
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserStatusSchema'
 *     responses:
 *       200:
 *         description: User status updated successfully.
 */
userRouter.patch("/verify", checkAuth,checkSuperAdmin, validateRequest(userStatusValidation),updateVerificationStatusController);


export default userRouter;

