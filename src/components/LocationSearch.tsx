
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface LocationSearchProps {
  onSearch: (location: string) => void;
  onUseMyLocation: () => void;
  isLoading?: boolean;
}

const LocationSearch = ({ onSearch, onUseMyLocation, isLoading }: LocationSearchProps) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-6 text-[#4A4A4A]" size={20} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city, state or zip code"
            className="w-full pl-14 pr-6 py-4 text-lg bg-white rounded-full border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4A4A4A]/20 transition-shadow duration-200"
            disabled={isLoading}
          />
        </div>
      </form>

      <Button
        onClick={onUseMyLocation}
        variant="outline"
        className="mt-4 mx-auto flex items-center gap-2 text-[#4A4A4A] hover:text-[#4A4A4A]/90 transition-colors bg-white/80"
        disabled={isLoading}
      >
        <MapPin size={16} />
        Use my location
      </Button>
    </div>
  );
};

export default LocationSearch;
