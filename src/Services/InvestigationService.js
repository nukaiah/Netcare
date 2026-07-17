import InvestigationModel from "../Models/InvestigationModel.js";

const createInvestigationService = async (investigationData) => {
    const response = await InvestigationModel.create(investigationData);
    return response;
};

const getInvestigationService = async (investigationData) => {
    const response = await InvestigationModel.aggregate([
        {
            $lookup: {
                from: "shifts",
                localField: "shiftId",
                foreignField: "_id",
                as: "shift"
            }
        },
        {
            $unwind: {
                path: "$shift",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "healthcareWorkerId",
                foreignField: "_id",
                as: "healthcareWorker"
            }
        },
        {
            $unwind: {
                path: "$healthcareWorker",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "hospitalId",
                foreignField: "_id",
                as: "hospitalAdmin"
            }
        },
        {
            $unwind: {
                path: "$hospitalAdmin",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $project: {
                _id: 1,
                investigationId: 1,
                status: 1,
                severity: 1,
                incidentTypes: 1,
                createdAt: 1,

                healthcareWorker: {
                    _id: "$healthcareWorker._id",
                    fullName: "$healthcareWorker.fullName"
                },

                hospitalAdmin: {
                    _id: "$hospitalAdmin._id",
                    fullName: "$hospitalAdmin.fullName"
                },

                shift: {
                    _id: "$shift._id",
                    shiftStartDate: "$shift.shiftStartDate",
                    shiftEndDate: "$shift.shiftEndDate",
                    startTime: "$shift.startTime",
                    endTime: "$shift.endTime",
                    departmentId: "$shift.departmentId",
                    designationId: "$shift.designationId",
                    locationId: "$shift.locationId"
                }
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        }
    ]);
    return response;
};

export { createInvestigationService, getInvestigationService };