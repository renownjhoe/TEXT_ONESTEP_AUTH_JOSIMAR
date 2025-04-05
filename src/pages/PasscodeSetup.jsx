import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper function to check if passcode is exactly 6 digits
const isPasscodeValid = (passcode) => {
    return /^\d{6}$/.test(passcode);
};

// Helper function to check if passcode is similar to DOB
const isPasscodeSimilarToDOB = (passcode, dob) => {
    if (!dob || !passcode) return false;
    const cleanDOB = dob.replace(/[-/]/g, '');
    return cleanDOB.includes(passcode) || passcode.includes(cleanDOB);
};

const SetupPasscode = () => {
    const [passcode, setPasscode] = useState('');
    const [confirmPasscode, setConfirmPasscode] = useState('');
    const [errors, setErrors] = useState([]);
    
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();

    // Access user data from the state
    const userData = state.user || {};

    const validatePasscode = () => {
        const newErrors = [];

        if (!passcode) {
            newErrors.push('Passcode is required');
        } else if (!isPasscodeValid(passcode)) {
            newErrors.push('Passcode must be exactly 6 digits');
        }

        if (passcode !== confirmPasscode) {
            newErrors.push('Passcodes do not match');
        }

        if (userData.dob && isPasscodeSimilarToDOB(passcode, userData.dob)) {
            newErrors.push('Passcode cannot contain your date of birth');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validatePasscode()) {
            // Get Telegram user data from localStorage
            const telegramUserJSON = localStorage.getItem('telegramUser');
            const telegramUser = telegramUserJSON ? JSON.parse(telegramUserJSON) : {};
            
            // Update telegramUser with passcode
            const updatedUser = {
                ...telegramUser,
                ...userData,
                passcode: passcode
            };
            
            // Save updated user to localStorage
            localStorage.setItem('telegramUser', JSON.stringify(updatedUser));
            
            // Update auth context
            dispatch({ 
                type: 'SET_USER', 
                payload: updatedUser 
            });
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    type: 'success',
                    message: 'Passcode setup successful!',
                }
            });
            
            navigate('/biometric-setup');
        }
    };

    const handlePrevious = () => {
        navigate('/account-setup');
    };

    // Handle numeric input only
    const handleNumericInput = (value, setter) => {
        const numericValue = value.replace(/\D/g, ''); // Remove non-digit characters
        setter(numericValue);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header remains unchanged */}

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-6">
                    {/* Title and progress indicators remain unchanged */}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                PASSCODE
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    name="passcode"
                                    id="passcode"
                                    className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                                    placeholder="Enter 6-digit Passcode"
                                    value={passcode}
                                    onChange={(e) => handleNumericInput(e.target.value, setPasscode)}
                                    maxLength="6"
                                />
                            </div>
                            {errors.length > 0 && (
                                <div className="mt-2 text-sm text-red-500">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            )}
                            <p className="mt-2 text-sm text-gray-500">
                                Your Passcode must be 6 digits and not related to your Date of Birth
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                CONFIRM PASSCODE
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    name="confirmPasscode"
                                    id="confirmPasscode"
                                    className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                                    placeholder="Confirm 6-digit Passcode"
                                    value={confirmPasscode}
                                    onChange={(e) => handleNumericInput(e.target.value, setConfirmPasscode)}
                                    maxLength="6"
                                />
                            </div>
                        </div>
                        {/* Buttons and other elements remain unchanged */}
                    </form>

                    {/* Footer content remains unchanged */}
                </div>
            </main>
        </div>
    );
};

export default SetupPasscode;