// const sendNotification = require("../firebase/sendNotification");
// const Message = require("../models/message");
// const jwt = require("jsonwebtoken");
// // const { sendNotification } = require("../firebase/sendNotifiction");

// const setupChatSocket = (io) => {
// console.log("token", "tests");
//   io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
   
//     console.log("token", socket.handshake.auth);


//     if (!token) {
//       return next(new Error("Authentication error: No token provided"));
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("token decoded", decoded);
//       socket.userId = decoded.id;
//       next();
//     } catch (err) {
//       return next(new Error("Authentication error: Invalid token"));
//     }
//   });

//   io.on("connection", (socket) => { 
//     console.log("sasadsada",socket);
//     console.log("connection")
//     socket.on("joinChat", (otherUserId) => {
//       if (!otherUserId) return;
//       const roomName = [socket.userId, otherUserId?.chatId].sort().join("-");

//       console.log("room1", roomName)
//       socket.join(roomName);
//     });

//     socket.on("sendMessage", async ({ receiverId, content,taskId }) => {
//       if (!receiverId || !content?.trim()) {
//         return socket.emit("error", { message: "Invalid message data" });
//       }

//       try {
//         const message = new Message({
//           sender: socket.userId,
//           taskId: socket.taskId || taskId,
//           receiver: receiverId,
//           content: content.trim(),
//         });

//         const savedMessage = await message.save();

//         const roomName = [socket.userId, receiverId].sort().join("-");

//         const messageToSend = {
//           _id: savedMessage._id,
//           sender: savedMessage.sender,
//           receiver: savedMessage.receiver,
//           taskId: savedMessage.taskId,
//           content: savedMessage.content,
//           createdAt: savedMessage.createdAt,
//         };


//         // console.log(messageToSend)

//         io.to(roomName).emit("receiveMessage", messageToSend);

//         console.log("room2", roomName)

//         // const receiverToken =
//         //   "daZI2WYdLUJ1j9oigf1RJH:APA91bGUolhnBaqSoVmdxijeeWiGxkmA0Yjl0iIJSYWbcXNvHpSDif6M2G1lH-rETIXkIcyQwYw8EZzvHtPGLJfkfEEgsu6dUR1TimLWbezb9seXoeCcddY";

//         // sendNotification(
//         //   receiverToken,
//         //   "New Message",
//         //   "You received a new message",
//         //   { screen: "chat" }
//         // );

//         // socket.emit("messageSent", messageToSend);
//       } catch (err) {
//         console.error("Error saving message:", err.message);
//         socket.emit("error", { message: "Failed to send message" });
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.userId}`);
//     });
//   });
// };

// module.exports = setupChatSocket;


const jwt = require("jsonwebtoken");
const Message = require("../models/message");
// const sendNotification = require("../firebase/sendNotification"); // uncomment when ready

const setupChatSocket = (io) => {
  console.log("[Socket.IO] → setup initialized");

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake?.auth?.token;

    if (!token) {
      console.log("[Socket Auth] → No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;       // or socket.user = decoded;
      console.log(`[Socket Auth] → Success: user ${socket.userId}`);
      next();
    } catch (err) {
      console.log("[Socket Auth] → Invalid token:", err.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] User connected → ${socket.userId}`);

    // Join private chat room (1-1 chat)
    socket.on("joinChat", ({ otherUserId, taskId }) => {
      if (!otherUserId) {
        socket.emit("error", { message: "otherUserId is required" });
        return;
      }

      // Create consistent room name (always sorted)
      const participants = [socket.userId, otherUserId].sort();
      let roomName = `${participants[0]}-${participants[1]}`;

      // Optional: per-task rooms
      if (taskId) {
        roomName += `-task-${taskId}`;
      }

      socket.join(roomName);
      console.log(`[Socket] ${socket.userId} joined room → ${roomName}`);

      // Optional: notify the room someone joined
      // io.to(roomName).emit("userJoined", { userId: socket.userId });
    });

    // Send message
    socket.on("sendMessage", async ({ receiverId, content, taskId }) => {
      if (!receiverId || !content?.trim()) {
        socket.emit("error", { message: "receiverId and content are required" });
        return;
      }

      try {
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          taskId: taskId || null,   // optional
          content: content.trim(),
        });

        const savedMessage = await message.save();

        const participants = [socket.userId, receiverId].sort();
        let roomName = `${participants[0]}-${participants[1]}`;
        if (taskId) roomName += `-task-${taskId}`;

        const messagePayload = {
          _id: savedMessage._id,
          sender: savedMessage.sender,
          receiver: savedMessage.receiver,
          taskId: savedMessage.taskId,
          content: savedMessage.content,
          createdAt: savedMessage.createdAt.toISOString(),
        };

        // Send to everyone in the room (both users)
        io.to(roomName).emit("receiveMessage", messagePayload);

        console.log(`[Socket] Message sent in room ${roomName}`);

        // Optional: push notification to offline user
        // sendNotificationToUser(receiverId, "New message", content.trim());

      } catch (err) {
        console.error("[Socket] Save message failed:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected → ${socket.userId}`);
    });
  });
};

module.exports = setupChatSocket;