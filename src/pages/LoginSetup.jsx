import React from 'react';
// Assuming you are using react-router-dom v6+
import { useNavigate } from 'react-router-dom';
// Using lucide-react icons as Material UI might not be set up
// You might need to install it: npm install lucide-react
import { KeyRound, Fingerprint, HelpCircle, Bot } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  // Function to generate a random string for state parameter
  const generateRandomString = (length = 20) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Handle Telegram login manually without widget
  const initiateTelegramAuth = () => {
    console.log("Initiating Telegram Auth...");

    // !!! IMPORTANT: Replace with your actual bot's numeric ID !!!
    const botId = '7659055031'; // Example ID, replace with yours
    console.log("Using Bot ID:", botId);

    // Generate and store state parameter to prevent CSRF
    const state = generateRandomString();
    try {
      localStorage.setItem('telegramAuthState', state);
      console.log("Stored state in localStorage:", state);
    } catch (error) {
      console.error("Failed to store state in localStorage:", error);
      // Handle potential storage errors (e.g., private browsing mode)
      alert("Could not store authentication state. Please ensure cookies/localStorage are enabled.");
      return;
    }

    // Your application's domain and the callback path
    const appOrigin = 'https://text-onestep-auth-josimar-pr3t.vercel.app'; // Make sure this matches BotFather domain
    const callbackPath = '/otp';
    const redirectUrl = `${appOrigin}${callbackPath}`;
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    console.log("App Origin:", appOrigin);
    console.log("Redirect URL:", redirectUrl);
    console.log("Encoded Redirect URL:", encodedRedirectUrl);


    // Construct the Telegram OAuth URL
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(appOrigin)}&return_to=${encodedRedirectUrl}&request_access=write&state=${state}`;
    console.log("Constructed Telegram Auth URL:", telegramAuthUrl);

    // Open the authentication URL
    window.location.href = telegramAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      {/* Main Container */}
      {/* Added dark background, subtle border, increased padding */}
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
        {/* Header - Adjusted color for dark theme */}
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">ONESTEP</h1>

        {/* Login Methods */}
        <div className="space-y-8">
          {/* ID Verification Section - Adjusted text colors */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2 text-gray-200">
              USE ONESTEPID TO LOGIN
            </h2>
            <p className="text-gray-400 mb-6">
              Use the Onestep Verification to Log into your Account
            </p>

            {/* Messenger Selection - Improved styling */}
            <div className="w-full flex justify-center gap-4 mb-6 text-center">
              <button
                className="w-fit py-3 px-6 border-2 border-gray-600 rounded-xl hover:border-blue-500 hover:bg-gray-700 transition-all duration-200 ease-in-out flex flex-col items-center group"
                onClick={initiateTelegramAuth} // Corrected function name
              >
                {/* Using Lucide Bot icon */}
                <Bot className="text-blue-400 text-3xl mx-auto group-hover:scale-110 transition-transform" />
                <span className="mt-2 block text-sm text-blue-400">Telegram</span>
              </button>
              {/* Add buttons for other messengers here if needed */}
            </div>

            <p className="text-sm text-gray-500">
              Kindly select a Messenger
            </p>
          </div>

          {/* Divider - Adjusted for dark theme */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              {/* Adjusted background to match container */}
              <span className="px-3 bg-gray-800 text-gray-400 text-sm font-medium rounded-full">OR</span>
            </div>
          </div>

          {/* Alternative Methods - Adjusted colors and icons */}
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              onClick={() => navigate('/passcode-setup')}
            >
              <KeyRound size={20} /> {/* Lucide icon */}
              Use Passcode
            </button>

            <button
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              onClick={() => navigate('/biometric-setup')}
            >
              <Fingerprint size={20} /> {/* Lucide icon */}
              Use Biometrics
            </button>
          </div>
        </div>

        {/* Help Section - Adjusted colors */}
        <div className="w-full mt-10 text-center">
          <button className="w-full text-blue-400 text-sm hover:underline flex items-center justify-center gap-1">
            <HelpCircle size={16} />
            Having trouble logging in?
          </button>
        </div>

        {/* Signup Prompt - Adjusted colors and border */}
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

      {/* Footer - Adjusted color */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>By using Login you agree to our Terms & Privacy Policy</p>
      </footer>
    </div>
  );
}
