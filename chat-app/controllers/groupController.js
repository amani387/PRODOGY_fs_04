// controllers/groupChatController.js
const { timeStamp } = require("console");
const Group = require("../models/Groups");
const User = require("../models/User");





// Create a new chat group
const createGroup = async (req, res) => {
  const { name,  members } = req.body; // members should be an array of user IDs
  const userId =req.user.id
  
  console.log(
    "here is group info ",req.body
  )
  try {
    // Check if a group with the same name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group name already exists' });
    }

    // Create a new group with the provided name and members
    const newGroup = new Group({
      name,
      members: [userId, ...members],  // Include the creator and other selected members
    });
    await newGroup.save();

    return res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// get groups 
const getGroups = async (req, res) => {

  try {
    // Check if req.user exists and has an _id
    console.log("the id is ",req.user);
        
    
    
    if (!req.user.id) {
      return res.status(400).json({ message: 'User information is missing or invalid.' });
    }

    const userGroups = await Group.find({ members: req.user.id });
    return res.status(200).json(userGroups);
  }
   catch (error)
    {
    console.error('Error fetching groups:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Add a user to a group
const addMemberToGroup = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is already a member
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    return res.status(200).json({ message: 'User added to group', group });
  } catch (error) {
    console.error('Error adding user to group:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



const PostMessage =async (req,res)=>{
  const {groupId} =req.params;
  const {message,sender} =req.body;
  try {
    const group = await Group.findById(groupId);
    group.messages.push({
      sender,message,timeStamp:new Date()
    });
    await group.save();
    res.status(201).json(group.messages)
  } catch (error) {
    
  }
}

module.exports = {
  createGroup,
  getGroups,
  addMemberToGroup,
  PostMessage
};
