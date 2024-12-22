import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <span>Yükleniyor...</span>
    </div>
  );
}; 