import mongoose from "mongoose";

const investigationSchema = new mongoose.Schema(
    {
        investigationId: {
            type: String,
            required: true,
            trim: true
        },
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        shiftId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        shiftApplicationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        healthcareWorkerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        incidentTypes: [
            {
                type: String,
                required: true
            }
        ],
        reason: {
            type: String,
            trim: true,
            maxlength: 2000
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "High"
        },
        status: {
            type: String,
            enum: [
                "Open",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed"
            ],
            default: "Open"
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        findings: {
            type: String,
            default: null
        },
        correctiveAction: {
            type: String,
            default: null
        },
        resolution: {
            type: String,
            default: null
        },
        actionTaken: {
            type: String,
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        closedBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        closedAt: {
            type: Date,
            default: null
        },
        attachments: [
            {
                url: String,
                publicId: String,
                resourceType: String,
                fileName: String,
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

investigationSchema.index({ investigationNumber: 1 }, { unique: true });
investigationSchema.index({ reviewId: 1 });
investigationSchema.index({ shiftId: 1 });
investigationSchema.index({ status: 1 });
investigationSchema.index({ healthcareWorkerId: 1 });
investigationSchema.index({ hospitalId: 1 });


const InvestigationModel = mongoose.model("Investigations", investigationSchema)

export default InvestigationModel;