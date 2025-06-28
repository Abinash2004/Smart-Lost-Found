const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  summarizedDescription: String, // optional for now
  categoryTag: {
    type: String,
    enum: [
      "Electronics",
      "Documents & ID",
      "Clothing & Accessories",
      "Stationery & Books",
      "Keys & Cards",
      "Jewelry & Valuables",
      "Miscellaneous"
    ],
    required: true
  },
  foundDate: { type: Date, default: Date.now },
  foundLocation: { type: String, required: true },
  foundByName: { type: String, required: true },
  foundByContact: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  
  returnedDate: { type: Date, default: null },
  returnedTo: { type: String, default: null }

}, { timestamps: true });

module.exports = mongoose.model("FoundItem", foundItemSchema);