import React, { useState } from 'react';
import './App.css';
import searchIcon from './assets/search.svg';
import filterIcon from './assets/filter.svg';

function App() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [distance, setDistance] = useState('+50 km');
  const [vehicleType, setVehicleType] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  const loads = [
    {
      id: 1,
      pickup: 'Hamburg, Germany (+150km)',
      dropoff: 'Amsterdam, Netherlands (+200km)',
      type: '40t Frigo',
      recommended: true,
      loadingDetails: {
        location: 'DE, 28199, Bremen',
        date: '19.12.2024',
        time: '21:00-21:30 CET'
      },
      unloadingDetails: {
        location: 'NL, 1012, Amsterdam',
        date: '23.12.2024',
        time: '02:00-23:59 CET'
      },
      distance: '798km',
      stops: 1,
      vehicleType: '40t Tautliner',
      palletInfo: 'Exchange not required',
      price: '€1,278'
    },
    {
      id: 2,
      pickup: 'Paris, France (+100km)',
      dropoff: 'Madrid, Spain (+150km)',
      type: '24t Box Truck',
      recommended: false,
      loadingDetails: {
        location: 'FR, 75001, Paris',
        date: '20.12.2024',
        time: '08:00-10:00 CET'
      },
      unloadingDetails: {
        location: 'ES, 28001, Madrid',
        date: '22.12.2024',
        time: '14:00-16:00 CET'
      },
      distance: '1,270km',
      stops: 2,
      vehicleType: '24t Box',
      palletInfo: 'Euro pallets exchange',
      price: '€2,150'
    },
    {
      id: 3,
      pickup: 'Milan, Italy (+50km)',
      dropoff: 'Munich, Germany (+100km)',
      type: '40t Mega',
      recommended: true,
      loadingDetails: {
        location: 'IT, 20121, Milan',
        date: '21.12.2024',
        time: '06:00-08:00 CET'
      },
      unloadingDetails: {
        location: 'DE, 80331, Munich',
        date: '22.12.2024',
        time: '18:00-20:00 CET'
      },
      distance: '510km',
      stops: 0,
      vehicleType: '40t Mega Trailer',
      palletInfo: 'No exchange needed',
      price: '€890'
    },
    {
      id: 4,
      pickup: 'Warsaw, Poland (+75km)',
      dropoff: 'Vienna, Austria (+125km)',
      type: '20t Van',
      recommended: false,
      loadingDetails: {
        location: 'PL, 00-001, Warsaw',
        date: '23.12.2024',
        time: '10:00-12:00 CET'
      },
      unloadingDetails: {
        location: 'AT, 1010, Vienna',
        date: '24.12.2024',
        time: '16:00-18:00 CET'
      },
      distance: '680km',
      stops: 1,
      vehicleType: '20t Van',
      palletInfo: 'Euro pallets exchange required',
      price: '€950'
    },
    {
      id: 5,
      pickup: 'Stockholm, Sweden (+200km)',
      dropoff: 'Copenhagen, Denmark (+100km)',
      type: '40t Reefer',
      recommended: true,
      loadingDetails: {
        location: 'SE, 111 29, Stockholm',
        date: '22.12.2024',
        time: '14:00-16:00 CET'
      },
      unloadingDetails: {
        location: 'DK, 1050, Copenhagen',
        date: '23.12.2024',
        time: '12:00-14:00 CET'
      },
      distance: '520km',
      stops: 0,
      vehicleType: '40t Reefer',
      palletInfo: 'Temperature controlled',
      price: '€1,450'
    }
  ];

  // Filter loads based on search criteria
  const filteredLoads = loads.filter(load => {
    const pickupMatch = load.pickup.toLowerCase().includes(pickupLocation.toLowerCase());
    const dropoffMatch = load.dropoff.toLowerCase().includes(dropoffLocation.toLowerCase());

    // If both search fields are empty, show all loads
    if (!pickupLocation && !dropoffLocation) {
      return true;
    }
    
    // If only pickup is entered, filter by pickup
    if (pickupLocation && !dropoffLocation) {
      return pickupMatch;
    }
    
    // If only dropoff is entered, filter by dropoff
    if (!pickupLocation && dropoffLocation) {
      return dropoffMatch;
    }
    
    // If both are entered, filter by both
    return pickupMatch && dropoffMatch;
  });

  return (
    <div className="marketplace">
      <header className="header">
        <div className="logo">Marketplace</div>
        <div className="header-icons">
          <button className="icon-button">🔔</button>
          <button className="icon-button">❓</button>
          <button className="currency-button">€</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className="tab active">All loads</button>
        <button className="tab">Tenders</button>
      </nav>

      <div className="filters">
        <div className="filter-section">
          <div className="filter-group">
            <label>Pickup</label>
            <div className="search-input">
              <img src={searchIcon} alt="search" />
              <input 
                type="text" 
                placeholder="Address or postal code"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
              <select value={distance} onChange={(e) => setDistance(e.target.value)}>
                <option>+50 km</option>
                <option>+100 km</option>
                <option>+200 km</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>Dropoff</label>
            <div className="search-input">
              <img src={searchIcon} alt="search" />
              <input 
                type="text" 
                placeholder="Address or postal code"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
              <select value={distance} onChange={(e) => setDistance(e.target.value)}>
                <option>+50 km</option>
                <option>+100 km</option>
                <option>+200 km</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="filter-button">
              <img src={filterIcon} alt="filter" />
              Vehicle type
            </button>
            <button className="save-filters">Save filters</button>
            <button className="clear-filters">Clear filters</button>
          </div>
        </div>
      </div>

      <div className="loads-list">
        {filteredLoads.map(load => (
          <div key={load.id} className="load-card">
            {load.recommended && <div className="recommended-badge">Recommended</div>}
            <div className="load-header">
              <div className="route-info">
                <div>{load.pickup} → {load.dropoff}</div>
                <div className="vehicle-type">{load.type}</div>
              </div>
              <button className="more-options">⋮</button>
            </div>
            <div className="load-details">
              <div className="detail-column">
                <h4>Loading</h4>
                <div>{load.loadingDetails.location}</div>
                <div>{load.loadingDetails.date}</div>
                <div>{load.loadingDetails.time}</div>
              </div>
              <div className="distance-info">
                <div>{load.distance}</div>
                <div>+{load.stops} stop</div>
              </div>
              <div className="detail-column">
                <h4>Unloading</h4>
                <div>{load.unloadingDetails.location}</div>
                <div>{load.unloadingDetails.date}</div>
                <div>{load.unloadingDetails.time}</div>
              </div>
              <div className="detail-column">
                <h4>Vehicle Types Allowed</h4>
                <div>{load.vehicleType}</div>
              </div>
              <div className="detail-column">
                <h4>Pallet Information</h4>
                <div>{load.palletInfo}</div>
              </div>
              <div className="price-column">
                <button className="book-now">Book now for {load.price}</button>
                <div className="complete-text">Complete a total of 5 loads to unlock</div>
                <button className="place-bid">Place a bid</button>
              </div>
            </div>
          </div>
        ))}
        {filteredLoads.length === 0 && (
          <div className="no-results">
            No loads found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default App;