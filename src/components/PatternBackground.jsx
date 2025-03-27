import React from 'react';

function PatternBackground({ className, imageUrl }) {
  return (
    <div
      className={`absolute inset-0 bg-repeat ${className}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    ></div>
  );
}

export default PatternBackground;