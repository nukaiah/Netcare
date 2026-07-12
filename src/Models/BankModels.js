import mongoose from 'mongoose';
import { encrypt, decrypt } from '../Utils/EncryptDecrypt.js';


const banksSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true,
        trim: true,
    },

    universalBranchCode: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false
});


banksSchema.index({ bankName: 1 }, { unique: true });

const Banks = mongoose.model("Banks", banksSchema);

export default Banks;