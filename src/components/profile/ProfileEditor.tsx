
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const ProfileEditor = ({ isOpen, onClose, currentProfile, onProfileUpdate }: ProfileEditorProps) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>(currentProfile);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        user_id: currentProfile.user_id,
        full_name: currentProfile.full_name,
        zip_code: profile.zip_code || null,
        number_of_dogs: profile.number_of_dogs || null,
        dog_sizes: profile.dog_sizes || [],
        dog_energy_level: profile.dog_energy_level || null,
      };

      console.log('Updating profile with:', updateData);

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(updateData, {
          onConflict: 'user_id',
          merge: true
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }
      
      console.log('Profile update response:', data);
      toast.success('Profile updated successfully!');
      onProfileUpdate(data as UserProfile);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={profile.zip_code || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, zip_code: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Dogs
            </label>
            <input
              type="number"
              min="0"
              value={profile.number_of_dogs || 0}
              onChange={(e) => setProfile(prev => ({ ...prev, number_of_dogs: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dog Sizes
            </label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const currentSizes = profile.dog_sizes || [];
                    setProfile(prev => ({
                      ...prev,
                      dog_sizes: currentSizes.includes(size)
                        ? currentSizes.filter(s => s !== size)
                        : [...currentSizes, size]
                    }));
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    profile.dog_sizes?.includes(size)
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Level
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, dog_energy_level: level }))}
                  className={`px-4 py-2 rounded-full border ${
                    profile.dog_energy_level === level
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 mt-6"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
