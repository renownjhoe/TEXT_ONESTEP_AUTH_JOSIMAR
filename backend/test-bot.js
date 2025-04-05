import process from 'process';
import { config } from 'dotenv';
import axios from 'axios';

config(); 

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const apiUrl = `https://api.telegram.org/bot${botToken}`;

async function testBotConnection() {
  try {
    const response = await axios.get(`${apiUrl}/getMe`);
    console.log('Bot information:', response.data);
    console.log('Bot connection successful!');
  } catch (error) {
    console.error('Bot connection failed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

testBotConnection();
