const Claim = require("../models/Claim");
const cloudinary = require("../config/cloudinary");

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

    await newClaim.save();
    res.status(201).json({
      message: "Claim submitted successfully",
      claim: newClaim
    });
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
