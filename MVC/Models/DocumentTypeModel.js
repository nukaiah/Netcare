import mongoose from "mongoose";

const documentTypeSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: true,
    },
    isExipreDate: {
        type: Boolean
    },
    referTo:{
        type:Number,
        required:true
    }
}, { timestamps: true,versionKey:false});

documentTypeSchema.index({ documentName: 1 }, { unique: true });

export default mongoose.model("DocumentType", documentTypeSchema);