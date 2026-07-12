import LocationModel from "../Models/LocationModel.js";
import { createAuditLogService } from "./AuditLogService.js";

const createStateService = async(stateData)=>{
    const response = await LocationModel.create(stateData);
    return response;
};


const updateStateService = async(updatedStateData)=>{
    const {id,...remainData} = updatedStateData;
    const response = await LocationModel.findByIdAndUpdate(id,{$set:remainData},{returnDocument:'after',runValidators:true});
    return response;
};


const createCityService = async(cityData)=>{
    const response = await LocationModel.create(cityData);
    return response;
};

const updateCityService = async(updatedCityData)=>{
    const {id,...remainData} = updatedCityData;
    const response = await LocationModel.findByIdAndUpdate(id,{$set:remainData},{returnDocument:"after",runValidators:true});
    return response;
};


const getAllLocationService = async(type)=>{
    const response = await LocationModel.find({type:type});
    return response;
};


const getAllCityService = async(parentId)=>{
    const response = await LocationModel.find({parentId:parentId});
    return response;
};



export {
    createStateService,
    updateStateService,
    createCityService,
    updateCityService,
    getAllLocationService,
    getAllCityService
}