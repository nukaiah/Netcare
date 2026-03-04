import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    shiftId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reviewerType: {
      type: String,
      enum: ["facility", "worker"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    targetType: {
      type: String,
      enum: ["worker", "facility"],
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

},{timestamps:true,versionKey:false});

reviewSchema.index({ shiftId: 1, reviewerId: 1, targetId: 1 },{ unique: true });

export default mongoose.model("Reviews",reviewSchema)