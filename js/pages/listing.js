//Import scss from index.scss
import "../../scss/listing.scss";

//-- get single listing
import { getSingleListing } from "../modules/api.js";
// PlaceBid to a listing
import { placeBid } from "../modules/api.js";
//-- End time for listing
import { initializeCountdown } from "../modules/utility.js";
//-- highest amount bid on listing
import { highestNumber } from "../modules/utility.js";


document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("id");
    const loader = document.getElementById('loader');
    const userName = localStorage.getItem('userName');

    if (!listingId) {
        console.error("No listing ID found in URL");
        return;
    }

    try {
        loader.style.display = 'block';
        const listing = await getSingleListing(listingId);

        if (!listing) {
            console.error("Listing not found");
            return;
        }

        // Update listing details in the DOM
        const listingImage = document.getElementById('listing-image');
        const listingTitle = document.getElementById('listing-title');
        const listingSeller = document.getElementById('listing-seller');
        const listingDescription = document.getElementById('listing-description');
        const highestBidElement = document.getElementById('highest-bid');
        const biddingHistory = document.getElementById('bidding-history');
        const timeRemainingElement = document.getElementById('time-remaining');

        if (listingImage) {
            listingImage.src = listing.media[0]?.url || '/public/images/listingImage.png';
            listingImage.alt = listing.media[0]?.alt || 'Listing Image';
        }

        if (listingTitle) {
            listingTitle.textContent = listing.title;
        }

        if (listingSeller) {
            listingSeller.textContent = `Seller: ${listing.seller.name}`;
        }

        if (listingDescription) {
            listingDescription.textContent = listing.description;
        }

        if (highestBidElement) {
            highestBidElement.textContent = `$${highestNumber(listing)}`;
        }

        if (timeRemainingElement) {
            // Initialize countdown timer
            initializeCountdown('time-remaining', listing.endsAt);
        }

        //-- Populate bidding history
        if (biddingHistory) {
            biddingHistory.innerHTML = '';
            listing.bids.forEach(bid => {
                const bidItem = document.createElement('li');
                bidItem.className = 'list-group-item';
                bidItem.textContent = ` ${bid.bidder.name} bid: $${bid.amount}`;
                biddingHistory.appendChild(bidItem);
            });
        }

    //-- Check if the user is logged in
    const bidButton = document.getElementById('bid-button');
    const bidMessage = document.getElementById('bid-message');

    if (!userName) {
      bidButton.disabled = true;
      bidMessage.innerHTML = 'Please <a href="/html/register-login.html">log in or register</a> to place a bid.';
    } else {
      //-- Event listener for placing a bid
      if (bidButton) {
        bidButton.addEventListener('click', async () => {
          const bidAmount = parseFloat(document.getElementById('bid-amount').value);
          if (isNaN(bidAmount) || bidAmount <= 0) {
            alert("Please enter a valid bid amount");
            return;
          }

          try {
            await placeBid(listingId, bidAmount);
            alert(`Bid placed successfully: $${bidAmount}`);
            location.reload();
          } catch (error) {
            console.error("Failed to place bid", error);
            alert("Failed to place bid. Please ensure your bid exceeds the current highest bid. If the problem persists, check your internet connection and try again.");
          }
        });
      }
      loader.style.display = 'none';
    }
  } catch (error) {
    loader.style.display = 'none';
    console.error("An error occurred while loading the listing details. Please refresh the page or try again later. If the issue persists, check your internet connection or contact support for assistance.", error);
  }
});