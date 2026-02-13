import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    shiftDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    requiredStaff: {
        type: Number,
        required: true,
        min: 1
    },
    payRate: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duties: {
        type: String,
        default:null
    },
    status: {
        type: String,
        enum: ["Open", "Closed", "Cancelled"],
        default: "Open"
    }
}, {
    timestamps: true
});

export default mongoose.model("Shifts",ShiftSchema);