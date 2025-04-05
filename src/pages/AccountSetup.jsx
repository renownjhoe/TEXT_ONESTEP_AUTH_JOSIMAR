import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Calendar,
  Phone,
  Gift,
} from 'lucide-react';

export default function AccountSetup() {
  // Get Telegram user data from localStorage
  const telegramUserJSON = localStorage.getItem('telegramUser');
  const telegramUser = telegramUserJSON ? JSON.parse(telegramUserJSON) : {};
  
  const isUserProfileComplete = (telegramUser) => {
    const requiredFields = [
      'fullName', 'phone', 'email', 'dob', 'passcode', 
      'fingerPrint', 'faceId', 'city_of_residence', 
      'state_of_residence', 'country_of_residence', 
      'address1', 'address2', 'zip', 
      'selfie_with_document', 'government_issue_id'
    ];
    
    return requiredFields.every(field => 
      Object.prototype.hasOwnProperty.call(telegramUser, field) && 
      telegramUser[field] !== null && 
      telegramUser[field] !== undefined
    );
  };
  
  const [formData, setFormData] = useState({
    fullName: (telegramUser.last_name && telegramUser.first_name) 
      ? `${telegramUser.last_name} ${telegramUser.first_name}` 
      : '',
    dob: '',
    phone: '',
    referral: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    dob: '',
    phone: '',
  });

  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { fullName: '', dob: '', phone: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      hasErrors = true;
    }
    if (!formData.dob.trim()) {
      newErrors.dob = 'Date of Birth is required';
      hasErrors = true;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      // Merge Telegram user data with form data
      const updatedTelegramUser = { 
        ...telegramUser,
        fullName: formData.fullName,
        dob: formData.dob,
        phone: formData.phone,
        referral: formData.referral
      };
      
      // Save to localStorage
      localStorage.setItem('telegramUser', JSON.stringify(updatedTelegramUser));
      
      // Update auth context
      dispatch({ type: 'SET_USER', payload: updatedTelegramUser });
      
      // Navigate to next step
      navigate('/passcode-setup');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-gray-800">
        <span className="text-xl font-bold">ONESTEP</span>
        <button className="text-white">X</button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Setup your Account</h2>
            <p className="text-gray-400">
              Enter your Username, Date of Birth, and Phone Number below
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                1
              </div>
              <span>Account Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                2
              </div>
              <span>Setup Passcode</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                FULLNAME
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Fullname"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Must be up to 8 characters and unique
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                DATE OF BIRTH
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="dob"
                  id="dob"
                  className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  placeholder="dd/mm/yy"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              {errors.dob && (
                <p className="mt-2 text-sm text-red-500">{errors.dob}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                PHONE NUMBER
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Optionally, Input Referral & Promo Codes
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Gift className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="referral"
                  id="referral"
                  className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  placeholder="Enter Code"
                  value={formData.referral}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              CONTINUE
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}