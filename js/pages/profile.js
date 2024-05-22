//Import scss from index.scss
import "../../scss/profile.scss";

//-- Single profile
import { getProfile } from "../modules/api.js";
//-- edit avatar
import { updateAvatar } from "../modules/api.js";
//-- create new listing
import { createListing } from "../modules/api.js";
//-- highest number of bid
import { highestNumber } from "../modules/utility.js"; 
//-- endtime for listing
import { initializeCountdown } from "../modules/utility.js";

//-- Loads and displays profile information --//
document.addEventListener('DOMContentLoaded', async function() {
    const userName = localStorage.getItem('userName'); // Assuming the userName is stored in localStorage
    const profileContainer = document.querySelector('main.container');
    const avatarElement = document.querySelector('.avatar img');
    const profileNameElement = document.querySelector('.card-title');
    const loader = document.getElementById('loader');
    const creditScoreElement = document.querySelector('.card-text');
    const yourListingsContainer = document.querySelector('.your-listings');
    const addAvatarButton = document.getElementById('add-avatar-button');
    const createListingButton = document.getElementById('create-listing-button');
    const updateAvatarForm = document.getElementById('updateAvatarForm');
    const createListingForm = document.getElementById('createListingForm');
    const mediaInputsContainer = document.getElementById('mediaInputsContainer');
    const addMediaButton = document.getElementById('addMediaButton');
    


    if (!userName) {
        loader.style.display = 'none';
      profileContainer.innerHTML = '<p class="text-center">No user logged in</p>';
      return;
    }
  
    try {
        loader.style.display = 'block';
      const profile = await getProfile(userName);
  
      //-- Update profile information
      avatarElement.src = profile.avatar.url || '/public/images/profileIcon.png';
      avatarElement.alt = profile.avatar.alt || 'Avatar';
      profileNameElement.textContent = profile.name;
      creditScoreElement.textContent = `Credit score: $${profile.credits}`;
  
      //-- Update your listings
      if (profile.listings && profile.listings.length > 0) {
        yourListingsContainer.innerHTML = '';
  
         //-- Fetch and display each listing
         profile.listings.forEach(listing => {
            console.log("Listing:", listing);
            const highestBid = highestNumber(listing);
            const listingElement = document.createElement('div');
            listingElement.className = 'col-md-6 mb-4'; 
            listingElement.innerHTML = `
              <div class="card h-100">
                <img src="${listing.media[0]?.url || '/public/images/listingImage.png'}" alt="${listing.media[0]?.alt || 'Listing Image'}" class="card-img-top mx-auto d-block">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-truncate">${listing.title}</h5>
                  <p class="card-text text-truncate">${listing.description}</p>
                  <div class="mt-auto">
                  <p class="card-text"><small><strong>Ends in:</strong> <span id="countdown-${listing.id}"></span></small></p>
                  </div>
                </div>
              </div>
            `;
            yourListingsContainer.appendChild(listingElement);
           //-- Initialize countdown for each listing
           initializeCountdown(`countdown-${listing.id}`, listing.endsAt);
            //-- Click event to navigate to the listing.html page with the listing ID
      listingElement.addEventListener('click', () => {
        window.location.href = `listing.html?id=${listing.id}`;
      });
    });
   }
   loader.style.display = 'none';
    } catch (error) {
        loader.style.display = 'none';
      console.error("Failed to fetch profile", error);
      profileContainer.innerHTML = '<p class="text-center">Failed to load profile. Please try again later or contact support if the issue persists.</p>';
    }
  
//-- Create New Listing --//

//-- Event listener for create listing button
    createListingButton.addEventListener('click', () => {
        // Open the modal
        const createListingModal = new bootstrap.Modal(document.getElementById('createListingModal'));
        createListingModal.show();
    });

//-- Event listener to add more media inputs
    addMediaButton.addEventListener('click', () => {
        const mediaInput = document.createElement('div');
        mediaInput.className = 'mb-3 media-input';
        mediaInput.innerHTML = `
            <label class="form-label">Media URL</label>
            <input type="url" class="form-control">
            <label class="form-label">Alt Text</label>
            <input type="text" class="form-control">
        `;
        mediaInputsContainer.appendChild(mediaInput);
    });

    //-- Event listener for the create listing form submission
    createListingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('listingTitle').value;
        const description = document.getElementById('listingDescription').value;
        const endsAt = new Date(document.getElementById('listingEndsAt').value).toISOString();

        const mediaInputs = mediaInputsContainer.querySelectorAll('.media-input');
        const media = Array.from(mediaInputs).map(input => {
            const url = input.querySelector('input[type="url"]').value;
            const alt = input.querySelector('input[type="text"]').value;
            return url ? { url, alt } : null;
        }).filter(item => item !== null); 

        const listingData = {
            title,
            description,
            media,
            endsAt
        };

        try {
            await createListing(listingData);
            alert('Listing created successfully');
            createListingForm.reset();
            mediaInputsContainer.innerHTML = ''; 

            bootstrap.Modal.getInstance(document.getElementById('createListingModal')).hide();
        } catch (error) {
            console.error("Failed to create listing", error);
            alert('Ensure image descriptions are limited to 120 characters, titles to 280 characters, and descriptions to 280 characters when creating a listing');
        }
    });

  //-- Edit Avatar --//

  //-- Event listener for add avatar button
  addAvatarButton.addEventListener('click', () => {
    const addAvatarModal = new bootstrap.Modal(document.getElementById('addAvatarModal'));
    addAvatarModal.show();
  });
  //-- Event listener for the update avatar form submission
  updateAvatarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const avatarUrl = document.getElementById('avatarUrl').value;
    const avatarAlt = document.getElementById('avatarAlt').value;

    try {
      await updateAvatar(userName, avatarUrl, avatarAlt);
      avatarElement.src = avatarUrl;
      avatarElement.alt = avatarAlt;
      alert('Avatar updated successfully');

      bootstrap.Modal.getInstance(document.getElementById('addAvatarModal')).hide();
    } catch (error) {
      console.error("Failed to update avatar", error);
      alert('Failed to update avatar. Please try again later. Ensure your internet connection is stable.');
    }
  });
});