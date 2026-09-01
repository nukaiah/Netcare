import AvailabilityModel from "../Models/AvaialabilityModel.js";

const createAvailabilityService = async (availabilityData) => {
    const response = await AvailabilityModel.create(availabilityData);
    return response;
};

const getAvailabilityService = async (availabilityData) => {
    const query = { "userId": availabilityData.userId };
    const response = await AvailabilityModel.find(query).lean();
    if(!response){
        throw new Error("Not Found");
    }
    return response;
};

export { createAvailabilityService, getAvailabilityService };