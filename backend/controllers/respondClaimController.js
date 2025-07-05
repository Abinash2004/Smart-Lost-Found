const Claim = require("../models/Claim");
const FoundItem = require("../models/FoundItem");
const Notification = require("../models/Notification");

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

    // Get found item for notification
    const foundItem = await FoundItem.findById(claim.foundItemId);
    const itemName = foundItem?.itemName || 'the item';

    // Send approval notification to claimant
    if (claim.contactNumber) {
      const notification = new Notification({
        contactNumber: claim.contactNumber,
        message: `Your claim on ${itemName} has been approved.`,
        tag: 'claim_approved',
        isRead: false
      });
      await notification.save().catch(err => 
        console.error('Error sending approval notification:', err)
      );
    }

    // Reject all other claims for same item
    const rejectedClaims = await Claim.find({
      foundItemId: claim.foundItemId,
      _id: { $ne: claimId },
      status: "Pending"
    });

    // Process rejections and send notifications
    for (const rejectedClaim of rejectedClaims) {
      rejectedClaim.status = "Rejected";
      rejectedClaim.rejectionFeedback = "Your description didn't match with the item.";
      await rejectedClaim.save();

      if (rejectedClaim.contactNumber) {
        const notification = new Notification({
          contactNumber: rejectedClaim.contactNumber,
          message: `Your claim on ${itemName} has been rejected.`,
          tag: 'claim_rejected',
          isRead: false
        });
        await notification.save().catch(err => 
          console.error('Error sending rejection notification:', err)
        );
      }
    }
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

    // Send rejection notification
    try {
      const foundItem = await FoundItem.findById(claim.foundItemId);
      const itemName = foundItem?.itemName || 'the item';
      
      if (claim.contactNumber) {
        const notification = new Notification({
          contactNumber: claim.contactNumber,
          message: `Your claim on ${itemName} has been rejected.`,
          tag: 'claim_rejected',
          isRead: false
        });
        await notification.save();
      }
    } catch (error) {
      console.error('Error sending rejection notification:', error);
      // Continue with response even if notification fails
    }

    res.status(200).json({ 
      message: "Claim rejected successfully", 
      claim 
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { approveClaim, rejectClaim };
