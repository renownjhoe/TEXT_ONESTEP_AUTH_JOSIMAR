import { useNavigate } from 'react-router-dom';
import { Fingerprint, Key, Telegram, QuestionMark } from '@mui/icons-material';

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
  const initiateTegramAuth = () => {
    // Your Telegram bot's numeric ID (not username)
    const botId = '7659055031'; // Replace with your actual bot's numeric ID
    
    // Generate and store state parameter to prevent CSRF
    const state = generateRandomString();
    localStorage.setItem('telegramAuthState', state);
    
    // Redirect parameters
    const redirectUrl = encodeURIComponent(`${window.location.origin}/handle-telegram-auth`);
    
    // Construct the Telegram OAuth URL
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&return_to=${redirectUrl}&state=${state}`;
    
    // Open the authentication URL
    window.location.href = telegramAuthUrl;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md bg-black rounded-2xl shadow-sm p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">ONESTEP</h1>
        
        {/* Login Methods */}
        <div className="space-y-8">
          {/* ID Verification Section */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
              USE ONESTEPID TO LOGIN
            </h2>
            <p className="text-gray-600 mb-6">
              Use the Onestep Verification to Log into your Account
            </p>
            
            {/* Messenger Selection */}
            <div className="w-full flex justify-center gap-4 mb-6 text-center">
              <button 
                className="w-fit py-2 px-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors"
                onClick={initiateTegramAuth}
              >
                <Telegram className="text-yellow-600 text-3xl mx-auto" />
                <span className="mt-2 block text-sm text-yellow-600">Telegram</span>
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Kindly select a Messenger below
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-gray-500 text-sm">OR</span>
            </div>
          </div>

          {/* Alternative Methods */}
          <div className="space-y-4">
            <button 
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => navigate('/passcode-setup')}
            >
              <Key className="text-white" />
              Use Passcode
            </button>
            
            <button 
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              onClick={() => navigate('/biometric-setup')}
            >
              <Fingerprint />
              Use Biometrics
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="w-full mt-8 text-center">
          <button className="w-full text-blue-600 text-sm hover:underline flex items-center justify-center gap-1">
            <QuestionMark fontSize="small" />
            Having trouble logging in?
          </button>
        </div>

        {/* Signup Prompt */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">New to ONESTEP?</p>
          <button 
            className="text-blue-600 font-semibold mt-2 hover:underline"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>By using Login you agree to our Terms & Privacy Policy</p>
      </footer>
    </div>
  );
}