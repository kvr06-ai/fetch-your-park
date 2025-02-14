
import { Star, MapPin, Clock, Globe, Phone } from "lucide-react";
import { DogPark, WorkingHours } from "../types/dogPark";

const formatHours = (hours: WorkingHours | null): string => {
  if (!hours) return "Hours not available";
  const today = new Date().toLocaleString('en-us', {weekday: 'long'}) as keyof WorkingHours;
  return hours[today] || "Hours not available";
};

const ParkCard = ({ name, full_address, reviews, photo, working_hours, site, phone }: DogPark) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-slideUp hover:bg-gradient-to-br hover:from-white hover:to-secondary/5">
      <div className="absolute top-6 right-6 text-accent flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full">
        <Star size={16} className="fill-accent stroke-accent" />
        <span className="text-sm font-medium">{reviews}</span>
      </div>
      
      {photo && (
        <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-primary mb-2 pr-16">{name}</h3>
      
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin size={16} className="mt-1 shrink-0" />
          <p className="text-sm">{full_address}</p>
        </div>
        
        <div className="flex items-start gap-2 text-muted-foreground">
          <Clock size={16} className="mt-1 shrink-0" />
          <p className="text-sm">{formatHours(working_hours)}</p>
        </div>

        {site && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Globe size={16} className="mt-1 shrink-0" />
            <a href={site} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
              Visit website
            </a>
          </div>
        )}

        {phone && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Phone size={16} className="mt-1 shrink-0" />
            <a href={`tel:${phone}`} className="text-sm hover:text-primary">
              {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkCard;
