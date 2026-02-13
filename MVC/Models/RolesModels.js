import mongoose from 'mongoose';

const rolesSchema = new mongoose.Schema({
    roleId: {
        type: Number,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    aboutRole: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

rolesSchema.index({ roleId: 1 }, { unique: true });

const RolesPost = mongoose.model('Roles', rolesSchema);

export default RolesPost;
