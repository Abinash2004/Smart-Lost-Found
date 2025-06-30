const Claim = require("../models/Claim");
const FoundItem = require("../models/FoundItem");

// @desc Approve a claim and update related data
const approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    // Find the selected claim
    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // Mark this claim as approved
    claim.status = "Approved";
    await claim.save();

    // Reject all other claims for same item
    await Claim.updateMany(
      { foundItemId: claim.foundItemId, _id: { $ne: claimId } },
      { $set: { status: "Rejected" } },
      { $set: { rejectionFeedback: "Your description didn't matched with the item." } }
    );

    // Update found item as resolved
    const foundItem = await FoundItem.findById(claim.foundItemId);
    if (foundItem) {
      foundItem.status = "Resolved";
      foundItem.returnedDate = new Date();
      foundItem.returnedTo = claim.fullName;
      await foundItem.save();
    }

    res.status(200).json({
      message: "Claim approved. Other claims rejected. Item marked as returned.",
      approvedClaim: claim
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Reject a specific claim manually with optional feedback
const rejectClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { feedback } = req.body;

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.status !== "Pending") {
      return res.status(400).json({ message: `Cannot reject a claim that is already ${claim.status}` });
    }

    claim.status = "Rejected";
    claim.rejectionFeedback = feedback || "Rejected by reviewer.";
    await claim.save();

    res.status(200).json({ message: "Claim rejected successfully", claim });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { approveClaim, rejectClaim };
