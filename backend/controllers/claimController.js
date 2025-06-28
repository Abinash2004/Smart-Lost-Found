const Claim = require("../models/Claim");

// @desc  Create a new claim request
const createClaim = async (req, res) => {
  try {
    const { foundItemId } = req.params;
    const {
      pictureDescription,
      itemDescriptionProof,
      additionalInfo
    } = req.body;

    // Extract user info from JWT
    const fullName = req.user.fullName;
    const contactNumber = req.user.contactNumber;

    const newClaim = new Claim({
      foundItemId,
      fullName,
      contactNumber,
      pictureDescription,
      itemDescriptionProof,
      additionalInfo
    });

    await newClaim.save();
    res.status(201).json({ message: "Claim submitted successfully", newClaim });

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


module.exports = {
  createClaim,
  getPersonalClaims,
  getClaimsForFoundItem
};
