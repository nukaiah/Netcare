import mongoose from "mongoose";

const documentTypeSchema = new mongoose.Schema({
    documentName: {
        type: String,
        required: true,
    },
    isExipreDate: {
        type: Boolean,
        required:true
    },
    referTo:{
        type:Number,
        required:true
    }
}, { timestamps: true,versionKey:false});

documentTypeSchema.index({ documentName: 1 }, { unique: true });

const DocumentTypeModel = mongoose.model("DocumentType", documentTypeSchema)

export default DocumentTypeModel;