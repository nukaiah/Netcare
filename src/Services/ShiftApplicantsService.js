import ShiftApplicants from "../Models/ShiftApplicants.js";

const GetHopitalShiftApplicantsService = async () => {
    const response = await ShiftApplicants.aggregate([
        // Applicant
        {
            $lookup: {
                from: "users",
                localField: "workerId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                        }
                    }
                ],
                as: "applicant"
            }
        },
        {
            $unwind: {
                path: "$applicant",
                preserveNullAndEmptyArrays: true
            }
        },

        // Shift
        {
            $lookup: {
                from: "shifts",
                localField: "shiftId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            departmentId: 1,
                            designationId: 1,
                            payRate:1
                        }
                    }
                ],
                as: "shift"
            }
        },
        {
            $unwind: {
                path: "$shift",
                preserveNullAndEmptyArrays: true
            }
        },

        // Department
        {
            $lookup: {
                from: "departments",
                localField: "shift.departmentId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            departmentName: 1
                        }
                    }
                ],
                as: "department"
            }
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true
            }
        },

        // Designation
        {
            $lookup: {
                from: "designations",
                localField: "shift.designationId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            designationName: 1
                        }
                    }
                ],
                as: "designation"
            }
        },
        {
            $unwind: {
                path: "$designation",
                preserveNullAndEmptyArrays: true
            }
        },
    ]);

    return response;
};

export { GetHopitalShiftApplicantsService };