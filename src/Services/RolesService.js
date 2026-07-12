import RolesModels from "../Models/RolesModels.js";

const createRoleService = async(rolesData)=>{
    const response = await RolesModels.create(rolesData);
    return response;
};

const getAllRolesService = async()=>{
    const response = await RolesModels.find();
    return response;
};

export {createRoleService,getAllRolesService};