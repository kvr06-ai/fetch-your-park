
import { Star, MapPin, Clock } from "lucide-react";

interface ParkCardProps {
  name: string;
  address: string;
  rating: number;
  distance: string;
  hours?: string;
}

const ParkCard = ({ name, address, rating, distance, hours }: ParkCardProps) => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-slideUp hover:bg-gradient-to-br hover:from-white hover:to-secondary/5">
      <div className="absolute top-4 right-4 text-accent flex items-center gap-1">
        <Star size={16} className="fill-accent stroke-accent" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-primary mb-2 pr-16">{name}</h3>
      
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin size={16} className="mt-1 shrink-0" />
          <p className="text-sm">{address}</p>
        </div>
        
        {hours && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Clock size={16} className="mt-1 shrink-0" />
            <p className="text-sm">{hours}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-muted-foreground">{distance} away</p>
      </div>
    </div>
  );
};

export default ParkCard;
