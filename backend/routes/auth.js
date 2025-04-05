import { Router } from 'express';
const router = Router();
import  TelegramService  from '../services/telegram.js';

// Route to send OTP via Telegram
router.post('/send-telegram-otp', async (req, res) => {
  try {
    const { telegramUserId, otpToken } = req.body;

    if (!telegramUserId || !otpToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and OTP token are required' 
      });
    }

    // Send OTP to Telegram user
    await TelegramService.sendOTP(telegramUserId, otpToken);

    return res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP' 
    });
  }
});

export default router;