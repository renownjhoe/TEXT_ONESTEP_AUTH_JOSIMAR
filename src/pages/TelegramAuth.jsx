import React from 'react';
import { Telegram } from '@mui/icons-material';
import PatternBackground from '../components/PatternBackground';
import { Link } from 'react-router-dom';

export default function TelegramAuthMobile() {

  const searchParams = new URLSearchParams(location.search);
  const setup = searchParams.get('setup') === 'true';
  const redirectPath = '/otp?setup='+setup;

  return (
    <div className="relative w-screen min-h-screen bg-black flex flex-col items-center justify-center">
      {/* Background (use PatternBackground component) */}
      <PatternBackground className="absolute inset-0" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Telegram className="text-yellow-600 text-3xl mx-auto" />
        </div>
        <button className="text-white bg-blue-600 px-4 py-2 rounded">
          DOWNLOAD
        </button>
      </header>

      {/* Modal Content */}
      <main className="relative z-10 p-4 max-w-sm w-full">
        <div className="bg-gray-800 rounded-lg p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">OneStep ID</h2>
          <p className="text-gray-400">@OneStepID.Bot</p>
          <p className="text-gray-300">
            Authorize OneStep to send you messages on your Telegram account.
          </p>
          <Link to={redirectPath} className="w-full py-3 bg-black px-4 text-white rounded-lg hover:bg-blue-700">
            SEND MESSAGE
          </Link>
        </div>
      </main>
    </div>
  );
}