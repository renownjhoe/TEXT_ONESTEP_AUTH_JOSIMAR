import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [kycStatus, setKycStatus] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('telegramUser');
        navigate('/');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('telegramUser');
        console.log(storedUser)
        if (!storedUser) {
            navigate('/');
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            localStorage.removeItem('telegramUser');
            navigate('/');
        }

        const storedKycStatus = localStorage.getItem('kycStatus');
        if(storedKycStatus){
          setKycStatus(storedKycStatus)
        }
        else{
          setKycStatus('not started') //set a default.
        }


        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            try {
                setNotifications(JSON.parse(storedNotifications));
            } catch (error) {
                console.error("Error parsing notifications from localStorage:", error);
                localStorage.setItem('notifications', JSON.stringify([])); // Reset to empty array
                setNotifications([]);
            }
        }
        else{
          setNotifications([])
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black p-4">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold text-gray-900">ONESTEP</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{user?.first_name} {user?.last_name}</span>
                        <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center">
                            {user.first_name && user.last_name ? `${user.first_name.substring(0, 1).toUpperCase()}${user.last_name.substring(0, 1).toUpperCase()}` : 'OA'}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-colors"
                >
                    Sign Out
                </button>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto">
                {/* Account Status Card */}
                <div className="bg-black rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Account Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                KYC Status
                            </h3>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        kycStatus === 'approved'
                                            ? 'bg-green-500'
                                            : 'bg-yellow-500'
                                    }`}
                                />
                                <span className="text-sm capitalize">{kycStatus}</span>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Biometrics
                            </h3>
                            <div className="flex items-center gap-2">
                                {(user?.touchIDSetup || user?.faceIDSetup) ? (
                                    <span className="text-green-500">✓ FingerPrint/Face ID</span>
                                ) : (
                                    <span className="text-yellow-500">Setup Required</span>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                Passcode
                            </h3>
                            <div className="flex items-center gap-2">
                                {user?.passcode ? (
                                    <span className="text-green-500">✓ Active</span>
                                ) : (
                                    <span className="text-red-500">Not Set</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Alerts */}
                <div className="bg-black rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Security Alerts</h2>
                    <div className="space-y-4">
                        {notifications.map((notification, index) => (
                            <div key={index} className="flex items-start p-3 bg-black rounded-lg">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3" />
                                <div>
                                    <p className="text-sm">{notification.message}</p>
                                    <span className="text-xs text-gray-500">2 hours ago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-black rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Update Profile
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Change Passcode
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Security Settings
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Activity Log
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-8 text-center text-sm text-gray-600">
                <p>By using ONESTEP you agree to our Terms & Privacy Policy</p>
            </footer>
        </div>
    );
}