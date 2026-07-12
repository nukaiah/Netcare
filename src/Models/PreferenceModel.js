import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    preferredShiftType: {
        type: String,
        enum: ["Morning", "Afternoon", "Night"],
        required: true,
    },

    preferredDepartments: {
        type: [{
             _id: false,
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            departmentName: {
                type: String,
                required: true
            }
        }],
        required: true,  
        validate: {
            validator: function (value) {
                return value.length > 0 && value.length<=5; 
            },
            message: "Department is should be between 1 and 5"
        }
    },


    preferredLocation: {
        type: {
            _id: false, 
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },

        required: true
    }

}, { timestamps: true,versionKey:false });

preferenceSchema.index({ userId: 1 }, { unique: true });
preferenceSchema.index({ "preferredLocation.id": 1, "preferredDepartments.id": 1, preferredShiftType: 1 });

const Preference = mongoose.model("Preferences", preferenceSchema);

export default Preference;
