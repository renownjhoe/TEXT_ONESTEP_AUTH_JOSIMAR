import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSixDigitToken } from '../utils/utils';
import { sendOTPToTelegram } from '../services/api';

export const TelegramCallbackPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Extract auth data from URL
    // const params = new URLSearchParams(window.location.search);
    // const authData = {};
    const authData = JSON.parse(localStorage.getItem('telegramUser'));
    
    // Generate OTP and send to user's Telegram
    const handleOTPSending = async () => {
      try {
        const token = generateSixDigitToken();
        
        // Store token for verification later
        localStorage.setItem('auth_token', token);
        
        
        // Send OTP to user's Telegram account
        await sendOTPToTelegram(authData.id, token);
        
        // Redirect to OTP verification page
        navigate('/otp');
      } catch (error) {
        setError('Failed to send OTP. Please try again.');
        setIsProcessing(false);
      }
    };
    
    handleOTPSending();
  }, [navigate]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          className="bg-blue-600 px-4 py-2 rounded-lg"
          onClick={() => navigate('/')}
        >
          Back to Login
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Processing login and sending verification code... Please wait.</p>
    </div>
  );
};

export default TelegramCallbackPage;