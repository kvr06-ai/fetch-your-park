
import { MapPin, Clock, Globe, Phone } from "lucide-react";
import { DogPark, WorkingHours } from "../types/dogPark";

const formatHours = (hours: WorkingHours | null): string => {
  if (!hours) return "Hours not available";
  const today = new Date().toLocaleString('en-us', {weekday: 'long'}) as keyof WorkingHours;
  return hours[today] || "Hours not available";
};

const ParkCard = ({ name, full_address, photo, working_hours, site, phone }: DogPark) => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-[#A8B5A0]/20 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-slideUp hover:bg-gradient-to-br hover:from-white hover:to-[#F2FCE2]">
      {photo && (
        <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-[#1a2942] mb-2 tracking-tight">{name}</h3>
      
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-[#2C3E50]">
          <MapPin size={16} className="mt-1 shrink-0" />
          <p className="text-sm font-medium">{full_address}</p>
        </div>
        
        <div className="flex items-start gap-2 text-[#2C3E50]">
          <Clock size={16} className="mt-1 shrink-0" />
          <p className="text-sm font-medium">{formatHours(working_hours)}</p>
        </div>

        {site && (
          <div className="flex items-start gap-2 text-[#2C3E50]">
            <Globe size={16} className="mt-1 shrink-0" />
            <a href={site} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-[#1a2942] transition-colors">
              Visit website
            </a>
          </div>
        )}

        {phone && (
          <div className="flex items-start gap-2 text-[#2C3E50]">
            <Phone size={16} className="mt-1 shrink-0" />
            <a href={`tel:${phone}`} className="text-sm font-medium hover:text-[#1a2942] transition-colors">
              {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkCard;
