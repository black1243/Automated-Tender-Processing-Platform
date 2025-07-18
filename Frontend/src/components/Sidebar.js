import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <aside className="w-80 bg-white shadow-md flex flex-col p-4 gap-6">
      {children}
    </aside>
  );
};

export default Sidebar; 