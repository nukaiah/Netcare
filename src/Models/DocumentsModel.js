import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    documentUrl: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        },
        resourceType: {
            type: String,
            default: null
        }
    },
    documentTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    issuedBy: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        default: null
    },
    verificationStatus: {
        type: String,
        enum: ["Pending", "Verified", "Rejected", "ReUploaded"],
        default: "Pending"
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }

}, { timestamps: true, versionKey: false });

documentSchema.index({ hospitalId: 1, documentTypeId: 1 }, { unique: true });

export default mongoose.model("Documents", documentSchema);