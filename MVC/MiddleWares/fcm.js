import admin from "../config/firebase";

export const sendNotification = async (deviceToken, title, body) => {
  await admin.messaging().send({
    token: deviceToken,
    notification: {
      title: title,
      body: body
    },
  });
};
