import ShiftActivityModel from "../Models/ShiftActivityModel.js";

const createShiftActivityService = async(logData)=>{
    const result = await ShiftActivityModel.create(logData);
    return result;
};

const getShiftActivityService = async()=>{
    const result = await ShiftActivityModel.find();
    return result;
};

export {createShiftActivityService,getShiftActivityService};