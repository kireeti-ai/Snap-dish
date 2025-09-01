// src/components/LocationModal/LocationModal.js

import React, { useContext, useState, useRef } from 'react';
import './LocationModel.css';
import { StoreContext } from '../../Context/StoreContext';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';


const libraries = ['places'];

const LocationModal = ({ setShowLocationModal }) => {
  const { setLocation } = useContext(StoreContext);
  const autocompleteRef = useRef(null);

  // This hook loads the Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDjJQOIclqe3ydi-GEaoVrDXa21wNjTc6E', // Use the same key
    libraries,
  });
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDjJQOIclqe3ydi-GEaoVrDXa21wNjTc6E`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
          setLocation({
            address: data.results[0].formatted_address,
            latitude,
            longitude,
          });
          setShowLocationModal(false);
        } else {
          alert('Could not determine address from your location.');
        }
      }, () => {
        alert('Permission to access location was denied.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setLocation({
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });
        setShowLocationModal(false); // Close modal
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="modal-header">
          <h2>Select Your Location</h2>
          <button onClick={() => setShowLocationModal(false)} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for area, street name..."
              className="location-search-input"
            />
          </Autocomplete>
          <button onClick={handleDetectLocation} className="detect-location-btn">
             📍 Detect My Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;