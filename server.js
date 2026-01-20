// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const userRoutes = require("./routes/userRoutes");

// const setupChatSocket = require("./sockets/chatSocket");

// connectDB();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// console.log("process.env.JWT_SECRET",process.env.JWT_SECRET);
// setupChatSocket(io);

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

// app.use((req, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });


// const PORT = process.env.PORT || 4000;


// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });




require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const setupChatSocket = require("./sockets/chatSocket");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ← in production → change to your actual frontend URL(s)
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Optional: better to log whether secret is set (helps debugging)
console.log("JWT_SECRET is set →", !!process.env.JWT_SECRET);

setupChatSocket(io);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});