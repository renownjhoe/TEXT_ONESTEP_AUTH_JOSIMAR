// Function to generate a 6-digit token
export const generateSixDigitToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};