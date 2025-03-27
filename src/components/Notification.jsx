import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Notification() {
  const { state, dispatch } = useAuth();
  const timers = useRef([]);

  const handleDismiss = useCallback((id) => {
    const updatedNotifications = state.notifications.filter((n) => n.id !== id);
    dispatch({ type: 'SET_NOTIFICATIONS', payload: updatedNotifications });
  }, [dispatch, state.notifications]);

  useEffect(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];

    state.notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        handleDismiss(notification.id);
      }, 5000);
      timers.current.push(timer);
    });

    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, [handleDismiss, state.notifications]);

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-400 border-green-500';
      case 'error':
        return 'bg-red-500 border-red-500';
      default:
        return 'bg-orange-600 border-blue-500'; // Default color
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 flex justify-between items-center animate-fade-in ${getBackgroundColor(
            notification.type
          )}`}
        >
          <span className="text-sm text-white">{notification.message}</span>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}