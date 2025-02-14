
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { OnboardingForm } from './OnboardingForm';
import { User } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;
  if (showOnboarding) return <OnboardingForm 
    onClose={() => {
      setShowOnboarding(false);
      onClose();
    }}
    unverifiedUser={unverifiedUser}
  />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        await signIn(email, password);
        toast.success('Signed in successfully!');
        onClose();
      } else {
        const { user } = await signUp(email, password);
        setUnverifiedUser(user);
        toast.success('Account created! Please check your email to verify your account.');
        setShowOnboarding(true);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
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

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === 'signin'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 border-b border-gray-200'
            }`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === 'signup'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 border-b border-gray-200'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Loading...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};
