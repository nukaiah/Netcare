import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();


const mongoURI = process.env.LOCAL_DB_URL;

mongoose.set("strictQuery", false);

try {
  await mongoose.connect(mongoURI);
  console.log("Connected Successfully");
} catch (err) {
  console.error("Failed to Connect");
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



import roleRouter from './MVC/Controllers/RolesController.js';
import healthcareworkerRouter from './MVC/Controllers/HealtCareWorkerController.js';
import documentTypeRouter from './MVC/Controllers/DocumentTypeController.js';
import documentRouter from './MVC/Controllers/DocumentController.js';
import departmentRouter from './MVC/Controllers/DepartmentController.js';
import shiftpostRouter from './MVC/Controllers/ShiftPostController.js';
import shiftApplicationRouter from './MVC/Controllers/ShiftApplicationController.js';
import bankRouter from './MVC/Controllers/BankDetailsController.js';
import addressRouter from './MVC/Controllers/AddressController.js';
import experienceRouter from './MVC/Controllers/ExperianceController.js';
import qualificationRouter from './MVC/Controllers/QualificationController.js';
import locationRouter from './MVC/Controllers/LocationController.js';
import preferenceRouter from './MVC/Controllers/PrefernceController.js';
import availabilityRouter from './MVC/Controllers/AvailabilityController.js';
import designationRouter from './MVC/Controllers/DesignationController.js';
import otpRouter from './MVC/Controllers/OTPController.js'



app.use('/api/roles',roleRouter)
app.use('/api/healthCareWorker',healthcareworkerRouter);
app.use('/api/documentType',documentTypeRouter);
app.use("/uploads", express.static("uploads"));
app.use('/api/document',documentRouter);
app.use('/api/department',departmentRouter);
app.use('/api/shift',shiftpostRouter);
app.use('/api/shiftApplication',shiftApplicationRouter);
app.use('/api/bankDetails',bankRouter);
app.use('/api/address', addressRouter);
app.use('/api/experiance', experienceRouter);
app.use('/api/qualification', qualificationRouter);
app.use('/api/location',locationRouter);
app.use('/api/preference',preferenceRouter);
app.use("/api/availability",availabilityRouter);
app.use("/api/designation",designationRouter)
app.use("/api/OTP",otpRouter)



app.use('/', (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Invalid path',
  });
});

export default app;
