import DesignationsModel from "../Models/DesignationsModel.js";

const createDesignationService = async (designationData) => {
    const response = await DesignationsModel.create(designationData);
    return response;
};


const updateDesignationService = async (updatedDesignationData) => {
    const { id, ...remainData } = updatedDesignationData;
    const response = await DesignationsModel.findByIdAndUpdate(
        id,
        { $set: remainData },
        { new: true }
    );
    return response;
};


const getAllDesignationsService = async () => {
    const response = await DesignationsModel.find();
    return response;
};


export { createDesignationService, updateDesignationService, getAllDesignationsService }