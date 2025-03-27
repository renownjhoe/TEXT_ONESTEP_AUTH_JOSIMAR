import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const setup = searchParams.get('setup') === 'true'; // Get the setup parameter

  const handleVerify = async () => {
    try {
      setLoading(true);
      const otpString = otp.join('');
      const { success } = await api.verifyOTP(otpString);

      if (success) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { message: 'OTP Verified', type: 'success' },
        });
        
        if (setup) {
          navigate('/account-setup'); // Redirect to account setup
        } else {
          dispatch({ type: 'SET_USER', payload: {
            fullName: "John Doe",
            phone: "0805748374",
            email: "john.doe@mail.com",
            dob: "12/12/2012",
            passcode: "123456",
            fingerPrint: true,
            faceId: true,
            city_of_residence: "Lagos",
            state_of_residence: "Lagos",
            country_of_residence: "Nigeria",
            address1: "Abuja",
            address2: "Abuja",
            zip: "123456",
            selfie_with_document: true,
            government_issue_id: true,
          } });
          navigate('/dashboard'); // Redirect to dashboard
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
        payload: { message: 'Verification failed', type: 'error' },
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