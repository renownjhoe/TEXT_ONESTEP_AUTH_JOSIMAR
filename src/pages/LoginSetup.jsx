import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Fingerprint, HelpCircle, MessageCircle } from 'lucide-react';

// Official Telegram Login Button Component
const TelegramLoginButton = ({ onAuth }) => {
  const telegramBtnRef = useRef(null);

  useEffect(() => {
    // Generate token for this login session
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    localStorage.setItem('auth_token', token);
    
    // Create script element for Telegram widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'OneBoth99Bot');
    script.setAttribute('data-size', 'large');
    
    // Add token to auth URL
    const authUrl = new URL('https://text-onestep-auth-josimar.vercel.app/otp');
    authUrl.searchParams.append('token', token);
    script.setAttribute('data-auth-url', authUrl.toString());
    script.setAttribute('data-request-access', 'write');
    
    // Set up callback function to be called when user is authenticated
    window.onTelegramAuth = (user) => {
      // Add token to user data
      user.token = token;
      onAuth(user);
    };
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    
    // Add the script to the container
    if (telegramBtnRef.current) {
      telegramBtnRef.current.innerHTML = '';
      telegramBtnRef.current.appendChild(script);
    }
    
    return () => {
      // Clean up when component unmounts
      if (telegramBtnRef.current) {
        telegramBtnRef.current.innerHTML = '';
      }
      delete window.onTelegramAuth;
    };
  }, [onAuth]);
  
  return <div ref={telegramBtnRef} className="telegram-login-container"></div>;
};

// Create a separate callback page component for when redirected back from Telegram
export const TelegramCallbackPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract auth data from URL
    const params = new URLSearchParams(window.location.search);
    const authData = {};
    
    for (const [key, value] of params.entries()) {
      authData[key] = value;
    }
    
    // Add stored token to auth data if it exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      authData.token = token;
    }
    
    // Store auth data and redirect to main page
    localStorage.setItem('telegramUser', JSON.stringify(authData));
    navigate('/');
  }, [navigate]);
  
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
    const storedAuthData = localStorage.getItem('telegramUser');
    if (storedAuthData) {
      try {
        const authData = JSON.parse(storedAuthData);
        // Only process if we haven't already redirected to OTP
        if (window.location.pathname !== '/otp') {
          handleAuthSuccess(authData);
        }
      } catch (error) {
        console.error('Error processing stored auth data:', error);
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    console.log("Telegram Auth Successful:", userData);
    
    // Ensure we have a token
    if (!userData.token) {
      // Generate a token if one doesn't exist
      userData.token = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    }
    
    localStorage.setItem('telegramUser', JSON.stringify(userData));
    
    // Optional: Send token to backend here
    // sendTokenToBackend(userData.id, userData.token);
    
    navigate('/otp');
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

        <div className="w-full mt-10 text-center">
          <button 
            className="w-full text-blue-400 text-sm hover:underline flex items-center justify-center gap-1"
            onClick={() => {
              // Debug shortcut with token
              const debugToken = `debug_token_${Date.now()}`;
              handleAuthSuccess({
                id: 12345678,
                first_name: "Test",
                username: "test_user",
                auth_date: Math.floor(Date.now() / 1000),
                token: debugToken
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