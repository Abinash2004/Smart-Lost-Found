const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  foundItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoundItem",
    required: true
  },
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  pictureDescription: String,
  itemProof: String,
  additionalInfo: String,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  rejectionFeedback: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);