//-- Import the JWT 
import { getToken } from "./auth.js";
//-- Import the API key 
import { apiKey } from "./auth.js";


//-- Register user 
export { registerUser }; 
//-- Login user 
export { loginUser }; 
//-- All listings
export { getAllListings };
//-- Search listing
export { searchListings };
//-- Single profile
export { getProfile };
//-- Edit profile avatar
export { updateAvatar };
//-- Create Listing
export { createListing };

//-- Utility --//
//-- Base URL 
const API_BASE_URL = "https://v2.api.noroff.dev";

function getHeaders(includeContentType = true) {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
    "X-Noroff-API-Key": apiKey,
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

//-- API Calls --//
/**
 * register user profile
 * @param {Object} userData
 * @returns {Promise}
 */
async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response;
  }
  /**
   * login user profile
   * @param {string} email
   * @param {string} password
   * @returns {Promise}
   */
  async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error("Login failed");
    }
  
    const result = await response.json();
    return result.data;
  }
 /**
 * Retrieve all listings
 * @returns {Promise}
 */
async function getAllListings() {
  const url = `${API_BASE_URL}/auction/listings?_bids=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(false), 
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  const result = await response.json();
  return result.data;
}
/**
 * Search listings by title or description
 * @param {string}
 * @returns {Promise}
 */
async function searchListings(query) {
  const url = `${API_BASE_URL}/auction/listings/search?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Failed to search listings");
  }

  const result = await response.json();
  return result.data;
}
/**
 * Retrieve a single profile by its name
 * @param {string} name - The profile name
 * @returns {Promise}
 */
async function getProfile(name) {
  const url = `${API_BASE_URL}/auction/profiles/${encodeURIComponent(name)}?_listings=true&_bids=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const result = await response.json();
  return result.data;
}
/**
 * 
 * @param {string} name 
 * @param {string} avatarUrl 
 * @param {string} avatarAlt 
 * @returns 
 */
async function updateAvatar(name, avatarUrl, avatarAlt) {
  const url = `${API_BASE_URL}/auction/profiles/${encodeURIComponent(name)}`;
  const body = {
    avatar: {
      url: avatarUrl,
      alt: avatarAlt,
    },
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to update avatar");
  }

  const result = await response.json();
  return result.data;
}
/**
 * 
 * @param {string} listingData 
 * @returns 
 */
async function createListing(listingData) {
  const url = `${API_BASE_URL}/auction/listings`;

  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`Failed to create listing: ${errorResponse.message}`);
  }

  const result = await response.json();
  return result;
}