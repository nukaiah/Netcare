import mongoose from "mongoose";
import { encrypt,decrypt } from "../MiddleWares/EncryptDecrypt.js";

const otpSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Register", "Login", "ForgotPassword"],
    },
    mode:{
      type:String,
      required:true,
      enum:["Email","Mobile"]
    },
    emailMobile: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      set: encrypt,
      get:decrypt
    },
    otp: {
      type: String,
      required: true,
      set: encrypt,
      get:decrypt
    },
    isUsed: {
      type: Boolean,
      default: false,
    },

    expireDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    versionKey:false,
    toJSON: { getters: true, virtuals: false },
    toObject: { getters: true, virtuals: false }
  }
);


// 🔥 TTL Index (Auto delete after expiry)
otpSchema.index({ expireDate: 1 }, { expireAfterSeconds: 0 });

// 🔍 Index for faster lookup
otpSchema.index({ email: 1, type: 1 });

export default mongoose.model("Otp", otpSchema);