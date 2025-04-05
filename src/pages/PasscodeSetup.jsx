import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper function for basic passcode strength check
const isPasscodeStrong = (passcode) => {
    return passcode.length >= 6 && /[a-zA-Z]/.test(passcode) && /\d/.test(passcode);
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
        } else if (passcode.length < 8) {
            newErrors.push('Passcode must be at least 8 characters long');
        } else if (!isPasscodeStrong(passcode)) {
            newErrors.push('Passcode must contain at least one letter and one number');
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

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <span className="text-xl font-bold">ONESTEP</span>
                <button className="text-white">X</button>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Setup your Passcode</h2>
                        <p className="text-gray-400">
                            You need to setup your OneStep passcode to properly keep your account
                            completely safe and secured from the prying eyes of hackers.
                        </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                1
                            </div>
                            <span>Account Setup</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                2
                            </div>
                            <span>Setup Passcode</span>
                        </div>
                    </div>

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
                                    name="passcode"
                                    id="passcode"
                                    className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                                    placeholder="Enter Passcode"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
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
                                Your Passcode must not be related to your Date of Birth in any way.
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
                                    name="confirmPasscode"
                                    id="confirmPasscode"
                                    className="focus:ring-blue-500 py-3 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                                    placeholder="Confirm Passcode"
                                    value={confirmPasscode}
                                    onChange={(e) => setConfirmPasscode(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg"
                                onClick={handlePrevious}
                            >
                                PREVIOUS
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                            >
                                PROCEED
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-xs text-gray-400">
                        NOTE: Provide correct information relation to yourself. Your Phone Number
                        and other details as they will be used for authentication, authorization, and
                        verification before payments and other essential support services are made.
                    </div>

                    <div className="text-center text-xs text-gray-400">
                        By using Login you agree to our{' '}
                        <Link to="/terms" className="text-blue-500">
                            Terms
                        </Link>{' '}
                        &amp;{' '}
                        <Link to="/privacy" className="text-blue-500">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SetupPasscode;