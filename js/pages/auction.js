//Import scss from index.scss
import "../../scss/auction.scss";

//-- All listings
import { getAllListings } from "../modules/api.js";
//-- Search listings
import { searchListings } from "../modules/api.js";
//-- Highest number on a bid 
import { highestNumber } from "../modules/utility.js";
//-- End time for listing
import { initializeCountdown } from "../modules/utility.js";

//-- Loads and displays listings including images, titles, descriptions, end times, and bid counts, with error handling for fetching data
document.addEventListener('DOMContentLoaded', async function() {
  const listingsContainer = document.getElementById('listings-container');
  const loader = document.getElementById('loader');
  const statusFilter = document.getElementById('status-filter');
  const searchBar = document.getElementById('search-bar');
  //-- Variable to store all fetched listings
  let allListings = []; 
  //-- Variable to store filtered listings based on search
  let filteredListings = []; 

  //-- Function to display listings
  function displayListings(listings) {
    listingsContainer.innerHTML = '';
    loader.style.display = 'none';


    if (listings.length === 0) {
      listingsContainer.innerHTML = '<p class="text-center">No listings available</p>';
      return;
    }
    
    listings.forEach(listing => {
      const highestBid = highestNumber(listing);
      const listingElement = document.createElement('div');
      listingElement.className = 'col-md-6 mb-4';
      listingElement.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${listing.media[0]?.url || '/public/images/listingImage.png'}" alt="${listing.media[0]?.alt || 'Listing Image'}" class="card-img-top">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text text-truncate">${listing.description}</p>
            <div class="mt-auto">
              <p class="card-text"><small><strong>Ends in:</strong> <span id="countdown-${listing.id}"></span></small></p>
              <p class="card-text"><small><strong>Highest Bid:</strong> $${highestBid}</small></p>
            </div>
          </div>
        </div>
      `;
      listingsContainer.appendChild(listingElement);

      //-- Initialize countdown for each listing
      initializeCountdown(`countdown-${listing.id}`, listing.endsAt);
      //-- Click event to navigate to the listing.html page with the listing ID
      listingElement.addEventListener('click', () => {
        window.location.href = `listing.html?id=${listing.id}`;
      });
    });
  }

  //-- Function to filter and display listings based on active status
  function filterAndDisplayListings() {
    const isActiveFilter = statusFilter.value === 'active';
    const activeFilteredListings = isActiveFilter ? filteredListings.filter(listing => new Date(listing.endsAt) > new Date()) : filteredListings;
    displayListings(activeFilteredListings);
  }

  //-- Function to load all listings
  async function loadListings() {
    try {
      loader.style.display = 'block';
      allListings = await getAllListings();
      filteredListings = allListings;
      filterAndDisplayListings();
    } catch (error) {
      loader.style.display = 'none';
      console.error("Failed to fetch listings", error);
      listingsContainer.innerHTML = '<p class="text-center">Failed to search listings. Please try again later or contact support if the issue persists.</p>';
    }
  }

  //-- Function to search and display listings
  async function searchAndDisplayListings(query) {
    try {
      loader.style.display = 'block';
      if (query.length > 0) {
        const listings = await searchListings(query);
        filteredListings = listings;
      } else {
        filteredListings = allListings;
      }
      filterAndDisplayListings();
    } catch (error) {
      loader.style.display = 'none';
      console.error("Failed to search listings", error);
      listingsContainer.innerHTML = '<p class="text-center">Failed to search listings</p>';
    }
  }

  //-- Load listings initially
  loadListings();

  //-- Reload listings when the status filter changes
  statusFilter.addEventListener('change', filterAndDisplayListings);

  //-- Search listings when the search bar input changes
  searchBar.addEventListener('input', function(event) {
    const query = event.target.value;
    searchAndDisplayListings(query);
  });
});