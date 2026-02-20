import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        addressLine1: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },

        addressLine2: {
            type: String,
            trim: true,
            maxlength: 255
        },

        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        
        stateId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        
        postalCode: {
            type: String,
            required: true,
            maxlength:12,
            minlength:6,
            trim:true
        },

        country: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        latitude: {
            type: Number,
            min: -90,
            max: 90,
            default: null
        },

        longitude: {
            type: Number,
            min: -180,
            max: 180,
            default: null
        }
    },
    { timestamps: true }
);

addressSchema.index({ userId: 1 }, { unique: true });


export default mongoose.model("Address", addressSchema);


// state: {
//             type: String,
//             required: true,
//             trim: true,
//             maxlength: 255
//         },

//         city: {
//             type: String,
//             required: true,
//             trim: true,
//             maxlength: 255
//         },