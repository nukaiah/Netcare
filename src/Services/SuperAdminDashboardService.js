import DepartmentModel from "../Models/DepartmentModel.js";
import DesignationsModel from "../Models/DesignationsModel.js";
import DocumentTypeModel from "../Models/DocumentTypeModel.js";
import LocationModel from "../Models/LocationModel.js";
import UserModels from "../Models/UserModels.js";

const SuperAdminDashboardService = async () => {
    const [
        departments,
        designations,
        locationCounts,
        userAnalytics
    ] = await Promise.all([
        DepartmentModel.countDocuments(),
        DesignationsModel.countDocuments(),
        LocationModel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]),

        UserModels.aggregate([
            {
                $match: {
                    roleId: { $in: [2, 3] }, // 2 = Hospital, 3 = Healthcare Worker
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        roleId: "$roleId",
                        verificationStatus: "$verificationStatus"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ])
    ]);

    const analytics = {
        hospitals: {
            total: 0,
            Pending: 0,
            Verified: 0,
            Rejected: 0
        },
        healthcareWorkers: {
            total: 0,
            Pending: 0,
            Verified: 0,
            Rejected: 0
        }
    };

    userAnalytics.forEach(({ _id, count }) => {
        const key = _id.roleId === 2
            ? "hospitals"
            : "healthcareWorkers";

        analytics[key][_id.verificationStatus] = count;
        analytics[key].total += count;
    });

    const provinces = locationCounts.find(item => item._id === 1)?.count || 0;
    const cities = locationCounts.find(item => item._id === 2)?.count || 0;


    return {
        hospitals: analytics.hospitals,
        healthcareWorkers: analytics.healthcareWorkers,
        departments,
        designations,
        locations: {
            provinces,
            cities
        }
    };
};

export { SuperAdminDashboardService };