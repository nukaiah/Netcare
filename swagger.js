import swaggerJSDoc from "swagger-jsdoc";

import j2s from "joi-to-swagger";

/* Authentication */
import { registerValidationSchema, loginValidationSchema, forgotPasswordValidation, resetPasswordValidation } from "./src/Validations/AuthenticationValidation.js";
const { swagger: RegisterRequest } = j2s(registerValidationSchema);
const { swagger: LoginRequest } = j2s(loginValidationSchema);
const { swagger: ForgotPasswordRequest } = j2s(forgotPasswordValidation);
const { swagger: ResetPasswordRequest } = j2s(resetPasswordValidation);

/* Otp */
import { genarateEmailMobileOtpValidation, verifyOtpValidation, resendOtpValidatiion } from "./src/Validations/OtpValidations.js";
const { swagger: GenerateRegisterOtpRequest } = j2s(genarateEmailMobileOtpValidation);
const { swagger: VerifyOtpRequest } = j2s(verifyOtpValidation);
const { swagger: ResendOtpRequest } = j2s(resendOtpValidatiion);

/* Global GetById */
import getByIdValidation from './src/Validations/GetByIdValidation.js';
const { swagger: GetByIdRequest } = j2s(getByIdValidation);

/* Users */
import getByUserIdValidation from "./src/Validations/GetByUserIdValidation.js";
import { userUpdateValidationSchema, updateFcmTokenValidation, getUsersValidation, userStatusValidation } from "./src/Validations/UserValidations.js";
const { swagger: GetCurrentUserRequest } = j2s(getByUserIdValidation);
const { swagger: UpdateUserDetailsRequest } = j2s(userUpdateValidationSchema);
const { swagger: UpdateFcmRequest } = j2s(updateFcmTokenValidation);
const { swagger: GetUsersRequest } = j2s(getUsersValidation);
const { swagger: UserStatusSchema } = j2s(userStatusValidation);




/* Locations */
import { createStateValidation, createCityValidation, locationTypeValidation, getAllCityValidation, updateStateValidation, updateCityValidation } from "./src/Validations/LocationValidation.js";
const { swagger: CreateStateRequest } = j2s(createStateValidation);
const { swagger: CreateCityRequest } = j2s(createCityValidation);
const { swagger: GetAllLocationsRequest } = j2s(locationTypeValidation);
const { swagger: GetAllCityRequest } = j2s(getAllCityValidation);
const { swagger: UpdateStateRequest } = j2s(updateStateValidation);
const { swagger: UpdateCityRequest } = j2s(updateCityValidation);


/* Address */
import { AddressValidation, updateAddressValidation } from './src/Validations/AddressValidation.js';
const { swagger: CreateAddressRequest } = j2s(AddressValidation);
const { swagger: UpdateAddressRequest } = j2s(updateAddressValidation);

/* Bank Details */
import { BankValidation, updateBankValidation } from './src/Validations/BankDetailsValidations.js';
const { swagger: CreateBankRequest } = j2s(BankValidation);
const { swagger: UpdateBankRequest } = j2s(updateBankValidation);

/* Banks Master */
import { createBankValidation } from './src/Validations/BanksValidation.js';
const { swagger: CreateBankMasterRequest } = j2s(createBankValidation);

/* Qualification */
import { qualificationValidation, qualificationUpdateValidation } from './src/Validations/QualificationValidation.js';
const { swagger: CreateQualificationRequest } = j2s(qualificationValidation);
const { swagger: UpdateQualificationRequest } = j2s(qualificationUpdateValidation);

/* Experiance */
import { ExperianceValidation, updateExperianceValidation } from './src/Validations/ExperianceValidation.js';
const { swagger: CreateExperienceRequest } = j2s(ExperianceValidation);
const { swagger: UpdateExperienceRequest } = j2s(updateExperianceValidation);

/* Deparment */
import { DeparmentValidation, updateDepartmentValidation } from './src/Validations/DepartmentValidation.js';
const { swagger: CreateDepartmentRequest } = j2s(DeparmentValidation);
const { swagger: UpdateDepartmentRequest } = j2s(updateDepartmentValidation);


/* DocumentType */
import { DocumentTypeValidation, updateDocumentTypeValidation, getAllDocumentTypeValidatiion } from './src/Validations/DocumentTypeValidation.js';
const { swagger: CreateDocumentTypeRequest } = j2s(DocumentTypeValidation);
const { swagger: GetAllDocumentTypeRequest } = j2s(getAllDocumentTypeValidatiion);
const { swagger: UpdateDocumentTypeRequest } = j2s(updateDocumentTypeValidation);


/* Designation */
import { designationValidation, updateDesignationValidation } from './src/Validations/DesignationValidation.js';
const { swagger: CreateDesignationRequest } = j2s(designationValidation);
const { swagger: UpdateDesignationRequest } = j2s(updateDesignationValidation);

/* Documents */
import { DocumentUplodaValidation, DocumentUpdateValidation } from './src/Validations/DocumentsValidation.js';
const { swagger: DocumentUploadRequest } = j2s(DocumentUplodaValidation);
const { swagger: VerifyDocumentRequest } = j2s(DocumentUpdateValidation);

/* Shifts */
import { ShiftPostValidation, getWebShiftsValidation, updateShiftStatusValidation, getAllMobileValidation, getMyShiftsValidation } from "./src/Validations/ShiftPostValidation.js"
const { swagger: ShiftPostSchema } = j2s(ShiftPostValidation);
const { swagger: GetWebShiftsSchema } = j2s(getWebShiftsValidation);
const { swagger: UpdateShiftStatusSchema } = j2s(updateShiftStatusValidation);
const { swagger: GetAllMobileShiftRequest } = j2s(getAllMobileValidation);
const { swagger: GetMyShiftsRequest } = j2s(getMyShiftsValidation);


/* Prefernce */
import { PreferenceValidation, updatePreferenceValidation } from './src/Validations/PreferenceValidation.js';
const { swagger: CreatePreferenceRequest } = j2s(PreferenceValidation);
const { swagger: UpdatePreferenceRequest } = j2s(updatePreferenceValidation);


/* Avaialability */
import { createAvailabilityValidation } from './src/Validations/AvaialbilityValidation.js';
const { swagger: CreateAvailabilityRequest } = j2s(createAvailabilityValidation);


/* Avaialability */
import { createReviewValidation } from './src/Validations/ReviewValidations.js';
const { swagger: CreateReviewRequest } = j2s(createReviewValidation);

/* ShiftApplicartion */
import { showInterestValidation,shiftApplicationActionValidation,getShiftApplicationValidation,punchTimeValidation } from './src/Validations/ShiftApplicationValidation.js';
const { swagger: ShowInterestRequest } = j2s(showInterestValidation);
const { swagger: ShiftApplicationActionRequest } = j2s(shiftApplicationActionValidation);
const { swagger: GetApplicantsRequest } = j2s(getShiftApplicationValidation);
const { swagger: PunchTimeRequest } = j2s(punchTimeValidation);


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shift Match",
            version: "1.0.0",
            description: "API documentation for Shift match"
        },
        servers: [
            {
                url: "http://192.168.0.102:3000",
                description: "Development server"
            }
        ],
        components: {
            schemas: {
                /* Global GetById */
                GetByIdRequest,

                /* Authentication */
                RegisterRequest,
                LoginRequest,
                ForgotPasswordRequest,
                ResetPasswordRequest,

                /* Otp */
                GenerateRegisterOtpRequest,
                VerifyOtpRequest,
                ResendOtpRequest,

                /* Users */
                GetCurrentUserRequest,
                UpdateUserDetailsRequest,
                UpdateFcmRequest,
                GetUsersRequest,
                UserStatusSchema,

                /* Locations */
                CreateStateRequest,
                CreateCityRequest,
                GetAllLocationsRequest,
                GetAllCityRequest,
                UpdateStateRequest,
                UpdateCityRequest,

                /* Address */
                CreateAddressRequest,
                UpdateAddressRequest,

                /* Bank Details */
                CreateBankRequest,
                UpdateBankRequest,

                /* Bank Masters */
                CreateBankMasterRequest,

                /* Qualification */
                CreateQualificationRequest,
                UpdateQualificationRequest,

                /* Experiance  */
                CreateExperienceRequest,
                UpdateExperienceRequest,

                /* Department  */
                CreateDepartmentRequest,
                UpdateDepartmentRequest,

                /* DocumentType  */
                CreateDocumentTypeRequest,
                GetAllDocumentTypeRequest,

                /* DocumentType  */
                CreateDocumentTypeRequest,
                GetAllDocumentTypeRequest,
                UpdateDocumentTypeRequest,

                /* Designation */
                CreateDesignationRequest,
                UpdateDesignationRequest,

                /* Documnets */
                DocumentUploadRequest,
                VerifyDocumentRequest,

                /* Shifts */
                ShiftPostSchema,
                GetWebShiftsSchema,
                UpdateShiftStatusSchema,
                GetAllMobileShiftRequest,
                GetMyShiftsRequest,


                /* Prefernce */
                CreatePreferenceRequest,
                UpdatePreferenceRequest,

                /* Availability*/
                CreateAvailabilityRequest,

                /* Review */
                CreateReviewRequest,



                /* ShiftApplicartion */
                ShowInterestRequest,
                ShiftApplicationActionRequest,
                GetApplicantsRequest,
                PunchTimeRequest

            },

            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [
        "./src/Routes/*.js"
    ]
};



export default swaggerJSDoc(options);