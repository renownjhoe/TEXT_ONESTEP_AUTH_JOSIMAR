import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockAPI as api } from '../services/api';
import KYCUpload from '../components/KYCUpload';
import { AlertCircle, UploadCloud } from "lucide-react"

export default function KYCSetup() {
    const [selfie, setSelfie] = useState(null);
    const [idFile, setIdFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        dob: '',
        country: '',
        city: '',
        address1: '',
        zip: '',
        address2: '',
    });

    useEffect(() => {
        if (!state.user) {
            navigate('/');
        }

        // Load data from localStorage
        const telegramUserJSON = localStorage.getItem('telegramUser');
        let telegramUserData = {};
        if (telegramUserJSON) {
            telegramUserData = JSON.parse(telegramUserJSON);
        }

        setFormData(prevData => ({
            ...prevData,
            fullName: telegramUserData.fullName || '',
            phone: telegramUserData.phone || '',
            dob: telegramUserData.dob || '',
            email:  '',
            country: '',
            city: '',
            address1: '',
            zip: '',
            address2: '',
        }));

    }, [navigate, state.user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasErrors = false;
        const newErrors = [];

        if (!selfie) {
            newErrors.push('Selfie with ID is required');
            hasErrors = true;
        }
        if (!idFile) {
            newErrors.push('Government ID upload is required');
            hasErrors = true;
        }
        setErrors(newErrors);

        if (hasErrors) {
            return;
        }

        setLoading(true);
        const formSubmitData = new FormData();
        formSubmitData.append('name', formData.fullName);
        formSubmitData.append('selfie', selfie);
        formSubmitData.append('idFile', idFile);

        try {
            const response = await api.submitKYC(formSubmitData);
            if (response.success) {
                // Update telegramUser in localStorage
                const telegramUserJSON = localStorage.getItem('telegramUser');
                let telegramUserData = {};
                if (telegramUserJSON) {
                    telegramUserData = JSON.parse(telegramUserJSON);
                }
                const updatedTelegramUser = {
                    ...telegramUserData,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    dob: formData.dob,
                    email: formData.email,
                    country: formData.country,
                    city: formData.city,
                    address1: formData.address1,
                    zip: formData.zip,
                    address2: formData.address2,
                };
                localStorage.setItem('telegramUser', JSON.stringify(updatedTelegramUser));

                dispatch({ type: 'SET_KYC_STATUS', payload: 'processing' });
                dispatch({ type: 'ADD_NOTIFICATION', payload: 'KYC submission successful' });
                navigate('/dashboard');
            } else {
                setErrors(['Submission failed. Please try again.', response.message]);
            }
        } catch (error) {
            setErrors(['Submission failed. Please try again.', error.message || 'An unexpected error occurred.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-3xl font-bold">KYC and AML</span>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
                    <p className="text-gray-400 mb-6">
                        Kindly fill the form below. Please ensure to input your authentic information only.
                    </p>

                    {errors.length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <AlertCircle className="h-4 w-4 inline-block mr-2" />
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">
                                {errors.map((error, index) => (
                                    <React.Fragment key={index}>
                                        {error}
                                        {index < errors.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='w-full'>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                                    FullName
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='w-full'>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-300">
                                    Date of Birth
                                </label>
                                <input
                                    id="dob"
                                    type="text"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='w-full'>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                                    Country of Residence
                                </label>
                                <input
                                    id="country"
                                    type="text"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='w-full'>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                                    City of Residence
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="address1" className="block text-sm font-medium text-gray-300">
                                    Address
                                </label>
                                <input
                                    id="address1"
                                    type="text"
                                    value={formData.address1}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='w-full'>
                                <label htmlFor="zip" className="block text-sm font-medium text-gray-300">
                                    ZIP / Postal Code
                                </label>
                                <input
                                    id="zip"
                                    type="text"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="address2" className="block text-sm font-medium text-gray-300">
                                    Address #2 (Optional)
                                </label>
                                <input
                                    id="address2"
                                    type="text"
                                    value={formData.address2}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Selfie with ID Document
                            </label>
                            <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-md">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-400">
                                        <label className="relative cursor-pointer text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <KYCUpload
                                                label="Selfie with ID Document"
                                                accept="image/*"
                                                onFileChange={(file) => setSelfie(file)}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG up to 10MB
                                    </p>
                                    {selfie && (
                                        <p className="mt-2 text-sm text-white">
                                            Selected: {selfie.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Government Issued ID
                            </label>
                            <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-md">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-400">
                                        <label className="relative cursor-pointer text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <KYCUpload
                                                label="Government Issued ID"
                                                accept="image/*,application/pdf"
                                                onFileChange={(file) => setIdFile(file)}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, PNG, JPG up to 10MB
                                    </p>
                                    {idFile && (
                                        <p className="mt-2 text-sm text-white">
                                            Selected: {idFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition-colors duration-200 disabled:bg-blue-400"
                        >
                            {loading ? 'Submitting...' : 'Submit Verification'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}