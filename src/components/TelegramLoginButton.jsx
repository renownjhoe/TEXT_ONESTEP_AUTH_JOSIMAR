import React, { useEffect, useRef } from 'react';

const TelegramLoginButton = ({ onAuth }) => {
  const telegramBtnRef = useRef(null);

  useEffect(() => {
    // Create script element for Telegram widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'OneBoth99Bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-request-access', 'write');
    
    // Set up callback function to be called when user is authenticated
    window.onTelegramAuth = (user) => {
      onAuth(user);
    };
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    
    // Add the script to the container
    if (telegramBtnRef.current) {
      telegramBtnRef.current.innerHTML = '';
      telegramBtnRef.current.appendChild(script);
    }
    
    return () => {
      // Clean up when component unmounts
      if (telegramBtnRef.current) {
        telegramBtnRef.current.innerHTML = '';
      }
      delete window.onTelegramAuth;
    };
  }, [onAuth]);
  
  return <div ref={telegramBtnRef} className="telegram-login-container"></div>;
};

export default TelegramLoginButton;