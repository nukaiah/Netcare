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
            minlength: 5,
            maxlength: 255
        },

        addressLine2: {
            type: String,
            trim: true,
            minlength: 5,
            maxlength: 255
        },

        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        cityName: {
            type: String,
            required: true
        },

        stateId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        stateName: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{4}$/, "Postal code must be exactly 4 digits"]
        },
        country: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
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
    { id: false, timestamps: true, versionKey: false }
);

addressSchema.index({ userId: 1 }, { unique: true });


export default mongoose.model("Address", addressSchema);
