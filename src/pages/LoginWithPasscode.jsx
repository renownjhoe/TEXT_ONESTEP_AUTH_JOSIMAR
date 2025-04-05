import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper function to check if passcode is exactly 6 digits
const isPasscodeStrong = (passcode) => {
    return /^\d{6}$/.test(passcode);
};

const PasscodeLogin = () => {
    const [passcode, setPasscode] = useState('');
    const [errors, setErrors] = useState([]);
    
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const validatePasscode = () => {
        const newErrors = [];

        if (!passcode) {
            newErrors.push('Passcode is required');
        } else if (passcode.length < 6) {
            newErrors.push('Passcode must be at least 6 characters long');
        } else if (!isPasscodeStrong(passcode)) {
            newErrors.push('Passcode must be exactly 6 digits');
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

            console.log('Telegram User:', telegramUser);
            
            
            // Update auth context
            dispatch({ 
                type: 'SET_NOTIFICATIONS', 
                payload: '' 
            });
            
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    type: 'success',
                    message: 'Login successful',
                }
            });
            
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <span className="text-xl font-bold">ONESTEP</span>
                <Link to="/home" className="text-blue-500 hover:text-blue-400">
                    <button className="text-white">X</button>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center py-4 px-8">
                <div className="max-w-md w-full space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Access Your Account</h2>
                        <p className="text-gray-400">
                            Access you account with your Passcode
                        </p>
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
                        <div className="flex justify-center items-center">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                            >
                                Login
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

export default PasscodeLogin;