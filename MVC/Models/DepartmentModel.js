import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

departmentSchema.index({ departmentName: 1 }, { unique: true });

export default mongoose.model("Department",departmentSchema);