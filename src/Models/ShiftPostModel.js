import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    hospitalName:{
        type:String,
        required:true,
        trim:true
    },

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    departmentName:{
        type:String,
        required:true,
        trim:true
    },

    designationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    designationName:{
        type:String,
        required:true,
        trim:true
    },

    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    locationName:{
        type:String,
        required:true,
        trim:true
    },

    shiftStartDate: {
        type: Date,
        required: true
    },

    shiftEndDate: {
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

    duties: {
        type: String,
        default:null
    },

    status: {
        type: String,
        enum: ["Open", "Closed", "Cancelled","Completed"],
        default: "Open"
    }
    
}, {
    timestamps: true,
    versionKey:false
});


ShiftSchema.index({status: 1,shiftDate: 1,departmentId: 1,designationId: 1,locationId: 1});
ShiftSchema.index({hospitalId: 1,createdAt: -1});
ShiftSchema.index({shiftDate: 1});
ShiftSchema.index({ createdAt: -1 });

ShiftSchema.index({ departmentId: 1 });
ShiftSchema.index({ designationId: 1 });
ShiftSchema.index({ locationId: 1 });

const Shifts = mongoose.model("Shifts",ShiftSchema);

export default Shifts;