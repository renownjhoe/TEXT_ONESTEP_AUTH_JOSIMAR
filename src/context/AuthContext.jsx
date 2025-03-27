import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  otp: '',
  passcode: '',
  kycStatus: 'pending',
  biometrics: {},
  notifications: [],
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PASSCODE':
      return { ...state, passcode: action.payload };
    case 'SET_KYC_STATUS':
      return { ...state, kycStatus: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: uuidv4(),
            message: action.payload.message,
            type: action.payload.type || 'info', // Default to 'info' if no type is provided
          },
        ],
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);