const Message = require("../models/message");

const getChatHistory = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user.id;

  console.log("message", otherUserId, userId);

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })

    console.log(messages)
      // .sort({ createdAt: 1 })
      // .populate("sender", "username")
      // .populate("receiver", "username");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getChatHistory };
