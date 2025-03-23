import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 mt-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm">
          © {currentYear} Bank Accounts Management System. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
