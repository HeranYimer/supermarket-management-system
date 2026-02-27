// backend/src/utils/unsplash.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Map common product names to specific search keywords
const UNSPLASH_KEYWORDS = {
  Apple: "red apple fruit",
  Banana: "banana fruit",
  Broccoli: "broccoli vegetable",
  Milk: "milk bottle dairy",
  Cheese: "cheese block",
  Chicken: "raw chicken meat",
  Egg: "egg chicken",
  Tomato: "fresh tomato vegetable",
  Potato: "potato vegetable",
  Onion: "onion vegetable",
  Carrot: "carrot vegetable",
  Orange: "orange fruit",
  Watermelon: "watermelon fruit",
  Pineapple: "pineapple fruit",
  // Add more products as needed
};

export const getImageForProduct = async (productName) => {
  try {
    // Use mapping if available, otherwise fallback to general search
    const query = encodeURIComponent(
      UNSPLASH_KEYWORDS[productName] || `${productName} grocery food`
    );

    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${ACCESS_KEY}&per_page=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small; // you can also use "regular"
    }

    // Fallback placeholder
    return "https://via.placeholder.com/150";
  } catch (err) {
    console.error("Unsplash API Error:", err);
    return "https://via.placeholder.com/150";
  }
};