import mongoose from "mongoose";

const shiftAttendanceSchema = new mongoose.Schema(
    {
        shiftId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        shiftApplicationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        attendanceDate: {
            type: Date,
            required: true,
        },

        scheduledStartTime: {
            type: String,
            required: true,
        },

        scheduledEndTime: {
            type: String,
            required: true,
        },

        punchIn: {
            type: Date,
            default: null,
        },

        punchOut: {
            type: Date,
            default: null,
        },

        attendanceStatus: {
            type: String,
            enum: [
                "Pending",
                "Present",
                "Late",
                "Absent",
                "Completed",
                "Cancelled",
            ],
            default: "Pending",
        },

        workedMinutes: {
            type: Number,
            default: 0,
        },

        overtimeMinutes: {
            type: Number,
            default: 0,
        },

        remarks: {
            type: String,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);


shiftAttendanceSchema.index(
    { shiftApplicationId: 1, attendanceDate: 1 },
    { unique: true }
);

shiftAttendanceSchema.index({ shiftId: 1 });
shiftAttendanceSchema.index({ workerId: 1 });
shiftAttendanceSchema.index({ hospitalId: 1 });
shiftAttendanceSchema.index({ attendanceDate: 1 });

const ShiftAttendanceModel = mongoose.model("ShiftAttendance", shiftAttendanceSchema)

export default ShiftAttendanceModel;