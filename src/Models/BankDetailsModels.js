import mongoose from 'mongoose';
import { encrypt,decrypt } from '../Utils/EncryptDecrypt.js';

const bankDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    accountHolderName: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Savings", "Cheque", "Current", "Business"],
    },
    branchName: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt
    },
    branchCode: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt
    },
    universalBranchCode: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt
    },

    swiftCode: {
        type: String,
        default: null
    },
    currency: {
        type: String,
        default: "ZAR"
    },
    bankConfirmationLetter: {
        type: String,
        default: null
    }
}, {
    id:false,
    timestamps: true,
    versionKey:false,
    toJSON: { getters: true },
    toObject: { getters: true }

});

bankDetailsSchema.index({ userId: 1 }, { unique: true });

const BankDetails = mongoose.model("BankDetails", bankDetailsSchema);

export default BankDetails;