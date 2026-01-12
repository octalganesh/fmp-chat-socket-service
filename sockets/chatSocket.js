const sendNotification = require("../firebase/sendNotification");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
// const { sendNotification } = require("../firebase/sendNotifiction");

const setupChatSocket = (io) => {
  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("token",token);
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("token decoded",decoded);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
  
    console.log("connection")
    socket.on("joinChat", (otherUserId) => {
      if (!otherUserId) return;
      const roomName = [socket.userId, otherUserId?.chatId].sort().join("-");
      
         console.log("room1",roomName)
      socket.join(roomName);
    });

    socket.on("sendMessage", async ({ receiverId, content }) => {
      if (!receiverId || !content?.trim()) {
        return socket.emit("error", { message: "Invalid message data" });
      }

      try {
        const message = new Message({
          sender: socket.userId,
          taskId:socket.taskId,
          receiver: receiverId,
          content: content.trim(),
        });

        const savedMessage = await message.save();

        const roomName = [socket.userId, receiverId].sort().join("-");

        const messageToSend = {
          _id: savedMessage._id,
          sender: savedMessage.sender,
          receiver: savedMessage.receiver,
          taskId:savedMessage.taskId,
          content: savedMessage.content,
          createdAt: savedMessage.createdAt,
        };


        // console.log(messageToSend)

        io.to(roomName).emit("receiveMessage", messageToSend);

        console.log("room2",roomName)

        // const receiverToken =
        //   "daZI2WYdLUJ1j9oigf1RJH:APA91bGUolhnBaqSoVmdxijeeWiGxkmA0Yjl0iIJSYWbcXNvHpSDif6M2G1lH-rETIXkIcyQwYw8EZzvHtPGLJfkfEEgsu6dUR1TimLWbezb9seXoeCcddY";

        // sendNotification(
        //   receiverToken,
        //   "New Message",
        //   "You received a new message",
        //   { screen: "chat" }
        // );

        // socket.emit("messageSent", messageToSend);
      } catch (err) {
        console.error("Error saving message:", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = setupChatSocket;
