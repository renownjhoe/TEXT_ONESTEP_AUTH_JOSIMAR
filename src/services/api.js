export const mockAPI = {
  generateOTP: async (phone) => {
    return { success: true, otp: '123456' };
  },

  verifyOTP: async (otp) => {
    return new Promise(resolve => 
      setTimeout(() => resolve({ success: otp === '123456' }), 1000)
    );
  },

  submitKYC: async (data) => {
    return new Promise(resolve =>
      setTimeout(() => resolve({ success: true }), 2000)
    );
  }
};


// Backend API call to send OTP via Telegram
export const sendOTPToTelegram = async (userId, token) => {
  try {
    const response = await fetch('https://your-backend-api.com/send-telegram-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramUserId: userId,
        otpToken: token
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};