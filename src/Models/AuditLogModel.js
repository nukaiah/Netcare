import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        action: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId
        },

        oldData: {
            type: Object
        },

        newData: {
            type: Object
        },

        method: {
            type: String
        },

        endpoint: {
            type: String
        },

        ipAddress: {
            type: String
        },

        userAgent: {
            type: String
        },

        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            default: "SUCCESS"
        },

        message: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
