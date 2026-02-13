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
    { timestamps: true }
);


locationSchema.index(
    { name: 1, type: 1, parentId: 1 },
    { unique: true }
);


export default mongoose.model("Location", locationSchema);
