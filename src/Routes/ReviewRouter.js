import exprerss from 'express';
import { createReviewControler, paymentController } from "../Controllers/ReviewController.js"
import { checkAuth } from "../Utils/Jwt_Token.js"
import validateRequest from '../Utils/Vlaidations.js';
import { createReviewValidation } from '../Validations/ReviewValidations.js';
const reviewRouter = exprerss.Router();



/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review management APIs
 */


/**
 * @swagger
 * /api/review/create:
 *   post:
 *     tags:
 *       - Review
 *     summary: Create a review
 *     description: Submit a rating for a completed shift.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Review already exists for this shift.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.post("/create", checkAuth, validateRequest(createReviewValidation), createReviewControler);

/**
 * @swagger
 * /api/review/openPayment:
 *   post:
 *     tags:
 *       - Review
 *     summary: Open payment
 *     description: Opens the payment process for the authenticated user. This endpoint only requires a Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment initiated successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing Bearer token.
 *       500:
 *         description: Internal server error.
 */
reviewRouter.post("/openPayment", checkAuth, paymentController);


export default reviewRouter;