const FoundItem = require("../models/FoundItem");

// @desc  Post a new found item
const createFoundItem = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryTag,
      foundLocation
    } = req.body;

    // Extract name and contact from JWT payload
    const foundByName = req.user.fullName;    
    const foundByContact = req.user.contactNumber;


    const foundItem = new FoundItem({
      title,
      description,
      categoryTag,
      foundLocation,
      foundByName,
      foundByContact
    });

    await foundItem.save();
    res.status(201).json({
      message: "Found item posted successfully",
      foundItem
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Get all found items (optional category filter)
const getAllFoundItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { categoryTag: category } : {};
    const items = await FoundItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Get all found items posted by current user
const getPersonalFoundItems = async (req, res) => {
  try {
    const contactNumber = req.user.contactNumber;

    const items = await FoundItem.find({ foundByContact: contactNumber }).sort({ createdAt: -1 });

    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Delete a found item if status is Pending
const deleteFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const contactNumber = req.user.contactNumber;

    const item = await FoundItem.findById(id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Ensure only the owner can delete
    if (item.foundByContact !== contactNumber) {
      return res.status(403).json({ message: "Unauthorized to delete this item" });
    }

    if (item.status !== "Pending") {
      return res.status(400).json({ message: "Cannot delete resolved items" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc  Get a single found item by ID
const getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await FoundItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createFoundItem,
  getAllFoundItems,
  getPersonalFoundItems,
  deleteFoundItem,
  getFoundItemById
};
