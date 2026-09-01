import DepartmentModel from "../Models/DepartmentModel.js";

const createDepartmentService = async (departmentData) => {
    const response = await DepartmentModel.create(departmentData);
    return response;
};

const updateDepartmentService = async (departmentData) => {
    const { id, ...remainData } = departmentData || {};
    const response = await DepartmentModel.findByIdAndUpdate(id, { $set: remainData }, { new: true, returnDocument: true });
    if(!response){
        throw new Error("Not Found");
        
    }
    return response;
};

const getAllDeparmentService = async () => {
    const response = await DepartmentModel.find().lean();
    return response;
};

export { createDepartmentService, updateDepartmentService, getAllDeparmentService };