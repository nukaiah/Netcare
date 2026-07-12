import { createDocumentActivityService, getDocumentActivitiesService, getDocumentTimelineService } from "../Services/DocumentActivityService.js";
import { successResponse } from "../Utils/Response.js";

const createDocumentActivityController = async (req, res, next) => {
    try {
        const activityData = req.body||{};
        const result = await createDocumentActivityService(activityData);
        return successResponse(res, result, "Activity found successfully");
    } catch (error) {
        return next(error);
    }
};

const getDocumentActivitiesController = async (req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const limit = Number(req.body.limit) || 20;
        const result = await getDocumentActivitiesService(page, limit);
        return successResponse(res, result, "Activity found successfully");
    } catch (error) {
        return next(error);
    }
};

const getDocumentTimelineController = async (req, res, next) => {
    try {
        const { documentId } = req.body || {}
        console.log(documentId);
        const result = await getDocumentTimelineService(documentId);
        return successResponse(res, result, "Timeline found suucessfully");
    } catch (error) {
        return next(error);
    }

};

export { createDocumentActivityController,getDocumentActivitiesController, getDocumentTimelineController };