import { createStateService, updateStateService, createCityService, updateCityService, getAllLocationService, getAllCityService } from "../Services/LocationService.js";
import { conflictResponse, createResponse, successResponse } from "../Utils/Response.js";

const createStateController = async (req, res, next) => {
    try {
        const stateName = req.body || {};
        const type = { type: 1 };
        const stateData = { ...type, ...stateName };
        const response = await createStateService(stateData);
        return createResponse(res, response, "State created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "State name existed already");
        }
        return next(error);
    }
};


const updateStateController = async (req, res, next) => {
    try {
        const updatedStateData = req.body||{};
        const result = await updateStateService(updatedStateData);
        return successResponse(res, result, "State updated successfully");
    } catch (error) {
        return next(error);
    }
};


const createCityController = async (req, res, next) => {
    try {
        const cityName = req.body || {};
        const type = { type: 2 };
        const cityData = { ...type, ...cityName };
        const response = await createStateService(cityData);
        return createResponse(res, response, "City created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "City name existed already");
        }
        return next(error);
    }
};


const updateCityController = async(req,res,next)=>{
    try {
        const updatedCityData = req.body|{};
        const result = await updateCityService(updatedCityData);
        return successResponse(res,result,"City updated successfully");
    } catch (error) {
        return next(error);
    }
};


const getAllLocationsController = async (req, res, next) => {
    try {
        const { type } = req.body || {};
        const response = await getAllLocationService(type);
        return successResponse(res, response, "Locations found");
    } catch (error) {
        return next(error);
    }
};


const getAllCityController = async (req, res, next) => {
    try {
        const { parentId } = req.body || {};
        const response = await getAllCityService(parentId);
        return successResponse(res, response, "City found succesfully");
    } catch (error) {
        return next(error);
    }
};


export {
    createStateController,
    updateStateController,
    createCityController,
    updateCityController,
    getAllLocationsController,
    getAllCityController
};