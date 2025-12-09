import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    plotId: {
      type: Schema.Types.ObjectId,
      ref: "Plot",
      required: true,
    },

    message: {
      type: String,
      required: true,
      default:
        "Please ensure your crop is receiving sufficient sunlight and adequate water according to the season. Check the soil moisture regularly and irrigate early in the morning or late in the evening to reduce water loss. Remove weeds to prevent nutrient competition and inspect plants for any signs of pests or disease. Use organic compost or balanced fertilizer as recommended for your crop type. Keep your field clean and properly drained to avoid fungal growth. Stay alert to weather changes and take protective measures in advance.",
    },

    status: {
      type: String,
      enum: ["healthy", "moderate", "stress"],
      default: "healthy",
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Message", MessageSchema);
