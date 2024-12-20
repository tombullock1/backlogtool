const europeanCities = [
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Berlin", country: "Germany" },
  { city: "Paris", country: "France" },
  { city: "Madrid", country: "Spain" },
  { city: "Rome", country: "Italy" },
  { city: "Vienna", country: "Austria" },
  { city: "Prague", country: "Czech Republic" },
  { city: "Warsaw", country: "Poland" },
  { city: "Brussels", country: "Belgium" },
  { city: "Munich", country: "Germany" },
  { city: "Hamburg", country: "Germany" },
  { city: "Milan", country: "Italy" },
  { city: "Barcelona", country: "Spain" },
  { city: "Porto", country: "Portugal" },
  { city: "Lyon", country: "France" }
];

const vehicleTypes = ["40t Tautliner", "40t Mega", "40t Frigo", "40t Box"];

const generateRandomDate = () => {
  const start = new Date(2024, 11, 15); // December 15, 2024
  const end = new Date(2025, 0, 31);    // January 31, 2025
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toLocaleDateString('de-DE');
};

const generateRandomTime = () => {
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minutes = Math.random() < 0.5 ? '00' : '30';
  const endHours = String(Math.min(23, parseInt(hours) + Math.floor(Math.random() * 3))).padStart(2, '0');
  return `${hours}:${minutes}-${endHours}:${minutes}`;
};

const generateRandomPrice = () => {
  return (Math.floor(Math.random() * (2000 - 800) + 800)).toLocaleString();
};

const calculateDistance = () => {
  return Math.floor(Math.random() * (1500 - 300) + 300);
};

const generateLoad = () => {
  const pickupCity = europeanCities[Math.floor(Math.random() * europeanCities.length)];
  let dropoffCity = europeanCities[Math.floor(Math.random() * europeanCities.length)];
  
  // Ensure pickup and dropoff cities are different
  while (dropoffCity === pickupCity) {
    dropoffCity = europeanCities[Math.floor(Math.random() * europeanCities.length)];
  }

  return {
    pickup: `${pickupCity.city}, ${pickupCity.country}`,
    dropoff: `${dropoffCity.city}, ${dropoffCity.country}`,
    distance: calculateDistance().toString(),
    pickupLocation: `${pickupCity.city}, ${pickupCity.country}`,
    pickupDate: generateRandomDate(),
    pickupTime: generateRandomTime(),
    dropoffLocation: `${dropoffCity.city}, ${dropoffCity.country}`,
    dropoffDate: generateRandomDate(),
    dropoffTime: generateRandomTime(),
    vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
    palletInfo: "Exchange not required",
    price: generateRandomPrice()
  };
};

const generateLoads = (count) => {
  const loads = [];
  const baseCount = Math.floor(count * 0.8); // 80% of total count for unique loads
  const duplicateCount = count - baseCount; // 20% for duplicates

  // Generate base loads
  for (let i = 0; i < baseCount; i++) {
    loads.push(generateLoad());
  }

  // Generate duplicates with different pickup times
  for (let i = 0; i < duplicateCount; i++) {
    const originalLoad = { ...loads[Math.floor(Math.random() * baseCount)] };
    originalLoad.pickupTime = generateRandomTime(); // Only change the pickup time
    loads.push(originalLoad);
  }

  // Shuffle the array
  return loads.sort(() => Math.random() - 0.5);
};

export default generateLoads; 