import { useEffect, useState } from 'react';
import Fingerprint from '@mui/icons-material/Fingerprint';
import Face from '@mui/icons-material/Face';

export default function BiometricScanner({ type, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onComplete();
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  return (
    <div className="text-center p-6 border rounded-lg bg-gray-50">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          {type === 'fingerprint' ? (
            <Fingerprint 
              className="text-blue-600"
              sx={{ fontSize: 64 }} // MUI's sizing system
            />
          ) : (
            <Face 
              className="text-blue-600"
              sx={{ fontSize: 64 }}
            />
          )}
        </div>
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-current text-gray-200"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-current text-blue-600"
              strokeWidth="10"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
            />
          </svg>
        </div>
      </div>
      
      <button
        onClick={() => setIsScanning(true)}
        disabled={isScanning}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isScanning ? 'Scanning...' : `Start ${type === 'fingerprint' ? 'Fingerprint' : 'Face'} Scan`}
      </button>
      
      {progress === 100 && (
        <p className="mt-2 text-green-600">Scan successful!</p>
      )}
    </div>
  );
}