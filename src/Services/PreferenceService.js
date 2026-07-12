import Preference from "../Models/PreferenceModel.js";

const createPreferenceService = async (preferenceData) => {
    const response = await Preference.create(preferenceData);
    return response;
};

const updatePreferenceService = async (preferenceData) => {
    const { id, ...remainData } = preferenceData || {};
    const response = await Preference.findByIdAndUpdate(id, { $set: remainData });
    return response;
};

export { createPreferenceService, updatePreferenceService };