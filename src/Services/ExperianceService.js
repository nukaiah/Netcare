import ExperianceModel from "../Models/ExperianceModel.js";
import { uploadFile,deleteFile } from "../Utils/UploadFile.js";


const createExperianceService = async (experianceData) => {
    console.log(experianceData);
    const { userId, documentUrl } = experianceData;

    let fileResponse = null;

    try {
        fileResponse = await uploadFile(documentUrl, "experiances",userId);

        delete experianceData.documentUrl;

        const finalData = {
            ...experianceData,
            documentUrl: {
                url: fileResponse.secure_url,
                publicId: fileResponse.public_id,
                resourceType: fileResponse.resource_type,
            }
        };

        const response = await ExperianceModel.create(finalData);

        return response;

    } catch (error) {
        if (fileResponse?.public_id) {
            await deleteFile(
                fileResponse.public_id,
                fileResponse.resource_type
            );
        }
        throw error;
    }
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
    const response = await ExperianceModel.findById(id);
    if (!response) {
        return "Not found";
    }
    await deleteFile(response.documentUrl.publicId,response.documentUrl.resourceType);
    response.documentUrl = "";
    await response.save();
    return response;
};



export {
    createExperianceService,
    updateExperianceService,
    updateExperianceFileService,
    deleteExperianceService,
    deleteExperianceFileService
};