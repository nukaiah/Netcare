import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        hospitalName: {
            type: String,
            required: true,
            trim: true
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        employmentType: {
            type: String,
            required: true,
            enum: ["Full Time", "Part Time", "Contract", "Locum"],
            trim: true
        },

        startDate: {
            type: Date,
            required: true,
            trim: true
        },

        endDate: {
            type: Date,
            trim: true,
            default: null
        },

        isCurrentlyWorking: {
            type: Boolean,
            required: true,
            default: false
        },

        documentUrl: {
            url: {
                type: String,
                default: null,
            },
            publicId: {
                type: String,
                default: null,
            },
            resourceType: {
                type: String,
                default: null,
            },
        },
        description: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Experience", experienceSchema);
