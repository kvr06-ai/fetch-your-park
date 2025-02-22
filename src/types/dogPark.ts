
export interface DogPark {
  name: string;
  site: string | null;
  phone: string | null;
  full_address: string;
  street: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  reviews: number;
  rating: number;
  photo: string | null;
  street_view: string | null;
  working_hours: WorkingHours | null;
  business_status: 'OPERATIONAL' | 'CLOSED' | string;
  location_link: string;
  latitude: number;
  longitude: number;
  has_water: boolean;
  has_benches: boolean;
  has_picnic_tables: boolean;
  wheelchair_accessible: boolean;
  good_for_off_leash: boolean;
  dogs_allowed: boolean;
  amenities_score: number;
  features: string[] | null;
  positive_review_percentage: number;
  is_24_hours: boolean;
}

export interface WorkingHours {
  Monday?: string;
  Tuesday?: string;
  Wednesday?: string;
  Thursday?: string;
  Friday?: string;
  Saturday?: string;
  Sunday?: string;
}

export const formatWorkingHours = (hoursString: string | undefined): WorkingHours | null => {
  if (!hoursString) return null;
  try {
    return JSON.parse(hoursString);
  } catch {
    return null;
  }
};

// Haversine formula for calculating distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 0.621371); // Convert to miles and round
};
