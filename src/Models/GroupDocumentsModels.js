import mongoose from "mongoose";

const groupDocumentSchema = new mongoose.Schema({
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
        enum: ["Verified"],
        default: "Verified"
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }

}, { timestamps: true, versionKey: false });

groupDocumentSchema.index({ hospitalId: 1, documentTypeId: 1 }, { unique: true });

const GroupDocumentsModel = mongoose.model("GroupDocuments", groupDocumentSchema)

export default GroupDocumentsModel;