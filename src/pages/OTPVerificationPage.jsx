import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSixDigitToken } from './utils';
import { sendOTPToTelegram } from './api';

export const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);
  
  const inputRefs = useRef([]);
  
  useEffect(() => {
    // Get stored user data
    const userData = localStorage.getItem('telegramUser');
    if (!userData) {
      navigate('/');
      return;
    }
    
    setTelegramUser(JSON.parse(userData));
    
    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [navigate]);
  
  const handleDigitChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    
    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Focus previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const verifyOTP = () => {
    const enteredOTP = otpDigits.join('');
    const storedToken = localStorage.getItem('auth_token');
    
    if (enteredOTP === storedToken) {
      // OTP verified, proceed with login
      localStorage.removeItem('auth_token'); // Clear OTP token
      sessionStorage.setItem('user_authenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid verification code. Please try again.');
      // Clear inputs
      setOtpDigits(['', '', '', '', '', '']);
      // Focus first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">ONESTEP</h1>
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Verification Code</h2>
          <p className="text-gray-400">
            Enter the 6-digit code sent to your Telegram
            {telegramUser?.username && <span> (@{telegramUser.username})</span>}
          </p>
        </div>
        
        <div className="flex justify-center gap-2 mb-8">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>
        
        {error && (
          <div className="text-red-400 text-center mb-4">
            {error}
          </div>
        )}
        
        <button
          onClick={verifyOTP}
          disabled={otpDigits.some(digit => !digit)}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2">Didn't receive the code?</p>
          <button
            onClick={() => {
              if (telegramUser) {
                const token = generateSixDigitToken();
                localStorage.setItem('auth_token', token);
                sendOTPToTelegram(telegramUser.id, token)
                  .then(() => {
                    setOtpDigits(['', '', '', '', '', '']);
                    if (inputRefs.current[0]) {
                      inputRefs.current[0].focus();
                    }
                  })
                  .catch(() => {
                    setError('Failed to resend OTP. Please try again.');
                  });
              }
            }}
            className="text-blue-400 font-semibold hover:underline"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;