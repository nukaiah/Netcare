import AddressModel from "../Models/AddressModel.js";

const createAddressService = async (addressData) => {
    const response = await AddressModel.create(addressData);
    return response;
};

const getAddressByIdService = async (id) => {
    const response = await AddressModel.findById(id).lean();
    return response;
};
const getAddressByUserIdService = async (userId) => {
    const response = await AddressModel.findOne({ userId: userId }).lean();
    return response;
};

const updateAddressService = async (addressData) => {
    const { id, ...updatedData } = addressData;
    const response = await AddressModel.findByIdAndUpdate(id, { $set: updatedData }, { runValidators: true, new: true });
    return response;
};

export { createAddressService, getAddressByIdService, getAddressByUserIdService, updateAddressService };