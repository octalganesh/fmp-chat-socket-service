const Message = require("../models/message");
const jwt = require("jsonwebtoken");

const setupChatSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("joinChat", (otherUserId) => {
      if (!otherUserId) return;
      const roomName = [socket.userId, otherUserId?.chatId].sort().join("-");
      socket.join(roomName);
      console.log(`User ${socket.userId} joined room: ${roomName}`);
    });

    socket.on("sendMessage", async ({ receiverId, content }) => {
      console.log("Message received → To:", receiverId, "| Content:", content);

      if (!receiverId || !content?.trim()) {
        return socket.emit("error", { message: "Invalid message data" });
      }

      try {
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content: content.trim(),
        });

        const savedMessage = await message.save();

        const roomName = [socket.userId, receiverId].sort().join("-");

        const messageToSend = {
          _id: savedMessage._id,
          sender: savedMessage.sender,
          receiver: savedMessage.receiver,
          content: savedMessage.content,
          createdAt: savedMessage.createdAt,
        };

        io.to(roomName).emit("receiveMessage", messageToSend);

        socket.emit("messageSent", messageToSend);

        console.log("Message saved & sent successfully");
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
