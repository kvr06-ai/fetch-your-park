
import { MapPin } from "lucide-react";
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
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your location"
          className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 focus:outline-none focus:border-secondary transition-colors duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors duration-200"
        >
          Search
        </button>
      </form>

      <button
        onClick={onUseMyLocation}
        className="mt-4 mx-auto flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <MapPin size={16} />
        Use my location
      </button>
    </div>
  );
};

export default LocationSearch;
