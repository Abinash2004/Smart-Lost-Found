const Claim = require("../models/Claim");
const FoundItem = require("../models/FoundItem");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");
const path = require('path');

// @desc Create a new claim
const createClaim = async (req, res) => {
  try {
    const { description, additionalInfo } = req.body;
    const { foundItemId } = req.params;

    const fullName = req.user.fullName;
    const contactNumber = req.user.contactNumber;

    let imageProof = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageProof = result.secure_url;
    }

    const newClaim = new Claim({
      foundItemId,
      fullName,
      contactNumber,
      description,
      imageProof,
      additionalInfo
    });

    // Save the new claim
    const savedClaim = await newClaim.save();
    
    try {
      // Find the found item to get owner's contact
      const foundItem = await FoundItem.findById(foundItemId);
      
      if (foundItem && foundItem.foundByContact) {
        // Create notification for the found item owner
        const notification = new Notification({
          contactNumber: foundItem.foundByContact,
          message: `You received a new claim on your found item: ${foundItem.title || 'unnamed item'}`,
          tag: 'claim_received',
          isRead: false
        });
        
        await notification.save();
      }
      
      res.status(201).json({
        message: "Claim submitted successfully",
        claim: savedClaim
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Still return success response even if notification fails
      res.status(201).json({
        message: "Claim submitted successfully (notification may not have been sent)",
        claim: savedClaim
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Get all claims for a specific found item
const getClaimsForFoundItem = async (req, res) => {
  try {
    const { foundItemId } = req.params;

    const claims = await Claim.find({ foundItemId }).sort({ createdAt: -1 });

    res.status(200).json({ claims });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc  Get all claims submitted by current user
const getPersonalClaims = async (req, res) => {
  try {
    const contactNumber = req.user.contactNumber;

    const claims = await Claim.find({ contactNumber }).sort({ createdAt: -1 });

    res.status(200).json({ claims });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc Get ranked claims for a found item based on AI similarity
const getRankedClaims = async (req, res) => {
  try {
    // Dynamically import the ESM module
    const modulePath = path.join(process.cwd(), 'handlers', 'rankedClaimHandler.mjs');
    const fileUrl = `file://${modulePath.replace(/\\/g, '/')}`;
    const { getRankedClaims: getRankedClaimsHandler } = await import(fileUrl);
    
    // Delegate to the ESM handler
    return getRankedClaimsHandler(req, res);
  } catch (error) {
    console.error('Failed to load ranked claims handler:', error);
    return res.status(500).json({
      message: "Failed to load ranking service",
      error: error.message
    });
  }
};

module.exports = {
  createClaim,
  getPersonalClaims,
  getClaimsForFoundItem,
  getRankedClaims
};
