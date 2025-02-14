
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { OnboardingForm } from './OnboardingForm';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

const PASSWORD_REQUIREMENTS = [
  { test: (p: string) => p.length >= 8, message: 'At least 8 characters long' },
  { test: (p: string) => /[A-Z]/.test(p), message: 'Contains uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), message: 'Contains lowercase letter' },
  { test: (p: string) => /[0-9]/.test(p), message: 'Contains number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), message: 'Contains special character' },
];

export const AuthModal = ({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const { signIn, signUp } = useAuth();

  const validatePassword = () => {
    return PASSWORD_REQUIREMENTS.every(req => req.test(password));
  };

  const passwordsMatch = password === confirmPassword;

  if (!isOpen) return null;
  if (showOnboarding) return <OnboardingForm 
    onClose={() => {
      setShowOnboarding(false);
      onClose();
    }}
    unverifiedUser={unverifiedUser}
    skipNameCollection={true}
  />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      if (!validatePassword()) {
        toast.error('Password does not meet all requirements');
        return;
      }
      if (!passwordsMatch) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        toast.success('Signed in successfully!');
        onClose();
      } else {
        console.log('Starting signup process...');
        const { user, error: signUpError } = await signUp(email, password);
        
        if (signUpError) {
          console.error('Signup error details:', signUpError);
          if (signUpError.message.includes('rate limit')) {
            throw new Error('We are experiencing high traffic. Please try again in a few minutes.');
          }
          throw signUpError;
        }
        
        if (user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: user.id,
                full_name: fullName,
              },
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            throw new Error('Failed to create user profile');
          }
        }

        setUnverifiedUser(user);
        console.log('Signup successful:', user);
        toast.success('Account created! Please check your email to verify your account.');
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
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
          {activeTab === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}

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
              onFocus={() => activeTab === 'signup' && setShowPasswordRequirements(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {activeTab === 'signup' && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {showPasswordRequirements && (
                <div className="space-y-2 text-sm">
                  {PASSWORD_REQUIREMENTS.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {req.test(password) ? (
                        <CheckCircle2 className="text-green-500" size={16} />
                      ) : (
                        <XCircle className="text-red-500" size={16} />
                      )}
                      <span className={req.test(password) ? 'text-green-700' : 'text-red-700'}>
                        {req.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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
