import admin from "../config/firebase.js";

const sendNotification = async (deviceToken, title, body) => {
  if (!deviceToken) throw new Error("deviceToken is required");
  if (!title) throw new Error("title is required");
  if (!body) throw new Error("body is required");

  try {
    await admin.messaging().send({
      token: deviceToken,
      notification: { title, body },
    });
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

export default sendNotification;
