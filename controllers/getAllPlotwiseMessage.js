import Message from "../models/Message.Model.js";

export const getAllPlotwiseMessages = async (req, res) => {
  try {
    const { plotId } = req.params;

    if (!plotId) {
      return res.status(400).json({
        success: false,
        message: "plotId is required in params",
      });
    }

    const messages = await Message.find({ plotId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return res.status(200).json({
      success: true,
      plotId,
      totalMessages: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Error in getAllPlotwiseMessages:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages",
      error: error.message,
    });
  }
};
