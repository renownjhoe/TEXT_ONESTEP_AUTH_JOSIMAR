import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Fingerprint } from 'lucide-react';
import TelegramLoginButton from '../components/TelegramLoginButton';

export default function LoginPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('user_authenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleAuthSuccess = (userData) => {
    console.log("Telegram Auth Successful:", userData);
    
    // Store user data for reference
    localStorage.setItem('telegramUser', JSON.stringify(userData));
    
    // Navigate to callback page which will handle OTP generation and sending
    navigate('/auth/telegram/callback');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">ONESTEP</h1>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2 text-gray-200">
              USE ONESTEPID TO LOGIN
            </h2>
            <p className="text-gray-400 mb-6">
              Use the Onestep Verification to Log into your Account
            </p>

            {/* Official Telegram Login Button */}
            <div className="w-full flex justify-center mb-6">
              <TelegramLoginButton onAuth={handleAuthSuccess} />
            </div>

            {/* Error message */}
            {authError && (
              <div className="text-red-400 text-sm mt-2">
                {authError}
              </div>
            )}

            <p className="text-sm text-gray-500">Kindly select a Messenger</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-800 text-gray-400 text-sm font-medium rounded-full">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              onClick={() => navigate('/passcode-setup')}
            >
              <KeyRound size={20} />
              Use Passcode
            </button>

            <button
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              onClick={() => navigate('/biometric-setup')}
            >
              <Fingerprint size={20} />
              Use Biometrics
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">New to ONESTEP?</p>
          <button
            className="text-blue-400 font-semibold mt-2 hover:underline"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </button>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>By using Login you agree to our Terms & Privacy Policy</p>
      </footer>
    </div>
  );
}