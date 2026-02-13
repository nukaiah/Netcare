import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    education: {
        type: String,
        required: true,
        enum: [
            "Grade R",
            "Primary School",
            "Secondary School",
            "Matric",
            "Certificate",
            "Diploma",
            "Advanced Diploma",
            "Bachelor Degree",
            "Honours Degree",
            "Postgraduate Diploma",
            "Master Degree",
            "Doctorate"
        ]
    },
    institution: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    startYear: {
        type: Number,
        required: true
    },
    endYear: {
        type: Number,
        required: true
    },
    courseType: {
        type: String,
        required: true
    },
    sortOrder:{
        type:Number,
        required:true
    },
    documentUrl:{
        type:String,
        default:null,
    }
}, { timestamps: true });

qualificationSchema.index({ userId: 1, education: 1 }, { unique: 1 });

export default mongoose.model("Qualifications", qualificationSchema);
