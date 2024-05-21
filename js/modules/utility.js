//-- Get highest bid amount
export { highestNumber };
//-- countdown for endtime listing
export { initializeCountdown };

/**
 * Function to calculate the highest bid amount
 * @param {object} listing
 * @returns {number}
 */
function highestNumber(listing) {
    if (!listing.bids || listing.bids.length === 0) {
      return 0;
    }
    return Math.max(...listing.bids.map((bid) => bid.amount));
  }
  /**
 * Function for countdown on listing
 * @param {string} listingId 
 * @param {string} endsAt 
 */
function initializeCountdown(listingId, endsAt) {
    const countdownElement = document.getElementById(`countdown-${listingId}`);
    const endsAtDate = new Date(endsAt);
  
    function updateCountdown() {
      const now = new Date();
      const timeRemaining = endsAtDate - now;
  
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        countdownElement.innerHTML = "Auction ended";
        clearInterval(countdownInterval);
      }
    }
    //-- Update timer every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }