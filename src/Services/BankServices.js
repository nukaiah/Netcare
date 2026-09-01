import Banks from "../Models/BankModels.js";

const createBankService = async (bankData) => {
    const response = await Banks.create(bankData);
    return response;
};

const getAllBanksService = async () => {
    const response = await Banks.find().sort({ bankName: 1 }).lean();
    return response;
};


export { createBankService, getAllBanksService }