import BankDetails from "../Models/BankDetailsModels.js";

const createBankDetailsService = async (bankDetails) => {
    const response = await BankDetails.create(bankDetails);
    return response;
};

const getBankDetailsByIdService = async (id) => {
    const response = await BankDetails.findById(id).lean();
    if (!response) {
        throw new Error("Not Found");
    }
    return response;
};

const getBankDetailsByUserIdService = async (userId) => {
    const response = await BankDetails.findOne({ userId: userId }).lean();
    if (!response) {
        throw new Error("Not Found");
    }
    return response;
};

const updateBankDetailsService = async (bankDetails) => {
    const { id, ...updatedData } = bankDetails || {};
    const response = await BankDetails.findByIdAndUpdate(id, { $set: updatedData }, { runValidators: true, new: true });
    if (!response) {
        throw new Error("Not Found");
    }
    return response;
};

export { createBankDetailsService, getBankDetailsByIdService, getBankDetailsByUserIdService, updateBankDetailsService }

