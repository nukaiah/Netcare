import BankDetails from "../Models/BankDetailsModels.js";

const createBankDetailsService = async (bankDetails) => {
    const response = await BankDetails.create(bankDetails);
    return response;
};

const getBankDetailsByIdService = async (id) => {
    const response = await BankDetails.findById(id).lean();
    return response;
};

const getBankDetailsByUserIdService = async (userId) => {
    const response = await BankDetails.findOne({ userId: userId }).lean();
    return response;
};

const updateBankDetailsService = async (bankDetails) => {
    const { id, ...updatedData } = bankDetails || {};
    const response = await BankDetails.findByIdAndUpdate(id, { $set: updatedData }, { runValidators: true, new: true });
    return response;
};

export { createBankDetailsService,getBankDetailsByIdService,getBankDetailsByUserIdService,updateBankDetailsService }

