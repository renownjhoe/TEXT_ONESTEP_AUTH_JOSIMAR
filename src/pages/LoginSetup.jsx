import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Fingerprint, HelpCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const telegramRef = useRef();
  const [authError, setAuthError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Set up Telegram login widget with debugging
  useEffect(() => {
    // Check URL parameters for debug info and auth results
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tgAuthResult')) {
      const authData = urlParams.get('tgAuthResult');
      setDebugInfo(`Auth data received: ${authData.substring(0, 20)}...`);
      try {
        const userData = JSON.parse(decodeURIComponent(authData));
        console.log("Telegram auth data:", userData);
        localStorage.setItem('telegramUser', JSON.stringify(userData));
        setDebugInfo("Auth successful! Redirecting...");
        // Wait a moment to show the debug message before redirecting
        setTimeout(() => navigate('/otp'), 1000);
      } catch (error) {
        console.error("Failed to process auth data:", error);
        setAuthError(`Auth data parsing error: ${error.message}`);
      }
    }

    // Setup debug listener for postMessage
    const messageHandler = (event) => {
      if (event.data && event.data.telegram) {
        console.log("Telegram postMessage received:", event.data);
        setDebugInfo(`Telegram event: ${JSON.stringify(event.data)}`);
      }
    };
    window.addEventListener('message', messageHandler);

    // Clear any existing widgets first
    if (telegramRef.current) {
      telegramRef.current.innerHTML = '';
    }

    // Create a fresh script element
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'OneBoth99Bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    
    // Use both methods to maximize compatibility
    script.setAttribute('data-auth-url', 'https://text-onestep-auth-josimar.vercel.app/otp');
    script.async = true;
    
    // Add onload handler to debug script loading
    script.onload = () => {
      console.log("Telegram widget script loaded successfully");
      setDebugInfo("Telegram widget loaded");
    };

    script.onerror = (error) => {
      console.error("Failed to load Telegram widget:", error);
      setAuthError("Failed to load Telegram login widget");
    };

    // Append the script to our container
    if (telegramRef.current) {
      telegramRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [navigate]);

  // Handle direct login for testing (debug only)
  const handleDirectLogin = () => {
    // Simulate successful auth for testing
    const mockUser = {
      id: 123456789,
      first_name: 'Test',
      username: 'testuser',
      photo_url: '',
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'test_hash'
    };
    localStorage.setItem('telegramUser', JSON.stringify(mockUser));
    navigate('/otp');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">ONESTEP 1</h1>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2 text-gray-200">
              USE ONESTEPID TO LOGIN
            </h2>
            <p className="text-gray-400 mb-6">
              Use the Onestep Verification to Log into your Account
            </p>

            {/* Telegram Login Widget */}
            <div className="w-full flex justify-center gap-4 mb-6 text-center">
              <div ref={telegramRef}></div>
            </div>

            {/* Debug info */}
            {debugInfo && (
              <div className="text-yellow-400 text-sm mt-2 mb-2 p-2 bg-gray-700 rounded">
                {debugInfo}
              </div>
            )}

            {/* Error message */}
            {authError && (
              <div className="text-red-400 text-sm mt-2 mb-2 p-2 bg-gray-700 rounded">
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
            className="w-full text-blue-400 text-sm hover:underline flex items-center justify-center gap-1 mb-2"
            onClick={handleDirectLogin}
          >
            <HelpCircle size={16} />
            Debug: Skip Telegram Login
          </button>
          
          <button className="w-full text-blue-400 text-sm hover:underline flex items-center justify-center gap-1">
            <HelpCircle size={16} />
            Having trouble logging in?
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