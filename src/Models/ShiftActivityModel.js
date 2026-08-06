import mongoose from "mongoose";

const ShiftActivitySchema = new mongoose.Schema(
    {
        shiftId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        shiftApplicationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        eventType: {
            type: String,
            enum: [
                "SHIFT_CREATED",
                "APPLICATION_SUBMITTED",
                "APPLICATION_APPROVED",
                "APPLICATION_REJECTED",
                "SHIFT_CANCELLED_BY_ADMIN",
                "SHIFT_CANCELLED_BY_WORKER",
                "SHIFT_STARTED",
                "SHIFT_END",
                "SHIFT_COMPLETED",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        metadata: {
            oldStatus: {
                type: String,
                required: true
            },
            newStatus: {
                type: String,
                required: true
            }
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

ShiftActivitySchema.index({ shiftId: 1, shiftApplicationId: 1, workerId: 1 });

const ShiftActivityModel = mongoose.model("ShiftActivity", ShiftActivitySchema);

export default ShiftActivityModel;