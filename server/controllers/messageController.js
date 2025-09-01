const Message = require('../models/Message');
const User = require('../models/users');
const { uploadFile } = require('../utils/fileUpload');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, title, message } = req.body;
    const senderId = req.user.id;
    
    // Get sender's email
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    let attachmentPath = null;
    if (req.file) {
      attachmentPath = await uploadFile(req.file);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      senderEmail: sender.email,
      title,
      message,
      attachment: attachmentPath
    });

    await newMessage.save();
    
    // Update the freelancer's notifications or messages count if needed
    await User.findByIdAndUpdate(receiverId, { $inc: { unreadMessages: 1 } });

    res.status(201).json({ 
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('senderId', 'firstName lastName profilePic')
    .populate('receiverId', 'firstName lastName profilePic');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};