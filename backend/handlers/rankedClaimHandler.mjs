import { Client } from "@gradio/client";
import mongoose from 'mongoose';

// Import models using dynamic import for ESM compatibility
const Claim = (await import('../models/Claim.js')).default;
const FoundItem = (await import('../models/FoundItem.js')).default;

export async function getRankedClaims(req, res) {
  try {
    const { foundItemId } = req.params;

    // Find the found item to get its description
    const foundItem = await FoundItem.findById(foundItemId).lean();
    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // Get all claims for this found item
    const claims = await Claim.find({ foundItemId }).lean();
    if (claims.length === 0) {
      return res.json({ claims: [] });
    }

    let client;
    try {
      // Initialize Gradio client for SimPulse
      client = await Client.connect("abinash28/SimPulse");
    } catch (error) {
      console.error('Failed to connect to SimPulse API:', error);
      return res.status(503).json({
        message: "Similarity scoring service is currently unavailable",
        error: error.message
      });
    }

    // Process each claim to get similarity score
    const claimsWithScores = await Promise.all(claims.map(async (claim) => {
      try {
        // Call SimPulse API to get similarity score
        const result = await client.predict("/predict", {
          text1: foundItem.description || "",
          text2: claim.description || "",
        });

        // Convert score to percentage (assuming result.data[0] is between 0 and 1)
        const score = Math.round(result.data[0] || 0);
        
        return {
          ...claim,
          score
        };
      } catch (error) {
        console.error(`Error processing claim ${claim._id}:`, error);
        return {
          ...claim,
          score: -1, // Indicates scoring failed
          error: "Failed to calculate similarity score"
        };
      }
    }));

    // Filter out failed scores and sort by score in descending order
    const validClaims = claimsWithScores
      .filter(claim => claim.score >= 0)
      .sort((a, b) => b.score - a.score);

    return res.json({
      message: "Claims retrieved and ranked successfully",
      claims: validClaims,
      totalClaims: claims.length,
      scoredClaims: validClaims.length
    });

  } catch (error) {
    console.error('Error in getRankedClaims:', error);
    return res.status(500).json({
      message: "Server error while processing claims",
      error: error.message
    });
  }
}
