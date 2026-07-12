import DocumentTypeModel from "../Models/DocumentTypeModel.js";

const createDocumentTypeService = async (documentTypeData) => {
    const response = DocumentTypeModel.create(documentTypeData);
    return response;
};

const updateDocumentTypeService = async (updatedDcoumentTypeData) => {
    const { id, ...remainData } = updatedDcoumentTypeData;
    const response = await DocumentTypeModel.findByIdAndUpdate(id, { $set: remainData }, { returnDocument: "after", runValidators: true });
    return response;
};

const getAllDocumentTypeService = async (referTo) => {
    const query = referTo === 0 ? {} : { "referTo": referTo };
    const response = await DocumentTypeModel.find(query);
    return response;
};

export { createDocumentTypeService, updateDocumentTypeService, getAllDocumentTypeService }