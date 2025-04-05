import process from 'process';
import axios from 'axios';

class TelegramService {
  constructor() {
      this.botToken = process.env.TELEGRAM_BOT_TOKEN;
      this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Send OTP code to a Telegram user
   * @param {string} userId - Telegram user ID
   * @param {string} otpCode - The OTP code to send
   * @returns {Promise} - Result of sending message
   */
  async sendOTP(userId, otpCode) {
    try {
      const message = `Your OneStep verification code is: ${otpCode}\n\n` +
                      `This code will expire in 10 minutes. Do not share this code with anyone.`;
      
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: userId,
        text: message,
        parse_mode: 'HTML'
      });

      if (!response.data.ok) {
        throw new Error(`Telegram API error: ${response.data.description}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }
}

export default new TelegramService();
