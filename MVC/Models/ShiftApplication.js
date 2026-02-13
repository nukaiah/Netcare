import mongoose from "mongoose";

const shiftApplicationSchema = new mongoose.Schema({
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: [ "Accepted", "Rejected"],
        required: true
    },
    respondedAt: {
        type: Date
    }
},{timestamps:true});

shiftApplicationSchema.index({ shiftId: 1, workerId: 1 },{ unique: true });


export default mongoose.model("ShiftApplication",shiftApplicationSchema);