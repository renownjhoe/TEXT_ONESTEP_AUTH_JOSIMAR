import { createClient } from 'redis';
import { promisify } from 'util';
import process from 'process';
  
class OTPService {
  constructor() {
    this.client = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    });
    
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
    
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }
  
  /**
   * Store OTP code with expiration
   * @param {string} userId - User identifier 
   * @param {string} otpCode - OTP code
   * @param {number} expirySeconds - Expiration time in seconds
   */
  async storeOTP(userId, otpCode, expirySeconds = 600) {
    const key = `otp:${userId}`;
    await this.setAsync(key, otpCode);
    await this.expireAsync(key, expirySeconds);
  }
  
  /**
   * Verify OTP code
   * @param {string} userId - User identifier
   * @param {string} otpCode - OTP code to verify
   * @returns {boolean} - Whether OTP is valid
   */
  async verifyOTP(userId, otpCode) {
    const key = `otp:${userId}`;
    const storedOTP = await this.getAsync(key);
    
    if (!storedOTP || storedOTP !== otpCode) {
      return false;
    }
    
    // Delete OTP after successful verification (one-time use)
    this.client.del(key);
    return true;
  }
}

export default new OTPService();
