const { messaging } = require("./firebase-admin");

const sendNotification = async (toToken, title, body, data = {}) => {
  const message = {
    token: toToken,
    notification: { title, body },
    data: { ...data },
    android: {
      priority: "high",
      notification: { channelId: "default_channel_id" }
    },
    apns: { payload: { aps: { sound: "default", badge: 1 } } },
  };

  try {
    const response = await messaging.send(message);
    console.log("Sent:", response);
    return response;
  } catch (error) {
    console.error("FCM Error:", error.code || error.message);
    throw error;
  }
};

module.exports = sendNotification;
