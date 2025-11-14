import mongoose from "mongoose";
const { Schema } = mongoose;

const PlotSchema = new Schema(
  {
    plotName: {
      type: String,
      required: [true, "Plot name is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
    },

    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },

    area: {
      type: Number,
      required: [true, "Area is required"],
    },

    soilType: {
      type: String,
      default: "Unknown",
    },

    irrigationType: {
      type: String,
      default: "Unknown",
    },

    cropName: {
      type: String,
    },

    plantationDate: {
      type: Date,
      required: [true, "Plantation date is required"],
    },

    status: {
      type: String,
      enum: ["healthy", "moderate", "stressed"],
      default: "healthy",
    },

    message: {
      type: String,
      default:
        "Please ensure your crop is receiving sufficient sunlight and adequate water according to the season. Check the soil moisture regularly and irrigate early in the morning or late in the evening to reduce water loss. Remove weeds to prevent nutrient competition and inspect plants for any signs of pests or disease. Use organic compost or balanced fertilizer as recommended for your crop type. Keep your field clean and properly drained to avoid fungal growth. Stay alert to weather changes and take protective measures in advance.",
    },

    lastUpdated: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  }
);

const Plot = mongoose.model("Plot", PlotSchema);
export default Plot;
