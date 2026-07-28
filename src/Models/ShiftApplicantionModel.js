import mongoose from "mongoose";

const shiftApplicationSchema = new mongoose.Schema(
    {
        shiftId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: [
                "Applied",
                "Approved",
                "Rejected",
                "Cancelled",
                "Completed"
            ]
        },
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        respondedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            default: null,
            trim: true
        },

        shiftStatus: {
            type: String,
            enum: [
                "Not Started",
                "Ongoing",
                "Completed"
            ],
            default: "Not Started"
        },

        startTime: {
            type: Date,
            default: null
        },

        endTime: {
            type: Date,
            default: null
        },
        cancellation: {

            isCancelled: {
                type: Boolean,
                default: false
            },

            cancelledBy: {
                type: String,
                enum: [
                    "Worker",
                    "Hospital"
                ],
                default: null
            },

            cancelledById: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },

            cancelledAt: {
                type: Date,
                default: null
            },

            reason: {
                type: String,
                trim: true,
                default: null
            },

            noticeHours: {
                type: Number,
                default: null
            },

            penaltyApplicable: {
                type: Boolean,
                default: false
            },

            penaltyHours: {
                type: Number,
                default: 0
            },

            penaltyAmount: {
                type: Number,
                default: 0
            }

        },

        isWorkerReview: {
            type: Boolean,
            default: false
        },

        isHospitalReview: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);

shiftApplicationSchema.index(
    {
        shiftId: 1,
        workerId: 1
    },
    {
        unique: true
    }
);

const ShiftApplication = mongoose.model(
    "ShiftApplication",
    shiftApplicationSchema
);

export default ShiftApplication;