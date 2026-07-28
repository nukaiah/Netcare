import express from "express";
const generateReportRouter = express.Router();
import { generateIncidentReportExcelController } from "../Controllers/GenerateReportsController.js";

generateReportRouter.get("/disciplinary-report", generateIncidentReportExcelController);

export default generateReportRouter;