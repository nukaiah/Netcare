import { getUserDataByIdService, getWebUserDataByIdService, userDataUpdateService, updateProfileService, updateFcmService, getAllUsersService,updateVerificationStatusService} from "../Services/UserService.js"
import { notFoundResponse, successResponse } from "../Utils/Response.js";
import { deleteFile } from "../Utils/UploadFile.js";
import { uploadFile } from "../Utils/UploadFile.js";


const getUserDataByIdController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await getUserDataByIdService(id);
        return successResponse(res, response, "User data found sucessfully");
    } catch (error) {
        return next(error);
    }
};


const getWebUserDataByIdController = async (req, res, next) => {
    try {
        const id = req.userId;
        const response = await getWebUserDataByIdService(id);
        return successResponse(res, response, "User data found sucessfully");
    } catch (error) {
        return next(error);
    }
};


const userDataUpdateController = async (req, res, next) => {
    try {
        const updatedData = req.body || {};
        const response = await userDataUpdateService(updatedData);
        if (!response) {
            return notFoundResponse(res, "No user found");
        }
        return successResponse(res, response, "Profile updated successfully");
    } catch (error) {
        return next(error);
    }
};


const updateProfileController = async (req, res, next) => {
    const userId = req.params.userId;
    const file = req.file;
    try {
        const data = { id: userId, "imageUrl": file };
        const result = await updateProfileService(data);
        if(result==="Not Found"){
            return notFoundResponse(res,"No user found to update profile.")
        }
        return successResponse(res, result, "Profile picture updated successfully.");
    } catch (error) {
        return next(error);
    }
};


const updateFcmController = async (req, res, next) => {
    try {

        const id = req.userId;
        const fcmToken = req.body || {};
        const fcmData = { id, ...fcmToken };
        const response = await updateFcmService(fcmData);
        if (!response) {
            return notFoundResponse(res, "No user found");
        }
        return successResponse(res, response, "Fcm token updated successfully");
    } catch (error) {
        return next(error);
    }
};


const getAllUsersController = async (req, res, next) => {
    try {
        const paginatedData = req.body || {}
        const result = await getAllUsersService(paginatedData);
        return successResponse(res, result, "Data found successfully");
    } catch (error) {
        return next(error);
    }
};

const updateVerificationStatusController = async(req,res,next)=>{
    try {
        const statusData = req.body||{};
        const result = await updateVerificationStatusService(statusData);
        return successResponse(res,result,"Status got updated");
    } catch (error) {
        return next(error);
    }
};


export { getUserDataByIdController, getWebUserDataByIdController, userDataUpdateController, updateProfileController, updateFcmController, getAllUsersController,updateVerificationStatusController};