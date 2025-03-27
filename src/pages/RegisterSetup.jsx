import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, Key, Telegram, QuestionMark } from '@mui/icons-material';

export default function RegisterPage() {
  const redirectPath = '/telegram-auth?setup=true';

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md bg-black rounded-2xl shadow-sm p-8">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center text-gray-900 mb-6">ONESTEP</h1>
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">SIGN UP</h1>
        
        {/* Login Methods */}
        <div className="space-y-8">
          {/* ID Verification Section */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                Complete OneStep Verification
            </h2>
            <p className="text-gray-600 mb-6">
              Complete the OneStep verification to proceed. If you don't have one already. It is important for account verification
            </p>
            
            {/* Messenger Selection */}
            <div className="w-full flex flex-col justify-center gap-4 mb-6 text-center">
            
            <p className="text-sm text-gray-500">
              Kindly select a Messenger below
            </p>
              <Link to={redirectPath} 
                className="w-full py-4 px-8 border-2 border-gray-800 rounded-xl hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Telegram className="text-yellow-600 text-sm w-[24px] h-[24px]" />
                <span className="text-sm text-yellow-600">Telegram</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Help Section */}
        <div className="w-full mt-8 text-center">
            <p className="text-sm text-gray-500 mb-3">
                Having trouble using OneStep Verification?
            </p>
          <button className="w-full bg-yellow-500 text-black-600 text-sm hover:underline flex items-center justify-center gap-1">
            <QuestionMark fontSize="small" /> HELP CENTER
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>By using Register you agree to our Terms & Privacy Policy</p>
      </footer>
    </div>
  );
}