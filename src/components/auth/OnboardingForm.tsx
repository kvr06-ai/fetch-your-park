import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { DogSize, EnergyLevel } from '@/types/user';
import { X } from 'lucide-react';

interface OnboardingFormProps {
  onClose: () => void;
  unverifiedUser?: { id: string } | null;
}

export const OnboardingForm = ({ onClose, unverifiedUser }: OnboardingFormProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    zip_code: '',
    number_of_dogs: 1,
    dog_sizes: [] as DogSize[],
    dog_energy_level: '' as EnergyLevel | '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    const effectiveUser = user || unverifiedUser;
    
    if (!effectiveUser?.id) {
      console.error('No user found');
      toast.error('Please sign in to continue');
      return;
    }

    if (!formData.dog_sizes.length) {
      toast.error('Please select at least one dog size');
      return;
    }

    if (!formData.dog_energy_level) {
      toast.error('Please select an energy level');
      return;
    }

    try {
      console.log('Submitting profile data:', {
        user_id: effectiveUser.id,
        ...formData
      });

      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: effectiveUser.id,
            ...formData,
          },
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Profile created successfully');
      toast.success('Profile created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Error creating profile');
    }
  };

  const handleSkip = () => {
    toast.info('You can complete your profile later in settings');
    onClose();
  };

  const handleDogSizeToggle = (size: DogSize) => {
    setFormData(prev => ({
      ...prev,
      dog_sizes: prev.dog_sizes.includes(size)
        ? prev.dog_sizes.filter(s => s !== size)
        : [...prev.dog_sizes, size]
    }));
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-600">Help us personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your ZIP code"
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Dogs
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.number_of_dogs}
                  onChange={(e) => setFormData(prev => ({ ...prev, number_of_dogs: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dog Size(s)
                </label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as DogSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleDogSizeToggle(size)}
                      className={`px-4 py-2 rounded-full border ${
                        formData.dog_sizes.includes(size)
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
                  {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, dog_energy_level: level }))}
                      className={`px-4 py-2 rounded-full border ${
                        formData.dog_energy_level === level
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
                >
                  Complete
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-gray-600 text-sm hover:text-gray-900"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
};
