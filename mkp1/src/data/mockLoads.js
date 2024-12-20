export const mockLoads = [
  {
    id: "3450418A",
    from: {
      city: "Bremen, Germany",
      radius: "+50km"
    },
    to: {
      city: "Berlin, Germany",
      radius: "+50km"
    },
    loading: {
      address: "DE, 28199, Bremen",
      date: "19.12.2024",
      time: "21:00-21:30 CET"
    },
    unloading: {
      address: "DE, 10115, Berlin",
      date: "23.12.2024",
      time: "02:00-23:59 CET"
    },
    distance: "798km",
    stops: "+ 1 stop",
    type: "40t Tautliner",
    vehicleType: "40t Tautliner",
    palletInfo: "30 items",
    price: "1,278",
    recommended: true,
    description: "IMPORTANT: XL Code with beverage certificate mandatory +++ After reloading, PLEASE inform immediately the Carrier Manager including photo of the documents so unloading slot can be booked, otherwise, unloading will NOT be possible +++ Self unloading/loading possible"
  },
  {
    id: "3450419B",
    from: {
      city: "Hamburg, Germany",
      radius: "+50km"
    },
    to: {
      city: "Munich, Germany",
      radius: "+50km"
    },
    loading: {
      address: "DE, 20457, Hamburg",
      date: "20.12.2024",
      time: "08:00-16:00 CET"
    },
    unloading: {
      address: "DE, 80331, Munich",
      date: "21.12.2024",
      time: "09:00-17:00 CET"
    },
    distance: "790km",
    stops: "Direct",
    type: "40t Box",
    vehicleType: "40t Box",
    palletInfo: "22 items",
    price: "1,450",
    recommended: false,
    description: "Temperature controlled transport required. Maintain 2-8°C throughout journey. Digital temperature logging required."
  },
  {
    id: "3450420C",
    from: {
      city: "Frankfurt, Germany",
      radius: "+75km"
    },
    to: {
      city: "Warsaw, Poland",
      radius: "+50km"
    },
    loading: {
      address: "DE, 60313, Frankfurt",
      date: "21.12.2024",
      time: "06:00-14:00 CET"
    },
    unloading: {
      address: "PL, 00-001, Warsaw",
      date: "22.12.2024",
      time: "10:00-18:00 CET"
    },
    distance: "1,093km",
    stops: "+ 2 stops",
    type: "40t Frigo",
    vehicleType: "40t Frigo",
    palletInfo: "26 items",
    price: "1,890",
    recommended: true,
    description: "ADR transport required. Class 3 certification needed. Tail lift required for unloading."
  },
  {
    id: "3450421D",
    from: {
      city: "Rotterdam, Netherlands",
      radius: "+25km"
    },
    to: {
      city: "Paris, France",
      radius: "+50km"
    },
    loading: {
      address: "NL, 3011, Rotterdam",
      date: "22.12.2024",
      time: "07:00-15:00 CET"
    },
    unloading: {
      address: "FR, 75001, Paris",
      date: "23.12.2024",
      time: "08:00-16:00 CET"
    },
    distance: "503km",
    stops: "Direct",
    type: "40t Tautliner",
    vehicleType: "40t Tautliner",
    palletInfo: "18 items",
    price: "980",
    recommended: false,
    description: "Express delivery required. GPS tracking mandatory. Call recipient 1 hour before arrival."
  },
  {
    id: "3450422E",
    from: {
      city: "Vienna, Austria",
      radius: "+50km"
    },
    to: {
      city: "Prague, Czech Republic",
      radius: "+25km"
    },
    loading: {
      address: "AT, 1010, Vienna",
      date: "23.12.2024",
      time: "09:00-17:00 CET"
    },
    unloading: {
      address: "CZ, 110 00, Prague",
      date: "24.12.2024",
      time: "08:00-16:00 CET"
    },
    distance: "333km",
    stops: "Direct",
    type: "40t Box",
    vehicleType: "40t Box",
    palletInfo: "15 items",
    price: "750",
    recommended: true,
    description: "Fragile goods. Handle with care. Unloading assistance provided at destination."
  }
];

// Helper function to get a load by ID
export const getLoadById = (id) => {
  return mockLoads.find(load => load.id === id);
};

// Helper function to filter loads
export const filterLoads = (filters) => {
  return mockLoads.filter(load => {
    const matchesPickup = !filters.pickup || 
      load.from.city.toLowerCase().includes(filters.pickup.toLowerCase());
    
    const matchesDropoff = !filters.dropoff || 
      load.to.city.toLowerCase().includes(filters.dropoff.toLowerCase());
    
    const matchesVehicleType = !filters.vehicleType || 
      load.vehicleType === filters.vehicleType;
    
    const matchesDate = !filters.date || 
      load.loading.date === filters.date;
    
    return matchesPickup && matchesDropoff && matchesVehicleType && matchesDate;
  });
}; 