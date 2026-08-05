import ShiftAttendanceModel from "../Models/ShiftAttendanceModel.js";

const punchInService = async (attendanceData) => {
    const punchInData = attendanceData || {};
    const response = await ShiftAttendanceModel.create(punchInData);
    return response;
};

const punchOutService = async (attendanceData) => {
    const { id, ...punchOutData } = attendanceData || {};
    const response = await ShiftAttendanceModel.findByIdAndUpdate(id, { $set: punchOutData }, { returnDocument: 'after', runValidators: true });
    return response;
};

const getShiftAttendanceService = async (shiftApplicationId) => {
    const response = await ShiftAttendanceModel.find({ shiftApplicationId }).sort({ attendanceDate: 1 });
    return response;
};


export { punchInService, punchOutService, getShiftAttendanceService };