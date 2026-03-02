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
        },

        designation: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required:true
        },

        employmentType: {
            type: String,
            required:true,
            enum: ["Full Time", "Part Time", "Contract", "Locum"]
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            default:null
        },

        isCurrentlyWorking: {
            type: Boolean,
            default: false
        },

        documentUrl:{
            type:String,
            default:null,
        },
        description: {
            type: String,
            default:null
        }
    },
    {
        timestamps: true,
        versionKey:false
    }
);

export default mongoose.model("Experience", experienceSchema);
