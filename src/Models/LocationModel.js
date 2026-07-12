import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: Number,
            required: true,
            enum: [1, 2]
        },

        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        }
    },
    { timestamps: true,versionKey:false}
);


locationSchema.index(
    { name: 1, type: 1, parentId: 1 },
    { unique: true }
);

const LocationModel = mongoose.model("Location", locationSchema)


export default LocationModel;
