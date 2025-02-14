
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  zip_code: string | null;
  number_of_dogs: number | null;
  dog_sizes: string[] | null;
  dog_energy_level: 'low' | 'medium' | 'high' | null;
  created_at: string;
  updated_at: string;
}

export type DogSize = 'small' | 'medium' | 'large';
export type EnergyLevel = 'low' | 'medium' | 'high';
