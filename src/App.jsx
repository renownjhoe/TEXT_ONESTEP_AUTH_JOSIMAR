import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PasscodeSetup from './pages/PasscodeSetup';
import LoginSetup from './pages/LoginSetup';
import RegisterSetup from './pages/RegisterSetup';
import BiometricSetup from './pages/BiometricSetup';
import KYCSetup from './pages/KYCSetup';
import Dashboard from './pages/Dashboard';
import Notification from './components/Notification';
import EmotionProvider from './emotion'
import OTPPage from './pages/OTPPage';
import AccountSetup from './pages/AccountSetup';
import './App.css';
import TelegramAuth from './pages/TelegramAuth';
import TelegramCallbackPage from './pages/TelegramCallbackPage';
import PasscodeLogin from './pages/LoginWithPasscode';
import BiometricsLogin from './pages/LoginWithBiometric';

function App() {
  return (
    <EmotionProvider>
    <AuthProvider>
      <Router>
        <Notification />
        <Routes>
          <Route path="/" element={<LoginSetup />} />          
          <Route path="/passcode-login" element={<PasscodeLogin />} />
          <Route path="/biometric-login" element={<BiometricsLogin />} />
          <Route path="/signup" element={<RegisterSetup />} />
          <Route path="/telegram-auth" element={<TelegramAuth />} />
          <Route path="/auth/telegram/callback" element={<TelegramCallbackPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/account-setup" element={<AccountSetup />} />
          <Route path="/passcode-setup" element={<PasscodeSetup />} />
          <Route path="/biometric-setup" element={<BiometricSetup />} />
          <Route path="/kyc-setup" element={<KYCSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </EmotionProvider>
  );
}

export default App;