
import { useState } from "react";
import LocationSearch from "../components/LocationSearch";
import ParkCard from "../components/ParkCard";

// Temporary mock data
const mockParks = [
  {
    id: 1,
    name: "Central Dog Park",
    address: "123 Park Avenue, New York, NY",
    rating: 4.5,
    distance: "0.3 miles",
    hours: "Open 6 AM - 10 PM",
  },
  {
    id: 2,
    name: "Riverside Dog Run",
    address: "456 River Road, New York, NY",
    rating: 4.8,
    distance: "0.7 miles",
    hours: "Open 24/7",
  },
  {
    id: 3,
    name: "Paws & Play Park",
    address: "789 Green Street, New York, NY",
    rating: 4.2,
    distance: "1.2 miles",
    hours: "Open 7 AM - 9 PM",
  },
];

const Index = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (location: string) => {
    console.log("Searching for:", location);
    setSearchPerformed(true);
  };

  const handleUseMyLocation = () => {
    console.log("Using user's location");
    setSearchPerformed(true);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container px-4 py-12 lg:py-24">
        <div className={`text-center transition-all duration-500 ${searchPerformed ? 'transform -translate-y-8' : ''}`}>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 animate-fadeIn">
            Find Dog Parks Near You
          </h1>
          <p className="text-lg text-muted-foreground mb-8 animate-fadeIn">
            Discover the perfect spot for your furry friend to play and socialize
          </p>
          
          <LocationSearch
            onSearch={handleSearch}
            onUseMyLocation={handleUseMyLocation}
          />
        </div>

        {searchPerformed && (
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockParks.map((park) => (
                <ParkCard key={park.id} {...park} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
