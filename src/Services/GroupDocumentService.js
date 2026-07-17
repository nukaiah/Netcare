import GroupDocumentsModel from "../Models/GroupDocumentsModels.js";

const uploadGroupDocumentsService = async () => {
    const response = await GroupDocumentsModel.create();
    return response;
 };

const getGropuDocumentsService = async () => {
    const response = await GroupDocumentsModel.find();
    return response;
 };

export { uploadGroupDocumentsService,getGropuDocumentsService };