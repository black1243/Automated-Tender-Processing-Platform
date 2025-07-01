import React from 'react';

const Summary = ({ content }) => (
  <div className="bg-white rounded shadow p-6 min-h-[300px]">
    <div className="font-bold text-xl mb-4">Podsumowanie</div>
    <div className="text-gray-700 whitespace-pre-line">{content}</div>
  </div>
);

export default Summary; 