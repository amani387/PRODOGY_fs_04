const Group = require("../models/Groups");
const Message = require("../models/Message");



// Send a message to a group
const sendMessageToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { message } = req.body;
  const sender = req.user.id;

 

  try {
    // Find the group to ensure it exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Create and save the new message
    const newMessage = new Message({
      room: groupId,
      sender,
      message,
      timestamp: new Date(),
    });
    await newMessage.save();

    // Populate message with sender details if needed
    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "username");

    // Emit to other group members via WebSocket (assuming Socket.io setup in app)
    req.app.get("io").to(groupId).emit("group message", populatedMessage);

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages for a group
const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ room: groupId })
      .populate("sender", "username")
      .sort({ timestamp: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendMessageToGroup,
  getGroupMessages,
};
