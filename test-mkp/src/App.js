import { useState } from 'react';
import './App.css';
import LoadCard from './components/LoadCard';
import Calendar from './components/Calendar';
import generateLoads from './utils/generateLoads';

function App() {
  const [activeTab, setActiveTab] = useState('All loads');
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Generate 100 random loads (80 unique, 20 duplicates with different times)
  const dummyLoads = generateLoads(100);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  // Filter loads based on all criteria
  const filteredLoads = dummyLoads.filter(load => {
    const pickupMatch = load.pickup.toLowerCase().includes(pickupSearch.toLowerCase());
    const dropoffMatch = load.dropoff.toLowerCase().includes(dropoffSearch.toLowerCase());
    
    // Date filter
    const dateMatch = selectedDate ? load.pickupDate === selectedDate.toLocaleDateString('de-DE') : true;
    
    // If all fields are empty, show all loads
    if (!pickupSearch && !dropoffSearch && !selectedDate) return true;
    
    // Apply all active filters
    return pickupMatch && dropoffMatch && dateMatch;
  });

  // Group duplicate loads
  const groupedLoads = filteredLoads.reduce((acc, load) => {
    const key = `${load.pickup}-${load.dropoff}-${load.pickupDate}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(load);
    return acc;
  }, {});

  // Sort loads within each group by pickup time
  Object.values(groupedLoads).forEach(group => {
    group.sort((a, b) => {
      const timeA = a.pickupTime.split('-')[0];
      const timeB = b.pickupTime.split('-')[0];
      return timeA.localeCompare(timeB);
    });
  });

  // Handle search reset
  const handleClearFilters = () => {
    setPickupSearch('');
    setDropoffSearch('');
    setSelectedDate(null);
  };

  return (
    <div className="marketplace">
      <div className="header">
        <h1>Marketplace</h1>
      </div>
      
      <div className="tabs">
        <button 
          className={activeTab === 'All loads' ? 'active' : ''} 
          onClick={() => setActiveTab('All loads')}
        >
          All loads
        </button>
        <button 
          className={activeTab === 'Tenders' ? 'active' : ''} 
          onClick={() => setActiveTab('Tenders')}
        >
          Tenders
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <button 
            className="date-picker-button"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {selectedDate 
              ? selectedDate.toLocaleDateString('de-DE')
              : 'Pickup date'
            }
          </button>
          {showCalendar && (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              loads={dummyLoads}
            />
          )}
          <input 
            type="text" 
            placeholder="Pickup location" 
            value={pickupSearch}
            onChange={(e) => setPickupSearch(e.target.value)}
          />
          <select>
            <option>+50 km</option>
          </select>
        </div>
        <div className="filter-group">
          <input 
            type="text" 
            placeholder="Dropoff location" 
            value={dropoffSearch}
            onChange={(e) => setDropoffSearch(e.target.value)}
          />
          <select>
            <option>+50 km</option>
          </select>
        </div>
        <select>
          <option>Vehicle type</option>
        </select>
        <button className="save-filters">Save filters</button>
        <button className="clear-filters" onClick={handleClearFilters}>
          Clear filters
        </button>
      </div>

      <div className="loads-container">
        {Object.values(groupedLoads).length > 0 ? (
          Object.values(groupedLoads).map((loadGroup, index) => (
            <LoadCard 
              key={index} 
              loads={loadGroup}
            />
          ))
        ) : (
          <div className="no-results">No loads found matching your search criteria</div>
        )}
      </div>
    </div>
  );
}

export default App;
