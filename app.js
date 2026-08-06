import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    tagsSorter: "alpha",
    docExpansion: "none",
  },
}),
);

app.use("/uploads", express.static("uploads"));



import handleError from './src/Utils/HandelError.js';
import { notFoundResponse } from './src/Utils/Response.js';


import authenticationRouter from './src/Routes/AuthenticationRouter.js';
import auditLogRouter from './src/Routes/AuditLogRouter.js';
import otpRouter from './src/Routes/OtpRouter.js';
import userRouter from './src/Routes/UserRouter.js';
import addressRouter from './src/Routes/AddressRouter.js';
import bankDetailsRouter from './src/Routes/BankDetailsRouter.js';
import bankRouter from './src/Routes/BankRouters.js';
import qualificationRouter from './src/Routes/QualificationRouter.js';
import roleRouter from './src/Routes/RoleRouter.js';
import locationRouter from './src/Routes/LocationRouter.js';
import documentTypeRouter from './src/Routes/DocumentTypeRouter.js';
import designationRouter from './src/Routes/DesignationRouter.js';
import departmentRouter from './src/Routes/DepartmentRouter.js';
import experianceRouter from './src/Routes/ExperianceRouter.js';
import documentRouter from './src/Routes/DocumentRouter.js';
import shiftpostRouter from './src/Routes/ShiftPostRouter.js';
import shiftApplicantionRouter from './src/Routes/ShiftApplicantionRouter.js';
import superAdminRouter from './src/Routes/SuperAdminDashboardRouter.js';
import documentActivityRouter from './src/Routes/DocumentActivityRouter.js';
import preferenceRouter from './src/Routes/PrefernceRouter.js';
import availabilityRouter from './src/Routes/AvailabilityRouter.js';
import reviewRouter from './src/Routes/ReviewRouter.js';
import groupDcoumentRouter from './src/Routes/GroupDocumentsRouter.js';
import investigationRouter from './src/Routes/InvestigationRouter.js';
import generateReportRouter from './src/Routes/GenerateReportsRouter.js';
import ShiftAttendanceRouter from './src/Routes/ShiftAttendanceRouter.js';
import ShiftActivityRouter from './src/Routes/ShiftActivityRouter.js';



app.use("/api/address", addressRouter);
app.use("/api/aufitLog", auditLogRouter);
app.use("/api/authentication", authenticationRouter);
app.use('/api/bankDetails', bankDetailsRouter);
app.use('/api/banks', bankRouter);
app.use("/api/designation", designationRouter);
app.use('/api/experience', experianceRouter);
app.use('/api/location', locationRouter);
app.use("/api/otp", otpRouter);;
app.use('/api/qualification', qualificationRouter);
app.use('/api/shift', shiftpostRouter);
app.use('/api/shiftApplication', shiftApplicantionRouter);
app.use('/api/superAdmin', superAdminRouter);
app.use("/api/user", userRouter);
app.use("/api/documentActivity", documentActivityRouter);
app.use('/api/preference', preferenceRouter);
app.use('/api/roles', roleRouter);
app.use('/api/documentType', documentTypeRouter);
app.use('/api/department', departmentRouter);
app.use('/api/document', documentRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/review", reviewRouter);
app.use("/api/groupDocuments", groupDcoumentRouter);
app.use("/api/investigation", investigationRouter);
app.use("/api/reports", generateReportRouter);
app.use("/api/attendance", ShiftAttendanceRouter);
app.use("/api/shiftActivity", ShiftActivityRouter);



app.use((req, res, next) => {
  return notFoundResponse(res, `Cannot ${req.method} ${req.originalUrl}`);
});

app.use((error, req, res, next) => {
  return handleError(res, error);
});

export default app;
