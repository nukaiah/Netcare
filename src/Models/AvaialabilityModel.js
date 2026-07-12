import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  shiftType: {
    type: String,
    enum: ["Morning", "Afternoon", "Night"],
    required: true
  },

  isAvailable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true, versionKey: false });

availabilitySchema.index({ userId: 1, date: 1, shiftType: 1 }, { unique: true });

const AvailabilityModel = mongoose.model("ShiftAvailability", availabilitySchema)

export default AvailabilityModel;
