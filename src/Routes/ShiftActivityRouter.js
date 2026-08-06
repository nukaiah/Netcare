import express from 'express';
import { getShiftActivityController } from '../Controllers/ShiftActivityController.js';
import { checkAuth } from "../Utils/Jwt_Token.js";
const ShiftActivityRouter = express.Router();

ShiftActivityRouter.post("/getActivity", checkAuth, getShiftActivityController);

export default ShiftActivityRouter;