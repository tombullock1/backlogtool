import React, { useState } from 'react';

const LoadCard = ({ loads }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mainLoad = loads[0]; // First load is always the earliest
  const hasAlternatives = loads.length > 1;

  return (
    <div className="load-card">
      <div className="load-header">
        <div className="route">
          {mainLoad.pickup} → {mainLoad.dropoff}
        </div>
        <div className="distance">{mainLoad.distance}km</div>
      </div>
      
      <div className="load-details">
        <div className="detail-column">
          <h4>Loading</h4>
          <div className="location">{mainLoad.pickupLocation}</div>
          <div className="date">{mainLoad.pickupDate}</div>
          <div className="time">{mainLoad.pickupTime} CET</div>
        </div>

        <div className="detail-column">
          <h4>Unloading</h4>
          <div className="location">{mainLoad.dropoffLocation}</div>
          <div className="date">{mainLoad.dropoffDate}</div>
          <div className="time">{mainLoad.dropoffTime} CET</div>
        </div>

        <div className="detail-column">
          <h4>Vehicle Types Allowed</h4>
          <div>{mainLoad.vehicleType}</div>
        </div>

        <div className="detail-column">
          <h4>Pallet Information</h4>
          <div>{mainLoad.palletInfo}</div>
        </div>

        <div className="detail-column price">
          <button className="book-now">
            Book now for €{mainLoad.price}
          </button>
          <div className="complete-text">Complete a total of 5 loads to unlock</div>
          <button className="place-bid">Place a bid</button>
        </div>
      </div>

      {hasAlternatives && (
        <div className="alternatives">
          <button 
            className={`alternatives-toggle ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'} alternative pickup times ({loads.length - 1})
          </button>
          
          {isExpanded && (
            <div className="alternatives-content">
              {loads.slice(1).map((load, index) => (
                <div key={index} className="alternative-time">
                  <div className="alternative-details">
                    <div className="time">{load.pickupTime} CET</div>
                    <div className="price">€{load.price}</div>
                  </div>
                  <div className="alternative-actions">
                    <button className="book-alternative">Book now</button>
                    <button className="bid-alternative">Place a bid</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadCard;
