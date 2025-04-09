// components/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: string; // Optional prop to customize the size of the spinner
  color?: string; // Optional prop to customize the spinner color
}

const Spinner: React.FC<SpinnerProps> = ({ size = '40px', color = '#3498db' }) => {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{ width: size, height: size, borderTopColor: color }}
      />
      <style jsx>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid ${color};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
