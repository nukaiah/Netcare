// import admin from "../config/firebase.js";
// import healthCareWorkerSchema from '../Models/HealthCareWorkerModel.js';
// import { sendErrorResponse } from "./Response.js";

// const sendNotification = async (res, deviceToken, title, body, data = {}) => {
//   if (!deviceToken) throw new Error("deviceToken is required");
//   if (!title) throw new Error("title is required");
//   if (!body) throw new Error("body is required");

//   try {
//     const message = {
//       token: deviceToken,
//       data: {
//         title: title,
//         body: body,
//         url: "/dashboard"
//       },
//       webpush: {
//         headers: {
//           Urgency: "high"
//         }
//       }
//     };

//     const response = await admin.messaging().send(message);
//     return response;
//   } catch (error) {
//     return sendErrorResponse(res, error.message);
//     console.error("Error sending notification:", error.message);
//   }
// };

// const sendBulkNotification = async (res, deviceTokens, title, body, data = {}) => {

//   if (!title) throw new Error("title is required");
//   if (!body) throw new Error("body is required");

//   const chunkSize = 500;
//   let totalSuccess = 0;
//   let totalFailure = 0;
//   let invalidTokens = [];

//   for (let i = 0; i < deviceTokens.length; i += chunkSize) {
//     const chunk = deviceTokens.slice(i, i + chunkSize);

//     try {
//       const response = await admin.messaging().sendEachForMulticast({
//         tokens: chunk,
//         notification: { title, body },
//         data
//       });

//       totalSuccess += response.successCount;
//       totalFailure += response.failureCount;

//       response.responses.forEach((resp, index) => {
//         if (!resp.success) {
//           invalidTokens.push(chunk[index]);
//         }
//       });

//     } catch (error) {
//       return sendErrorResponse(res, error.message);
//       // console.error("Batch error:", error.message);
//     }
//   }

//   // Remove invalid tokens from DB
//   if (invalidTokens.length > 0) {
//     await healthCareWorkerSchema.updateMany(
//       {},
//       { $pull: { fcmTokens: { $in: invalidTokens } } }
//     );
//   }


//   return {
//     success: totalSuccess,
//     failed: totalFailure
//   };
// };

// export { sendNotification, sendBulkNotification };
