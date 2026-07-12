import mongoose from "mongoose";

const designationSchema = new mongoose.Schema({

    designationName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"]
    },
}, { timestamps: true,versionKey:false });

designationSchema.index({designationName:1},{unique:true});

const DesignationsModel = mongoose.model("Designation", designationSchema)

export default DesignationsModel;