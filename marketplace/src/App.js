import { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaBell, FaQuestionCircle, FaEuroSign, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSync, FaUsers, FaFileAlt, FaBuilding, FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Add these helper functions back near the top of the file, before the europeanCities array
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6 for Monday-based week
}

// Add these helper arrays at the top of your component
const europeanCities = [
  { city: 'Berlin', country: 'Germany', code: 'DE' },
  { city: 'Paris', country: 'France', code: 'FR' },
  { city: 'Madrid', country: 'Spain', code: 'ES' },
  { city: 'Rome', country: 'Italy', code: 'IT' },
  { city: 'Amsterdam', country: 'Netherlands', code: 'NL' },
  { city: 'Brussels', country: 'Belgium', code: 'BE' },
  { city: 'Vienna', country: 'Austria', code: 'AT' },
  { city: 'Warsaw', country: 'Poland', code: 'PL' },
  { city: 'Prague', country: 'Czech Republic', code: 'CZ' },
  { city: 'Lisbon', country: 'Portugal', code: 'PT' },
  { city: 'Stockholm', country: 'Sweden', code: 'SE' },
  { city: 'Copenhagen', country: 'Denmark', code: 'DK' },
  { city: 'Budapest', country: 'Hungary', code: 'HU' },
  { city: 'Dublin', country: 'Ireland', code: 'IE' },
  { city: 'Helsinki', country: 'Finland', code: 'FI' }
];

// Generate random loads
const generateRandomLoads = (count) => {
  const loads = [];
  const today = new Date();
  const endDate = new Date('2025-01-31');
  
  for (let i = 0; i < count; i++) {
    const fromCity = europeanCities[Math.floor(Math.random() * europeanCities.length)];
    let toCity;
    do {
      toCity = europeanCities[Math.floor(Math.random() * europeanCities.length)];
    } while (toCity === fromCity);

    const loadingDate = new Date(today.getTime() + Math.random() * (endDate.getTime() - today.getTime()));
    const unloadingDate = new Date(loadingDate.getTime() + (24 * 60 * 60 * 1000) * (1 + Math.floor(Math.random() * 3)));

    loads.push({
      id: i + 8, // Start from 8 since you already have 7 loads
      from: { city: `${fromCity.city}, ${fromCity.country}`, radius: `+${(50 + Math.floor(Math.random() * 200))}km` },
      to: { city: `${toCity.city}, ${toCity.country}`, radius: `+${(50 + Math.floor(Math.random() * 200))}km` },
      type: ['40t Frigo', '40t Box', '40t Tautliner'][Math.floor(Math.random() * 3)],
      loading: {
        address: `${fromCity.code}, ${10000 + Math.floor(Math.random() * 89999)}, ${fromCity.city}`,
        date: loadingDate.toLocaleDateString('en-GB').split('/').join('.'),
        time: `${String(6 + Math.floor(Math.random() * 12)).padStart(2, '0')}:00-${String(14 + Math.floor(Math.random() * 8)).padStart(2, '0')}:00 CET`
      },
      unloading: {
        address: `${toCity.code}, ${10000 + Math.floor(Math.random() * 89999)}, ${toCity.city}`,
        date: unloadingDate.toLocaleDateString('en-GB').split('/').join('.'),
        time: `${String(8 + Math.floor(Math.random() * 10)).padStart(2, '0')}:00-${String(14 + Math.floor(Math.random() * 8)).padStart(2, '0')}:00 CET`
      },
      distance: `${300 + Math.floor(Math.random() * 1200)}km`,
      stops: `+ ${Math.floor(Math.random() * 3)} stops`,
      vehicleType: ['40t Tautliner', '40t Mega'][Math.floor(Math.random() * 2)],
      palletInfo: Math.random() > 0.5 ? 'Exchange required' : 'Exchange not required',
      price: (800 + Math.floor(Math.random() * 2200)).toLocaleString(),
      recommended: Math.random() > 0.7
    });
  }
  return loads;
};

// Move the generateRandomLoads call outside the component
// Add this code near the top of the file, after the europeanCities array
const INITIAL_LOADS = generateRandomLoads(100);

function App() {
  const [pickupRadius, setPickupRadius] = useState('+50 km');
  const [dropoffRadius, setDropoffRadius] = useState('+50 km');
  const [vehicleType, setVehicleType] = useState('');
  const [bidStatus, setBidStatus] = useState('Please select');
  const [sortBy, setSortBy] = useState('pickup_date');
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [isVehicleTypeOpen, setIsVehicleTypeOpen] = useState(false);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortColumn, setSortColumn] = useState('loading.date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [priceHistory, setPriceHistory] = useState({}); // To track price changes
  const [priceUpdateTimer, setPriceUpdateTimer] = useState(null);

  const vehicleTypes = [
    'Bus',
    'Car',
    'Van',
    '3.5t Truck',
    '7.5t Truck',
    '12t Truck',
    '40t Truck',
    '40t Tautliner'
  ];

  // Update your loads array
  const loads = INITIAL_LOADS;

  function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  const filteredLoads = loads.filter(load => {
    const pickupMatch = !pickupSearch || 
      load.from.city.toLowerCase().includes(pickupSearch.toLowerCase()) ||
      load.loading.address.toLowerCase().includes(pickupSearch.toLowerCase());
    
    const dropoffMatch = !dropoffSearch || 
      load.to.city.toLowerCase().includes(dropoffSearch.toLowerCase()) ||
      load.unloading.address.toLowerCase().includes(dropoffSearch.toLowerCase());
    
    const vehicleTypeMatch = selectedVehicleTypes.length === 0 || 
      selectedVehicleTypes.includes(load.vehicleType);

    const dateMatch = !selectedDate || 
      new Date(load.loading.date.split('.').reverse().join('-')) >= startOfDay(selectedDate);

    return pickupMatch && dropoffMatch && vehicleTypeMatch && dateMatch;
  });

  const getSortedLoads = (loads) => {
    return [...loads].sort((a, b) => {
      switch (sortBy) {
        case 'pickup_date':
          return new Date(a.loading.date) - new Date(b.loading.date);
        case 'price_asc':
          return parseFloat(a.price.replace(',', '')) - parseFloat(b.price.replace(',', ''));
        case 'price_desc':
          return parseFloat(b.price.replace(',', '')) - parseFloat(a.price.replace(',', ''));
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedLoads = getSortedLoads(filteredLoads);

  const handleVehicleTypeSelect = (type) => {
    setSelectedVehicleTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  // Update the getLoadsCountForDate function to handle future dates correctly
  function getLoadsCountForDate(date) {
    const dateString = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('.');
    
    // Count loads for this specific date
    const loadsForDate = loads.filter(load => {
      const loadDate = load.loading.date;
      return loadDate === dateString;
    });

    return loadsForDate.length;
  }

  // Add this helper function to distribute loads more evenly
  function distributeDates(startDate, endDate, count) {
    const dateRange = endDate.getTime() - startDate.getTime();
    const dates = [];
    
    for (let i = 0; i < count; i++) {
      const randomTime = startDate.getTime() + Math.random() * dateRange;
      dates.push(new Date(randomTime));
    }
    
    return dates.sort((a, b) => a.getTime() - b.getTime());
  }

  // Update the generateCalendarDays function to use the updated getLoadsCountForDate
  const generateCalendarDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    // Add the actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      // Remove the loads parameter since we'll use the global loads array
      const loadsCount = getLoadsCountForDate(date);
      
      days.push(
        <div
          key={`day-${day}`}
          className={`day ${isSelected ? 'selected' : ''} ${loadsCount > 0 ? 'has-loads' : ''}`}
          onClick={() => handleDateSelect(date)}
        >
          <span className="day-number">{day}</span>
          {loadsCount > 0 && <span className="loads-count">{loadsCount}</span>}
        </div>
      );
    }

    return days;
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    
    // Update sortColumn and sortDirection based on the selected value
    switch (value) {
      case 'pickup_date':
        setSortColumn('loading.date');
        setSortDirection('asc');
        break;
      case 'delivery_date':
        setSortColumn('unloading.date');
        setSortDirection('asc');
        break;
      case 'price_asc':
        setSortColumn('price');
        setSortDirection('asc');
        break;
      case 'price_desc':
        setSortColumn('price');
        setSortDirection('desc');
        break;
      default:
        setSortColumn('loading.date');
        setSortDirection('asc');
    }
  };

  const sortedLoads = [...filteredLoads].sort((a, b) => {
    switch (sortColumn) {
      case 'loading.date':
        const loadDateA = a.loading.date.split('.').reverse().join('-');
        const loadDateB = b.loading.date.split('.').reverse().join('-');
        return sortDirection === 'asc' 
          ? new Date(loadDateA) - new Date(loadDateB)
          : new Date(loadDateB) - new Date(loadDateA);
      
      case 'unloading.date':
        const unloadDateA = a.unloading.date.split('.').reverse().join('-');
        const unloadDateB = b.unloading.date.split('.').reverse().join('-');
        return sortDirection === 'asc' 
          ? new Date(unloadDateA) - new Date(unloadDateB)
          : new Date(unloadDateB) - new Date(unloadDateA);
      
      case 'price':
        const priceA = parseInt(a.price.replace(/[€,]/g, ''));
        const priceB = parseInt(b.price.replace(/[€,]/g, ''));
        return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
      
      default:
        return 0;
    }
  });

  // Add this function to handle clearing all filters
  const handleClearFilters = () => {
    // Reset all filter states to their default values
    setPickupSearch('');
    setDropoffSearch('');
    setPickupRadius('+50 km');
    setDropoffRadius('+50 km');
    setSelectedVehicleTypes([]);
    setSelectedDate(null);
    setBidStatus('Please select');
    setSortBy('pickup_date');
    setSortColumn('loading.date');
    setSortDirection('asc');
    
    // Close any open dropdowns
    setIsVehicleTypeOpen(false);
    setIsCalendarOpen(false);
  };

  // Add this function near your other state management functions in App.js
  const handleRefresh = () => {
    // You can add any refresh logic here if needed
    const refreshIcon = document.querySelector('.refresh svg');
    if (refreshIcon) {
      refreshIcon.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        refreshIcon.style.transform = 'rotate(0)';
      }, 300);
    }
  };

  const calendarRef = useRef(null);
  const vehicleTypeRef = useRef(null);
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
      if (vehicleTypeRef.current && !vehicleTypeRef.current.contains(event.target)) {
        setIsVehicleTypeOpen(false);
      }
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target)) {
        setShowDropoffSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSuggestions = (value, type) => {
    const inputValue = value.toLowerCase();
    const suggestions = new Set();

    loads.forEach(load => {
      const location = type === 'pickup' ? load.from.city : load.to.city;
      const address = type === 'pickup' ? load.loading.address : load.unloading.address;
      
      if (location.toLowerCase().includes(inputValue)) {
        suggestions.add(location);
      }
      if (address.toLowerCase().includes(inputValue)) {
        suggestions.add(address);
      }
    });

    return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
  };

  const handlePickupSearch = (e) => {
    const value = e.target.value;
    setPickupSearch(value);
    if (value.length > 1) {
      setPickupSuggestions(getSuggestions(value, 'pickup'));
      setShowPickupSuggestions(true);
    } else {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    }
  };

  const handleDropoffSearch = (e) => {
    const value = e.target.value;
    setDropoffSearch(value);
    if (value.length > 1) {
      setDropoffSuggestions(getSuggestions(value, 'dropoff'));
      setShowDropoffSuggestions(true);
    } else {
      setDropoffSuggestions([]);
      setShowDropoffSuggestions(false);
    }
  };

  // Add this function to group the loads
  const groupLoads = (loads) => {
    const groups = {};
    
    loads.forEach(load => {
      const key = `${load.from.city}-${load.to.city}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(load);
    });

    // Sort loads within each group by loading date
    Object.values(groups).forEach(group => {
      group.sort((a, b) => {
        const dateA = new Date(a.loading.date.split('.').reverse().join('-'));
        const dateB = new Date(b.loading.date.split('.').reverse().join('-'));
        return dateA - dateB;
      });
    });

    return groups;
  };

  // Add this function to handle accordion toggle
  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  // Add this function to simulate price updates
  const updateRandomPrices = () => {
    const updatedPrices = { ...priceHistory };
    
    // Randomly select ~10% of loads to update prices
    sortedLoads.forEach(load => {
      if (Math.random() < 0.1) { // 10% chance to update each load
        const currentPrice = parseInt(load.price.replace(/[€,]/g, ''));
        const priceChange = Math.floor(Math.random() * 200) - 100; // Random change between -100 and +100
        const newPrice = Math.max(currentPrice + priceChange, 500); // Ensure price doesn't go below 500
        
        updatedPrices[load.id] = {
          oldPrice: currentPrice,
          newPrice: newPrice,
          timestamp: Date.now()
        };
      }
    });
    
    setPriceHistory(updatedPrices);
  };

  // Add useEffect to start the price update timer
  useEffect(() => {
    // Update prices every 30 seconds
    const timer = setInterval(updateRandomPrices, 30000);
    setPriceUpdateTimer(timer);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Update the getPriceDisplay function
  const getPriceDisplay = (load) => {
    const priceUpdate = priceHistory[load.id];
    if (!priceUpdate) return `€${load.price}`;
    
    const timeSinceUpdate = Date.now() - priceUpdate.timestamp;
    if (timeSinceUpdate > 60000) return `€${priceUpdate.newPrice.toLocaleString()}`; // After 1 minute, show only new price
    
    // Price increase is good (green), decrease is bad (red)
    const isIncrease = priceUpdate.newPrice > priceUpdate.oldPrice;
    return (
      <span className={`price-update ${isIncrease ? 'price-decrease' : 'price-increase'}`}>
        <span className="old-price">€{priceUpdate.oldPrice.toLocaleString()}</span>
        <span className="new-price">€{priceUpdate.newPrice.toLocaleString()}</span>
        <span className="price-change-indicator">{isIncrease ? '↑' : '↓'}</span>
      </span>
    );
  };

  // Add this function to handle column header clicks
  const handleSort = (column) => {
    if (sortColumn === column) {
      // If clicking the same column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, set it and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
    
    // Update the sortBy dropdown to match
    switch (column) {
      case 'loading.date':
        setSortBy('pickup_date');
        break;
      case 'unloading.date':
        setSortBy('delivery_date');
        break;
      case 'price':
        setSortBy(sortDirection === 'asc' ? 'price_desc' : 'price_asc');
        break;
      default:
        setSortBy('pickup_date');
    }
  };

  return (
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
        <header className="header">
          <div className="logo">
            <FaTruck className="logo-icon" />
            <span>Marketplace</span>
          </div>
          <div className="header-icons">
            <FaBell />
            <FaQuestionCircle />
            <div className="currency-selector">
              <FaEuroSign />
            </div>
          </div>
        </header>

        <nav className="nav-tabs">
          <button className="tab active">All loads</button>
          <button className="tab">Tenders</button>
        </nav>

        <div className="filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Pickup</label>
              <div className="input-group" ref={pickupRef}>
                <FaMapMarkerAlt className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Address or postal code"
                  value={pickupSearch}
                  onChange={handlePickupSearch}
                />
                <select value={pickupRadius} onChange={(e) => setPickupRadius(e.target.value)}>
                  <option>+50 km</option>
                  <option>+100 km</option>
                  <option>+200 km</option>
                </select>
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {pickupSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => {
                          setPickupSearch(suggestion);
                          setShowPickupSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-group">
              <label>Dropoff</label>
              <div className="input-group" ref={dropoffRef}>
                <FaMapMarkerAlt className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Address or postal code"
                  value={dropoffSearch}
                  onChange={handleDropoffSearch}
                />
                <select value={dropoffRadius} onChange={(e) => setDropoffRadius(e.target.value)}>
                  <option>+50 km</option>
                  <option>+100 km</option>
                  <option>+200 km</option>
                </select>
                {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {dropoffSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => {
                          setDropoffSearch(suggestion);
                          setShowDropoffSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="filter-controls">
            <div className="date-picker-container">
              <div className="date-picker" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                <FaCalendarAlt />
                <span>
                  {selectedDate 
                    ? selectedDate.toLocaleDateString('en-GB', { 
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    : 'Pickup date'
                  }
                </span>
              </div>
              {isCalendarOpen && (
                <div className="calendar-dropdown" ref={calendarRef}>
                  <div className="calendar-header">
                    <div className="month-selector">
                      <button className="month-nav" onClick={handlePrevMonth}>←</button>
                      <span>
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button className="month-nav" onClick={handleNextMonth}>→</button>
                    </div>
                  </div>
                  <div className="calendar-grid">
                    <div className="calendar-month">
                      <div className="weekdays">
                        <div>MON</div>
                        <div>TUE</div>
                        <div>WED</div>
                        <div>THU</div>
                        <div>FRI</div>
                        <div>SAT</div>
                        <div>SUN</div>
                      </div>
                      <div className="days">
                        {generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth())}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="vehicle-type-container">
              <div className="vehicle-type-selector" onClick={() => setIsVehicleTypeOpen(!isVehicleTypeOpen)}>
                <FaTruck />
                <span>Vehicle type</span>
                {selectedVehicleTypes.length > 0 && <span className="selected-count">{selectedVehicleTypes.length}</span>}
              </div>
              
              {isVehicleTypeOpen && (
                <div className="vehicle-type-dropdown" ref={vehicleTypeRef}>
                  <div className="search-box">
                    <FaSearch />
                    <input type="text" placeholder="Search..." />
                  </div>
                  <div className="vehicle-types-list">
                    {vehicleTypes.map(type => (
                      <label key={type} className="vehicle-type-option">
                        <input
                          type="checkbox"
                          checked={selectedVehicleTypes.includes(type)}
                          onChange={() => handleVehicleTypeSelect(type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button onClick={() => setSelectedVehicleTypes([])}>Clear All</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="clear-filters" 
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="filter-actions">
            <div className="refresh" onClick={handleRefresh}>
              <FaSync /> Refresh list ({filteredLoads.length})
            </div>
            <div className="sort-controls">
              <div className="bid-status">
                <span>Bid status</span>
                <select value={bidStatus} onChange={(e) => setBidStatus(e.target.value)}>
                  <option>Please select</option>
                </select>
              </div>
              <div className="sort-by">
                <span>Sort by</span>
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="pickup_date">Pickup date</option>
                  <option value="delivery_date">Delivery date</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="loads-list">
          <div className="loads-header">
            <div 
              className="header-column loading clickable" 
              onClick={() => handleSort('loading.date')}
            >
              Loading
              {sortColumn === 'loading.date' && (
                <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </div>
            <div className="header-column route-stats"></div>
            <div 
              className="header-column unloading clickable"
              onClick={() => handleSort('unloading.date')}
            >
              Unloading
              {sortColumn === 'unloading.date' && (
                <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </div>
            <div className="header-column vehicle-types">
              Vehicle Types Allowed
            </div>
            <div className="header-column pallet-info">
              Pallet Information
            </div>
            <div 
              className="header-column price clickable"
              onClick={() => handleSort('price')}
            >
              Price
              {sortColumn === 'price' && (
                <span className="sort-indicator">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </div>
          </div>
          {Object.entries(groupLoads(sortedLoads)).map(([groupKey, groupLoads]) => {
            // If there's only one load in the group, render it normally
            if (groupLoads.length === 1) {
              const load = groupLoads[0];
              return (
                <div key={load.id} className="load-card">
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
                        <FaEuroSign /> Book now for {getPriceDisplay(load)}
                      </button>
                      <button className="bid-button">Place a bid</button>
                    </div>
                  </div>
                </div>
              );
            }

            // For multiple loads, show earliest load with deck appearance
            const [earliestLoad, ...remainingLoads] = groupLoads;
            
            return (
              <div key={groupKey}>
                <div className={`load-card ${remainingLoads.length > 0 ? 'has-more-loads' : ''}`}>
                  <div className="load-details">
                    <div className="detail-column">
                      <div className="location">{earliestLoad.loading.address}</div>
                      <div className="datetime">
                        {earliestLoad.loading.date}<br />
                        {earliestLoad.loading.time}
                      </div>
                    </div>

                    <div className="route-stats">
                      <div>{earliestLoad.distance}</div>
                      <div>{earliestLoad.stops}</div>
                    </div>

                    <div className="detail-column">
                      <div className="location">{earliestLoad.unloading.address}</div>
                      <div className="datetime">
                        {earliestLoad.unloading.date}<br />
                        {earliestLoad.unloading.time}
                      </div>
                    </div>

                    <div className="vehicle-info">
                      <div>{earliestLoad.vehicleType}</div>
                    </div>

                    <div className="pallet-info">
                      <div>{earliestLoad.palletInfo}</div>
                    </div>

                    <div className="price-column">
                      <button className="book-now">
                        <FaEuroSign /> Book now for {getPriceDisplay(earliestLoad)}
                      </button>
                      <button className="bid-button">Place a bid</button>
                    </div>
                  </div>

                  {remainingLoads.length > 0 && (
                    <div 
                      className="more-loads-indicator"
                      onClick={() => toggleGroup(groupKey)}
                    >
                      <span className="more-loads-count">
                        +{remainingLoads.length} more {remainingLoads.length === 1 ? 'load' : 'loads'} on this route
                      </span>
                      <span className={`more-loads-arrow ${expandedGroups.has(groupKey) ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </div>
                  )}
                </div>

                {expandedGroups.has(groupKey) && (
                  <div className="additional-loads">
                    {remainingLoads.map(load => (
                      <div key={load.id} className="load-card">
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
                              <FaEuroSign /> Book now for {getPriceDisplay(load)}
                            </button>
                            <button className="bid-button">Place a bid</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
