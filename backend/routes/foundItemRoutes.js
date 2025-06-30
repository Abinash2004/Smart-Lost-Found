const express = require("express");
const router = express.Router();
const {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  getPersonalFoundItems,
  deleteFoundItem
} = require("../controllers/foundItemController");

const verifyToken = require("../middleware/authMiddleware");

// POST a found item (protected)
router.post("/", verifyToken, createFoundItem);

// GET all found items (with optional category)
router.get("/", getAllFoundItems);

// DELETE: delete the found item post if and only if its not resolved
router.delete("/:id", verifyToken, deleteFoundItem);

// GET: Get all found items posted by the current user
router.get("/personal", verifyToken, getPersonalFoundItems);

// ⚠️ Place BEFORE DELETE route to avoid collision
router.get("/:id", verifyToken, getFoundItemById);

module.exports = router;
