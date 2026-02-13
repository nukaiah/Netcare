import mongoose from 'mongoose';
import { encrypt, decrypt } from '../MiddleWares/EncryptDecrypt.js';
import { hashPassword } from '../MiddleWares/PasswordHash.js';

const healthCareWorkerSchema = new mongoose.Schema(
    {
        roleId: { type: Number, required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, trim: true, lowercase: true, set: encrypt, get: decrypt },
        mobileNumber: { type: String, required: true, trim: true, set: encrypt, get: decrypt },
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
        roleName: { type: String, required: true },
        dob: { type: String, default: null },
        gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
        imageUrl: { type: String, default: null },
        departments: {
            type: [
                {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    }
                }
            ],
            validate: {
                validator: function (v) {
                    return v.length <= 5;
                },
                message: "You must select between 1 and 5 departments"
            },
            
        },


        verificationStatus: { type: String, required: true, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },

        accountStatus: { type: String, required: true, enum: ["Active", "Inactive", "Suspended"], default: "Active" }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { getters: true, virtuals: false },
        toObject: { getters: true, virtuals: false }
    },
);

healthCareWorkerSchema.index({ email: 1, mobileNumber: 1 }, { unique: true });

healthCareWorkerSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await hashPassword(this.password);
});

export default mongoose.model('Healthcareworker', healthCareWorkerSchema);

