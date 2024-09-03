import express from "express";
import Notice from "../models/noticeModel.js"; // Adjust the path as needed

const router = express.Router();

// Fetch notifications for the user
router.get("/notifications", async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const notifications = await Notice.find({ team: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark a specific notification as read
router.post("/notifications/read", async (req, res) => {
  try {
    const { type, id } = req.body;
    const userId = req.user._id;

    if (type === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $ne: userId } },
        { $push: { isRead: userId } }
      );
    } else {
      await Notice.updateOne(
        { _id: id, team: userId, isRead: { $ne: userId } },
        { $push: { isRead: userId } }
      );
    }

    res.status(200).json({ message: "Notification(s) marked as read." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
