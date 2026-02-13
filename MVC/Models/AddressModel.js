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
        },

        addressLine2: {
            type: String,
        },

        cityId: {
            type: String,
            required: true
        },
        city: {

            type: String,
            required: true

        },
        stateId: {
            type: String,
            required: true
        },
        state: {

            type: String,
            required: true
        },


        postalCode: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true,
        },

        latitude: {
            type: Number,
            default: null
        },

        longitude: {
            type: Number,
            default: null
        }
    },
    { timestamps: true }
);

addressSchema.index({ userId: 1 }, { unique: true });


export default mongoose.model("Addresses", addressSchema);