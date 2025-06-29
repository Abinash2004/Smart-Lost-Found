const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const { createClaim, getPersonalClaims, getClaimsForFoundItem} = require("../controllers/claimController");
const { approveClaim, rejectClaim } = require("../controllers/respondClaimController");
const upload = require("../middleware/upload");
const router = express.Router();

// GET: Extract all the claims issued by current user
router.get("/personal", verifyToken, getPersonalClaims);

// POST: Create a claim for a specific found item
router.post("/:foundItemId", verifyToken, upload.single('itemProofImage'), createClaim);

// GET: Get all claims for a specific found item
router.get("/found/:foundItemId", verifyToken, getClaimsForFoundItem);

// GET: Approve the claim and delete all the other claims
router.patch("/approve/:claimId", verifyToken, approveClaim);

// GET: Reject the claim
router.patch("/reject/:claimId", verifyToken, rejectClaim);


module.exports = router;