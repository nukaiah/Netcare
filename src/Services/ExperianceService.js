import ExperianceModel from "../Models/ExperianceModel.js";
import { deleteFile } from "../Utils/UploadFile.js";


const createExperianceService = async (experianceData) => {
    const response = await ExperianceModel.create(experianceData);
    return response;
};


const updateExperianceFileService = async (experianceData) => {
    const { id, documentUrl } = experianceData || {};
    const response = await ExperianceModel.findByIdAndUpdate(id, { $set: { documentUrl: documentUrl } }, { new: false, runValidators: true });
    if (!response) {
        return null;
    }

    if (response.documentUrl && response.documentUrl !== documentUrl) {
        const userId = response.userId;
        const filename = response.documentUrl;
        const filePath = `uploads/experiances/${userId}/${filename}`;
        try {
            await deleteFile(filePath);
        } catch (error) {

        }
    }
    return response;
};


const updateExperianceService = async (experianceData) => {
    const { id, ...remainData } = experianceData || {};
    const response = await ExperianceModel.findByIdAndUpdate(id, { $set: remainData }, { runValidators: true, new: true });
    return response;
};


const deleteExperianceService = async (id) => {
    const response = await ExperianceModel.findByIdAndDelete(id);
    if (!response) {
        return null;
    }
    if (response.documentUrl) {
        const userId = response.userId;
        const filename = response.documentUrl;
        const filePath = `uploads/experiances/${userId}/${filename}`;
        try {
            await deleteFile(filePath);
        } catch (error) {

        }
    }
    return response;
};


const deleteExperianceFileService = async (id) => {
    const response = await ExperianceModel.findByIdAndUpdate(id, { $set: { documentUrl: null } }, { runValidators: true, new: false });
    if (!response) {
        return null;
    }
    if (response.documentUrl) {
        const userId = response.userId;
        const filename = response.documentUrl;
        const filePath = `uploads/experiances/${userId}/${filename}`;
        try {
            await deleteFile(filePath);
        } catch (error) {

        }
    }
    return response;
};




export {
    createExperianceService,
    updateExperianceService,
    updateExperianceFileService,
    deleteExperianceService,
    deleteExperianceFileService
};