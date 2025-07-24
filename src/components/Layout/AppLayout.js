import React from 'react';
import './AppLayout.css';

const AppLayout = ({ children, className = '' }) => {
  return (
    <div className={`app-layout ${className}`}>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;