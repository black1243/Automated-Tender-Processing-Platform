import React from 'react';

const PrzetargInfo = ({ name, deadline }) => (
  <div className="mb-4">
    <div className="font-bold text-lg">{name}</div>
    <div className="text-sm text-gray-500">Deadline: {deadline}</div>
  </div>
);

export default PrzetargInfo; 