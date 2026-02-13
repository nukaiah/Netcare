import mongoose from 'mongoose';
import { encrypt, decrypt } from '../MiddleWares/EncryptDecrypt.js';

const bankSchema = new mongoose.Schema({
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
        enum: ["Standard Bank", "ABSA", "FNB", "Nedbank", "Capitec", "Other"],
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
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }

});

bankSchema.index({ userId: 1 }, { unique: true });


export default mongoose.model("BankDetails", bankSchema);