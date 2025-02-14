
import { useState } from "react";
import LocationSearch from "../components/LocationSearch";
import ParkCard from "../components/ParkCard";
import { Dog, Map, Star, Info } from "lucide-react";
import { dogParks } from "../data/dogParks";

const NavigationItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <button className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-black/5 transition-colors duration-200">
    <Icon size={20} />
    <span className="font-medium">{text}</span>
  </button>
);

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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-gradient-to-r from-white to-secondary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">PawSpots</h1>
          </div>
        </div>
      </nav>

      <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/90 to-accent/90">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/e6014daf-4d70-4b74-9f32-e0c75f724fed.png')] bg-cover bg-center opacity-20"></div>
        
        <div className="container px-4 py-12 lg:py-24 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn">
              Find the Perfect Dog Park
            </h1>
            <p className="text-xl text-white/90 mb-12 animate-fadeIn">
              Discover nearby spots for your furry friend to play and socialize
            </p>
            
            <LocationSearch
              onSearch={handleSearch}
              onUseMyLocation={handleUseMyLocation}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gradient-to-r from-white via-secondary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar">
            <NavigationItem icon={Dog} text="Dog Parks" />
            <NavigationItem icon={Map} text="Dog Beaches" />
            <NavigationItem icon={Star} text="Top Rated" />
            <NavigationItem icon={Info} text="Resources" />
          </div>
        </div>
      </div>

      {searchPerformed && (
        <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-transparent to-secondary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogParks.map((park) => (
              <ParkCard key={park.name} {...park} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
