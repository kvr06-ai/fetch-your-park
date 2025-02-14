
export interface DogPark {
  name: string;
  site: string;
  phone: string;
  full_address: string;
  street: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  reviews: number;
  photo: string;
  street_view: string;
  working_hours: WorkingHours | null;
  business_status: 'OPERATIONAL' | 'CLOSED' | string;
  location_link: string;
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
