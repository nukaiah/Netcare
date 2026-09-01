import mongoose, { get, set } from "mongoose";
import bcrypt from "bcrypt";
import { encrypt, decrypt } from "../Utils/EncryptDecrypt.js";

const userModel = new mongoose.Schema(
  {
    roleId: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      set: encrypt,
      get: decrypt,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      set: encrypt,
      get: decrypt,
    },

    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: function (v) {
          // Skip validation if already hashed
          if (v.startsWith("$2b$")) return true;
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return regex.test(v);
        },
        message:
          "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number & 1 special character",
      },
    },

    sancNumber: {
      type: String,
      trim: true,
      set: (v) => (v ? encrypt(v) : v),
      get: (v) => (v ? decrypt(v) : v),
      default: null
    },

    dob: { 
      type: Date,
       default: null 
      },

    designationId: {
       type: String, 
       trim: true, 
       default: null
       },

    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      default: null,
    },

    imageUrl: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
      resourceType: {
        type: String,
        default: null,
      },
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    fcm: {
      type: [String],
      default: [],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    id: false,
    timestamps: true,
    versionKey: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

userModel.index({ email: 1 }, { unique: true });
userModel.index({ mobileNumber: 1 }, { unique: true });

/* ================================
   PASSWORD HASHING - SAVE
================================ */

userModel.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userModel.pre("insertMany", async function (next, docs) {
  for (let doc of docs) {
    if (doc.password) {
      doc.password = await bcrypt.hash(doc.password, 10);
    }
  }
  next();
});

/* ================================
   PASSWORD HASHING - UPDATE
================================ */

userModel.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    const password =
      update.password || update.$set?.password;

    if (!password) return next();

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (update.password) update.password = hashed;
    if (update.$set?.password) update.$set.password = hashed;

    next();
  } catch (err) {
    next(err);
  }
});

/* ================================
   PASSWORD COMPARE METHOD
================================ */

userModel.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


userModel.statics.validateEmail = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

userModel.statics.validateMobileNumber = function (number) {
  const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,5}\)?[-.\s]?){1,5}\d{1,5}$/;
  return phoneRegex.test(number);
};


export default mongoose.model("Users", userModel);