import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaQuestionCircle, FaEuroSign, FaMapMarkerAlt } from 'react-icons/fa';
import './OrderDetails.css';

function OrderDetails({ load }) {
  const navigate = useNavigate();

  return (
    <div className="order-details">
      <header className="order-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to the marketplace
          </button>
        </div>
        <div className="header-right">
          <FaBell className="header-icon" />
          <FaQuestionCircle className="header-icon" />
          <FaEuroSign className="header-icon" />
        </div>
      </header>

      <div className="order-content">
        <div className="order-title">
          <h1>#{load?.id || '3450418A'} | Route details</h1>
          <button className="address-link">Win the load to see the full address</button>
        </div>

        <div className="order-grid">
          <div className="location-details loading">
            <div className="location-icon">
              <div className="icon-circle">
                <FaMapMarkerAlt />
              </div>
              <div className="vertical-line"></div>
            </div>
            <div className="location-info">
              <h3>Loading</h3>
              <p className="address">DE, 28199, Bremen</p>
              <p className="datetime">19.12.2024</p>
              <p className="time">21:00-21:30 CET</p>
              <div className="stops">1 Stops →</div>
            </div>
          </div>

          <div className="location-details unloading">
            <div className="location-icon">
              <div className="icon-circle">
                <FaMapMarkerAlt />
              </div>
            </div>
            <div className="location-info">
              <h3>Unloading</h3>
              <p className="address">DE, 28199, Bremen</p>
              <p className="datetime">23.12.2024</p>
              <p className="time">02:00-23:59 CET</p>
            </div>
          </div>

          <div className="estimated-distance">
            <p>Estimated distance: 798km</p>
          </div>
        </div>

        <div className="load-details-section">
          <h2>Load details</h2>
          
          <div className="details-grid">
            <div className="detail-column">
              <h3>Truck specifications</h3>
              <p>40t Tautliner</p>
            </div>
            
            <div className="detail-column">
              <h3>Requirements</h3>
              <p>Code XL</p>
            </div>
            
            <div className="detail-column">
              <h3>Load specifications</h3>
              <p>Weight: 25.175t</p>
              <p>Pallet Info: 30 items</p>
            </div>
          </div>

          <div className="load-description">
            <h3>Load description</h3>
            <p>
              Shipment description: IMPORTANT: XL Code with beverage certificate mandatory +++ 
              After reloading, PLEASE inform immediately the Carrier Manager including photo of 
              the documents so unloading slot can be booked, otherwise, unloading will NOT be 
              possible +++ Self unloading/loading possible
            </p>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-info">
            <h2>Book now</h2>
            <p>You can skip bidding by accepting this price. Click "Book now" to claim this opportunity</p>
            <div className="earnings">
              <span>You earn:</span>
              <span className="price">€1,278</span>
            </div>
            <p className="unlock-text">Complete a total of 5 loads to unlock</p>
          </div>
          
          <div className="bidding-section">
            <h2>Bid for this shipment</h2>
            <div className="bid-input">
              <input type="number" placeholder="Enter a bid" />
              <span className="currency">€</span>
              <span className="no-condition">No condition</span>
            </div>
            <textarea 
              className="bid-notes" 
              placeholder="Add condition details or a note with your bid"
            ></textarea>
            <button className="place-bid-button">Place bid</button>
            <p className="terms-text">
              By placing a bid, you agree to 
              <a href="/terms">GENERAL TERMS AND CONDITIONS for Carriers/Transport Companies - Version 1/2024</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails; 