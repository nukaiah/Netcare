import { createAddressService, updateAddressService, getAddressByIdService, getAddressByUserIdService } from "../Services/AddressService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

const createAddressController = async (req, res, next) => {
    try {
        const addressData = req.body || {};
        const response = await createAddressService(addressData);
        return createResponse(res, response, "Address created successfully");
    } catch (error) {
        if(error.code===11000){
            return conflictResponse(res,"Address alreay existed");
        }
        
        return next(error);
    }
};

const getAddressByIdController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await getAddressByIdService(id);
        if (!response) {
            return notFoundResponse(res, "Address not found");
        }
        return successResponse(res, response, "Address found successfully");
    } catch (error) {
        return next(error);
    }
};

const getAddressByUserIdController = async (req, res, next) => {
    try {
        const { userId } = req.body || {};
        const response = await getAddressByUserIdService(userId);
        if (!response) {
            return notFoundResponse(res, "Address not found");
        }
        return successResponse(res, response, "Address found sucessfully");
    } catch (error) {
        return next(error);
    }
};

const updateAddressController = async (req, res, next) => {
    try {
        const addressData = req.body || {};
        const response = await updateAddressService(addressData);
        if (!response) {
            return notFoundResponse(res, "Address not found");
        }
        return successResponse(res, response, "Address updated successfully");
    } catch (error) {
        return next(error);
    }
};

export {
    createAddressController,
    getAddressByIdController,
    getAddressByUserIdController,
    updateAddressController
};