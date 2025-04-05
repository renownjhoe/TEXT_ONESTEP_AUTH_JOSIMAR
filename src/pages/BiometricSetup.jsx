import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint } from '@mui/icons-material';
import { Face } from '@mui/icons-material';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const BiometricsSetup = () => {
  const navigate = useNavigate();
  const [loadingTouchID, setLoadingTouchID] = useState(false);
  const [loadingFaceID, setLoadingFaceID] = useState(false);
  const [touchIDSetup, setTouchIDSetup] = useState(false);
  const [faceIDSetup, setFaceIDSetup] = useState(false);
  const { dispatch, state } = useAuth();


  useEffect(() => {
    if (!state.user) { 
      navigate('/');
    }
  }, [navigate, state.user]);

  const handleSetupTouchID = () => {
    setLoadingTouchID(true);
    setTimeout(() => {
      setLoadingTouchID(false);
      setTouchIDSetup(true);
      dispatch({ type: 'SET_TOUCH_ID', payload: true });
    }, 5000);
  };

  const handleSetupFaceID = () => {
    setLoadingFaceID(true);
    setTimeout(() => {
      setLoadingFaceID(false);
      setFaceIDSetup(true);
      dispatch({ type: 'SET_FACE_ID', payload: true });
    }, 5000);
  };

  useEffect(() => {
    if (touchIDSetup && faceIDSetup) {
      // Get Telegram user data from localStorage
      const telegramUserJSON = localStorage.getItem('telegramUser');
      const telegramUser = telegramUserJSON ? JSON.parse(telegramUserJSON) : {}      
        // Update telegramUser with passcode
      const updatedUser = {
          ...telegramUser,
          touchIDSetup: true,
          faceIDSetup: true,
      };
      
      // Save updated user to localStorage
      localStorage.setItem('telegramUser', JSON.stringify(updatedUser));

      // setBothConfirmed(true);
      setTimeout(() => {
        navigate('/kyc-setup');
      }, 5000);
    }
  }, [touchIDSetup, faceIDSetup, navigate]);

  const handleLater = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-gray-800">
        <span className="text-xl font-bold">ONESTEP</span>
        <button className="text-white">X</button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Biometrics Registration</h2>
            <p className="text-gray-400">
              Register your biometrics for faster login. Do it now or later!
            </p>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-gray-400">
              Register with Biometrics such as Touch ID, Face ID, and Passcode for enhanced Login and Account Security.
            </p>
          </div>

          {/* Biometrics Setup Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSetupTouchID}
              className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 flex flex-col items-center justify-center ${touchIDSetup ? 'border-2 border-green-500' : ''
                }`}
            >
              <Fingerprint className="h-20 w-20 mb-2" />
              Touch ID
              <span className="text-xs">
                {touchIDSetup ? (
                  <CheckCircle className="text-green-500 h-6 w-6 mt-2" />
                ) : (
                  'SETUP TOUCH ID'
                )}
              </span>
            </button>
            <button
              onClick={handleSetupFaceID}
              className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 flex flex-col items-center justify-center ${faceIDSetup ? 'border-2 border-green-500' : ''
                }`}
            >
              <Face className="h-32 w-32 mb-2" />
              Face ID
              <span className="text-xs">
                {faceIDSetup ? (
                  <CheckCircle className="text-green-500 h-6 w-6 mt-2" />
                ) : (
                  'SETUP FACE ID'
                )}
              </span>
            </button>
          </div>

          <div className="text-center">
            <button onClick={handleLater} className="text-yellow-400 hover:text-yellow-300 underline">
              Recovery Center
            </button>
          </div>

          {/* Terms and Privacy Policy */}
          <div className="text-center text-xs text-gray-400">
            By using Login you agree to our{' '}
            <Link to="/terms" className="text-blue-500">
              Terms
            </Link>{' '}
            &amp;{' '}
            <Link to="/privacy" className="text-blue-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      {/* Loading Modal */}
      {loadingTouchID && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black text-white p-5 rounded-lg flex flex-col items-center justify-center">
            <Fingerprint className="h-32 w-32 mb-2" />
            <p>Setting up biometrics...</p>
          </div>
        </div>
      )}
      {loadingFaceID && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black text-white p-5 rounded-lg flex flex-col items-center justify-center">
            <Face className="h-32 w-32 mb-2" />
            <p>Setting up Face ID...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricsSetup;
