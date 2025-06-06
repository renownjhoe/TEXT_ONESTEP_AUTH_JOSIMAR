export const mockAPI = {
  generateOTP: async (phone) => {
    const _TOKEN = localStorage.getItem('auth_token');
    return { success: true, otp: _TOKEN };
    },

    verifyOTP: async (otp) => {
      const _TOKEN = localStorage.getItem('auth_token');
      return new Promise(resolve => 
        setTimeout(() => resolve({ success: otp === _TOKEN }), 1000)
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
    const response = await fetch('https://telegram-messager.vercel.app/api/send-telegram-otp', {
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