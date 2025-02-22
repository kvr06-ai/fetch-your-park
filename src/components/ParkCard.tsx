
import { MapPin, Clock, Globe, Phone, Star, Droplet, Wheelchair, Dog, Bench } from "lucide-react";
import { DogPark, WorkingHours } from "../types/dogPark";

const formatHours = (hours: WorkingHours | null): string => {
  if (!hours) return "Hours not available";
  const today = new Date().toLocaleString('en-us', {weekday: 'long'}) as keyof WorkingHours;
  return hours[today] || "Hours not available";
};

interface ParkCardProps extends DogPark {
  distance?: number;
}

const ParkCard = ({ 
  name, 
  full_address, 
  photo, 
  working_hours, 
  site, 
  phone, 
  rating,
  reviews,
  has_water,
  has_benches,
  wheelchair_accessible,
  good_for_off_leash,
  distance
}: ParkCardProps) => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-[#A8B5A0]/20 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-slideUp hover:bg-gradient-to-br hover:from-white hover:to-[#F2FCE2]">
      {photo && (
        <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-[#1a2942] mb-2 tracking-tight">{name}</h3>
      
      <div className="space-y-3">
        {distance !== undefined && (
          <p className="text-sm font-medium text-[#4A4A4A]">
            {distance} miles away
          </p>
        )}

        <div className="flex items-start gap-2 text-[#2C3E50]">
          <MapPin size={16} className="mt-1 shrink-0" />
          <p className="text-sm font-medium">{full_address}</p>
        </div>

        {rating && (
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={16} />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-sm text-[#2C3E50]">({reviews} reviews)</span>
          </div>
        )}
        
        <div className="flex items-start gap-2 text-[#2C3E50]">
          <Clock size={16} className="mt-1 shrink-0" />
          <p className="text-sm font-medium">{formatHours(working_hours)}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {has_water && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
              <Droplet size={12} />
              Water
            </span>
          )}
          {has_benches && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
              <Bench size={12} />
              Benches
            </span>
          )}
          {wheelchair_accessible && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs">
              <Wheelchair size={12} />
              Accessible
            </span>
          )}
          {good_for_off_leash && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-700 text-xs">
              <Dog size={12} />
              Off-leash
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {site && (
            <a 
              href={site} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1a2942] hover:text-[#4A4A4A] transition-colors"
            >
              <Globe size={16} className="shrink-0" />
              Visit website
            </a>
          )}

          {phone && (
            <a 
              href={`tel:${phone}`} 
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1a2942] hover:text-[#4A4A4A] transition-colors"
            >
              <Phone size={16} className="shrink-0" />
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkCard;
