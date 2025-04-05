import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockAPI as api } from '../services/api';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const setup = searchParams.get('setup') === 'true'; // Get the setup parameter

  const isUserProfileComplete = (telegramUser) => {
    const requiredFields = [
      'fullName', 'phone', 'email', 'dob', 'passcode', 
      'fingerPrint', 'faceId', 'city_of_residence', 
      'state_of_residence', 'country_of_residence', 
      'address1', 'address2', 'zip', 
      'selfie_with_document', 'government_issue_id'
    ];
    
    return requiredFields.every(field => 
      Object.prototype.hasOwnProperty.call(telegramUser, field) && 
      telegramUser[field] !== null && 
      telegramUser[field] !== undefined
    );
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const otpString = otp.join('');
      
      // Get the stored Telegram user info
      const telegramUserJSON = localStorage.getItem('telegramUser');
      
      if (!telegramUserJSON) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { message: 'Authentication failed: No Telegram user data found', type: 'error' },
        });
        return;
      }
      
      const telegramUser = JSON.parse(telegramUserJSON);
      
      // Verify OTP with the user ID
      const { success } = await api.verifyOTP(otpString, telegramUser.id);

      if (success) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { message: 'OTP Verified', type: 'success' },
        });
        
        // Check if user profile is complete
        if (isUserProfileComplete(telegramUser)) {
          // User profile is complete, set user data and redirect to dashboard
          dispatch({ 
            type: 'SET_USER', 
            payload: telegramUser
          });
          navigate('/dashboard');
        } else {
          // User profile is incomplete, redirect to account setup
          navigate('/account-setup');
        }
      } else {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { message: 'Invalid OTP', type: 'error' },
        });
      }
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { message: error.message || 'Verification failed', type: 'error' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d+$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.padEnd(6, '').split('');
      setOtp(newOtp);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <h1 className="text-2xl font-bold text-blue-600 mx-auto">ONESTEP</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h2>
            <p className="text-gray-600">
              Complete the Onestep verification to proceed.<br />
              It is important for account verification
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Enter the OTP verification code sent to you
            </p>
            
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-2xl text-center border-2 border-gray-300 rounded-lg 
                            focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ))}
            </div>

            <p className="text-sm text-gray-600 mb-6">
              10 Minutes remaining
            </p>

            <button
              onClick={handleVerify}
              disabled={loading || otp.some(d => d === '')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                        disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
            >
              {loading ? 'Verifying...' : 'PROCEED'}
            </button>

            <p className="text-sm text-gray-600 mt-4">
              Didn't receive your OTP? {' '}
              <button className="text-blue-600 hover:underline">
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t mt-8">
        <div className="max-w-md mx-auto py-4 px-4 text-center text-sm text-gray-500">
          <p>By using Login you agree to our Terms & Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}