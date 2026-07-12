import mongoose from "mongoose";

const DocumentActivitySchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        actionBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            index: true
        },
        action: {
            type: String,
            enum: [
                "Uploaded",
                "Reuploaded",
                "Verified",
                "Rejected",
                "Deleted"
            ],
            required: true
        },
        remarks: {
            type: String,
            default: null
        }

    },
    {
        timestamps: true,
        versionKey: false
    });

const DocumentActivityModel = mongoose.model("DocumentActivity", DocumentActivitySchema)

export default DocumentActivityModel;