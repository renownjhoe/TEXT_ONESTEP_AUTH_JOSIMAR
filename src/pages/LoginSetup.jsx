import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Fingerprint, HelpCircle, MessageCircle } from 'lucide-react';

// Custom Telegram Login Button Component
const TelegramLoginButton = ({ onAuth }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const initiateLogin = () => {
    setIsLoading(true);
    
    // Generate a unique state for this login attempt
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('telegram_auth_state', state);
    
    // Calculate redirect URL (your app)
    const redirectUri = encodeURIComponent(`https://text-onestep-auth-josimar.vercel.app/otp`);
    
    // Bot ID (you'll need to replace this with your bot's ID)
    const botId = '7659055031'; // Your OneBoth99Bot ID
    
    // Construct Telegram OAuth URL
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent('https://text-onestep-auth-josimar.vercel.app')}&return_to=${redirectUri}&request_access=write&state=${state}`;
    
    // Open in a popup window
    const popupWidth = 550;
    const popupHeight = 470;
    const left = window.innerWidth / 2 - popupWidth / 2;
    const top = window.innerHeight / 2 - popupHeight / 2;
    
    const popup = window.open(
      telegramAuthUrl, 
      'TelegramAuth',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
    );
    
    // Listen for messages from the popup
    const messageListener = (event) => {
      // Make sure message is from our popup and contains auth data
      if (event.source === popup && event.data && event.data.telegram_auth) {
        window.removeEventListener('message', messageListener);
        setIsLoading(false);
        
        // Process auth data
        const authData = event.data.telegram_auth;
        if (authData.state === localStorage.getItem('telegram_auth_state')) {
          // State matches, auth is valid
          onAuth(authData);
        }
      }
    };
    
    window.addEventListener('message', messageListener);
    
    // Set a timeout to handle case where popup is closed without completing auth
    setTimeout(() => {
      if (popup.closed) {
        window.removeEventListener('message', messageListener);
        setIsLoading(false);
      }
    }, 1000);
  };
  
  return (
    <button
      onClick={initiateLogin}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
    >
      {isLoading ? (
        <span className="animate-pulse">Connecting...</span>
      ) : (
        <>
          <MessageCircle size={20} />
          <span>Login with Telegram</span>
        </>
      )}
    </button>
  );
};

// Create a separate callback page component
export const TelegramCallbackPage = () => {
  useEffect(() => {
    // Extract auth data from URL
    const params = new URLSearchParams(window.location.search);
    const authData = {};
    
    for (const [key, value] of params.entries()) {
      authData[key] = value;
    }
    
    // Send data back to opener and close
    if (window.opener) {
      window.opener.postMessage({ telegram_auth: authData }, window.location.origin);
      window.close();
    } else {
      // Fallback if opener is not available
      localStorage.setItem('telegram_auth_data', JSON.stringify(authData));
      window.location.href = '/';
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Processing login... Please wait.</p>
    </div>
  );
};

// Main Login Page
export default function LoginPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if we have stored auth data from callback redirect
    const storedAuthData = localStorage.getItem('telegram_auth_data');
    if (storedAuthData) {
      try {
        const authData = JSON.parse(storedAuthData);
        handleAuthSuccess(authData);
        localStorage.removeItem('telegram_auth_data'); // Clear after use
      } catch (error) {
        console.error('Error processing stored auth data:', error);
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    console.log("Telegram Auth Successful:", userData);
    localStorage.setItem('telegramUser', JSON.stringify(userData));
    navigate('/otp');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">ONESTEP 2</h1>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2 text-gray-200">
              USE ONESTEPID TO LOGIN
            </h2>
            <p className="text-gray-400 mb-6">
              Use the Onestep Verification to Log into your Account
            </p>

            {/* Custom Telegram Login Button */}
            <div className="w-full flex justify-center gap-4 mb-6">
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

        <div className="w-full mt-10 text-center">
          <button 
            className="w-full text-blue-400 text-sm hover:underline flex items-center justify-center gap-1"
            onClick={() => {
              // Debug shortcut
              handleAuthSuccess({
                id: 12345678,
                first_name: "Test",
                username: "test_user",
                auth_date: Math.floor(Date.now() / 1000)
              });
            }}
          >
            <HelpCircle size={16} />
            Skip login (Debug)
          </button>
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