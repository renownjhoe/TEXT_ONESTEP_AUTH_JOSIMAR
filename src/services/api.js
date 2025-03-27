const mockAPI = {
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

export default mockAPI;