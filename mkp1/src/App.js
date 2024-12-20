import { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaBell, FaQuestionCircle, FaEuroSign, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSync, FaUsers, FaFileAlt, FaBuilding, FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from 'react-router-dom';
import OrderDetails from './components/OrderDetails';
import MarketplaceContent from './components/MarketplaceContent';

// Move MarketplaceContent component to a separate file
// Create a new file: src/components/MarketplaceContent.js and move the component there

// Update the App component to handle routing more simply
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Render the main content
  return (
    <div className="app-container">
      {location.pathname === '/' ? (
        <div className="marketplace">
          <div className="sidebar">
            <FaUsers className="sidebar-icon" />
            <FaFileAlt className="sidebar-icon" />
            <FaTruck className="sidebar-icon active" />
            <FaMapMarkerAlt className="sidebar-icon" />
            <FaEuroSign className="sidebar-icon" />
            <FaBuilding className="sidebar-icon" />
          </div>
          <div className="main-content">
            <MarketplaceContent />
          </div>
        </div>
      ) : location.pathname.startsWith('/order/') ? (
        <OrderDetails id={location.pathname.split('/')[2]} />
      ) : (
        <div>Page not found</div>
      )}
    </div>
  );
}

export default App;
