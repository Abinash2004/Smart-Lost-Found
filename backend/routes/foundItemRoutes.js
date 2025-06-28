const express = require("express");
const router = express.Router();
const {
  createFoundItem,
  getAllFoundItems,
  resolveFoundItem,
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

module.exports = router;
