import { useCallback, useState } from 'react';

export default function KYCUpload({ label, accept, onFileChange }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleFile = (file) => {
    if (file.type.match(/image.*|application\/pdf/)) {
      setFile(file);
      onFileChange(file);
      if (file.type.match(/image.*/)) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className="w-full mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="text-center">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-32 mx-auto mb-2" />
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <div className="flex text-sm text-gray-600 flex-col w-full">
            <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
              <span>Upload a file</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          {file && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {file.name} ({Math.round(file.size / 1024)}KB)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}