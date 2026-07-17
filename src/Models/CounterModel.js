import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    prefix: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    sequenceValue: {
        type: Number,
        default: 0,
        min: 0
    },
    lastResetValue: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

counterSchema.index({ name: 1, prefix: 1 }, { unique: true });

const CountersModel = mongoose.model("Counters", counterSchema);

export default CountersModel;