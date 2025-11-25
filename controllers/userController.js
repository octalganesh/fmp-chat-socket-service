const user = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await user.find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers };