import AvailabilityModel from "../Models/AvaialabilityModel.js";

const createAvailabilityService = async (availabilityData) => {
    const response = await AvailabilityModel.create(availabilityData);
    return response;
};

const getAvailabilityService = async (availabilityData) => {
    const query = { "userId": availabilityData.userId };
    var response = await AvailabilityModel.find(query);
    return response;
};

export { createAvailabilityService, getAvailabilityService };