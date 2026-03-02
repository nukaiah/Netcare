import mongoose from 'mongoose';
import { encrypt, decrypt } from '../MiddleWares/EncryptDecrypt.js';
import { hashPassword } from '../MiddleWares/PasswordHash.js';

const healthCareWorkerSchema = new mongoose.Schema(
    {
        roleId: {
            type: Number,
            required: true,
            enum: [1, 2, 3]
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
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
            get: decrypt
        },

        password: {
            type: String,
            trim: true,
            required: true,
            select: false,
            validate: {
                validator: function (v) {
                    if (!v) return false;
                    const password = v.trim();
                    const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return regex.test(password);
                },
                message: function (props) {
                    const password = props.value.trim();
                    if (password.length < 8) return 'Password must be at least 8 characters long';
                    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
                    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
                    if (!/\d/.test(password)) return 'Password must contain at least one number';
                    if (!/[@$!%*?&]/.test(password)) return 'Password must contain at least one special character';
                    return 'Invalid password';
                }
            }
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
            enum: ["Male", "Female", "Other"],
            default: null,
            trim: true
        },

        imageUrl: {
            type: String,
            default: null,
            trim: true
        },

        verificationStatus: {
            type: String,
            required: true,
            enum: ["Pending", "Verified", "Rejected"],
            default: "Pending"
        },

        accountStatus: {
            type: String,
            required: true,
            enum: ["Active", "Inactive", "Suspended"],
            default: "Active"
        },

        fcm: {
            type: [String],
            default: []
        },
        
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
        versionKey:false,
        toJSON: { getters: true, virtuals: false },
        toObject: { getters: true, virtuals: false }
    },
);

healthCareWorkerSchema.index({ email: 1 }, { unique: true });
healthCareWorkerSchema.index({ mobileNumber: 1 }, { unique: true });


healthCareWorkerSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await hashPassword(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

healthCareWorkerSchema.statics.validateEmail = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

healthCareWorkerSchema.statics.validateMobileNumber = function (number) {
  const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,5}\)?[-.\s]?){1,5}\d{1,5}$/;
  return phoneRegex.test(number);
};

export default mongoose.model('Healthcareworker', healthCareWorkerSchema);




