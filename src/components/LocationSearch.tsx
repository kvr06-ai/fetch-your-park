
import { MapPin, Search } from "lucide-react";
import { useState } from "react";

interface LocationSearchProps {
  onSearch: (location: string) => void;
  onUseMyLocation: () => void;
}

const LocationSearch = ({ onSearch, onUseMyLocation }: LocationSearchProps) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-6 text-gray-400" size={20} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or zip code"
            className="w-full pl-14 pr-6 py-4 text-lg bg-white rounded-full border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow duration-200"
          />
        </div>
      </form>

      <button
        onClick={onUseMyLocation}
        className="mt-4 mx-auto flex items-center gap-2 text-white hover:text-white/90 transition-colors duration-200"
      >
        <MapPin size={16} />
        Use my location
      </button>
    </div>
  );
};

export default LocationSearch;
