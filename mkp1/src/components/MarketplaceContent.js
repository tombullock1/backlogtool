import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaQuestionCircle, FaEuroSign, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSync, FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { mockLoads, filterLoads } from '../data/mockLoads';

function MarketplaceContent() {
  const navigate = useNavigate();
  const [loads, setLoads] = useState(mockLoads);
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);

  // Filter loads when search criteria change
  useEffect(() => {
    const filteredLoads = filterLoads({
      pickup: pickupSearch,
      dropoff: dropoffSearch,
      date: selectedDate,
      vehicleType: selectedVehicleTypes[0]
    });
    setLoads(filteredLoads);
  }, [pickupSearch, dropoffSearch, selectedDate, selectedVehicleTypes]);

  return (
    <>
      <header className="header">
        <div className="logo">
          <FaTruck className="logo-icon" />
          <span>Marketplace</span>
        </div>
        <div className="header-icons">
          <FaBell />
          <FaQuestionCircle />
          <FaEuroSign />
        </div>
      </header>

      {/* Add your existing filter controls here */}

      <div className="loads-list">
        {loads.map(load => (
          <div key={load.id} className="load-card" onClick={() => navigate(`/order/${load.id}`)}>
            <div className="load-details">
              <div className="detail-column">
                <div className="location">{load.loading.address}</div>
                <div className="datetime">
                  {load.loading.date}<br />
                  {load.loading.time}
                </div>
              </div>

              <div className="route-stats">
                <div>{load.distance}</div>
                <div>{load.stops}</div>
              </div>

              <div className="detail-column">
                <div className="location">{load.unloading.address}</div>
                <div className="datetime">
                  {load.unloading.date}<br />
                  {load.unloading.time}
                </div>
              </div>

              <div className="vehicle-info">
                <div>{load.vehicleType}</div>
              </div>

              <div className="pallet-info">
                <div>{load.palletInfo}</div>
              </div>

              <div className="price-column">
                <button className="book-now">
                  <FaEuroSign /> Book now for €{load.price}
                </button>
                <button className="bid-button">Place a bid</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MarketplaceContent; 