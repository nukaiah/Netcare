import QualifaicationModel from "../Models/QualifaicationModel.js";
import { uploadFile, deleteFile } from "../Utils/UploadFile.js";

const createQualificationService = async (qualificationData) => {
    console.log(qualificationData);
    const { userId, documentUrl } = qualificationData;

    let fileResponse = null;

    try {
        fileResponse = await uploadFile(documentUrl, "qualifications",userId);

        delete qualificationData.documentUrl;

        const finalData = {
            ...qualificationData,
            documentUrl: {
                url: fileResponse.secure_url,
                publicId: fileResponse.public_id,
                resourceType: fileResponse.resource_type,
            }
        };

        const response = await QualifaicationModel.create(finalData);

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

const updateQualificationService = async (qualificationData) => {
    const { id, ...updatedQualificationData } = qualificationData || {};
    const response = await QualifaicationModel.findByIdAndUpdate(id, { $set: updatedQualificationData }, { new: true, runValidators: true });
    return response;
};

const deletQualificationService = async (id) => {
    const response = await QualifaicationModel.findByIdAndDelete(id);
    return response;
};


const deleteQualificationFileService = async (id) => {
    const response = await QualifaicationModel.findById(id);
    if (!response) {
        return "Not found";
    }
    await deleteFile(response.documentUrl.publicId,response.documentUrl.resourceType);
    response.documentUrl = "";
    await response.save();
    return response;
};

const updateQualificationFileService = async (qualificationFileData) => {
    const { id, documentUrl } = qualificationFileData || {};
    const response = await QualifaicationModel.findByIdAndUpdate(id, { $set: { documentUrl: documentUrl } }, { new: true, runValidators: true });
    return response;
};


export {
    createQualificationService,
    updateQualificationService,
    deletQualificationService,
    updateQualificationFileService,
    deleteQualificationFileService
};