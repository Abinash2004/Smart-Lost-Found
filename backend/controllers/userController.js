const User = require("../models/User");

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, contactNumber } = req.body;

    // Basic input validation
    if (!fullName || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid contact number",
      });
    }

    // Find the current user using token (req.user.id is set by middleware)
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user is trying to change phone number, check if it already exists
    if (currentUser.contactNumber !== contactNumber) {
      const existingUser = await User.findOne({ contactNumber });
      if (existingUser && existingUser._id.toString() !== currentUser._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Contact number already in use by another account",
        });
      }
    }

    // Update user's profile
    currentUser.fullName = fullName;
    currentUser.contactNumber = contactNumber;

    await currentUser.save();

    // Remove password from response
    const { password, ...userWithoutPassword } = currentUser.toObject();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
};
