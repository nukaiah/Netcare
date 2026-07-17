import CountersModel from "../Models/CounterModel.js";

export const generateSequence = async (name) => {

    // Current Month -> YYMM
    const today = new Date();

    const currentMonth =
        String(today.getFullYear()).slice(-2) +
        String(today.getMonth() + 1).padStart(2, "0");

    // Reset only if month changed
    await CountersModel.findOneAndUpdate(
        {
            name,
            lastResetValue: { $ne: currentMonth }
        },
        {
            $set: {
                sequenceValue: 0,
                lastResetValue: currentMonth
            }
        },
        {
            new: true
        }
    );

    // Atomic Increment
    const counter = await CountersModel.findOneAndUpdate(
        {
            name
        },
        {
            $inc: {
                sequenceValue: 1
            }
        },
        {
            new: true
        }
    );

    if (!counter) {
        throw new Error(`${name} counter not found.`);
    }

    return `${counter.prefix}-${currentMonth}-${String(counter.sequenceValue).padStart(5, "0")}`;
};