import React from 'react';

const FileList = ({ files, onSelect, selectedFileId }) => (
  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
    <div className="font-semibold mb-2 text-white">Files</div>
    <ul className="space-y-2">
      {files.map(file => (
        <li
          key={file.id}
          className={`cursor-pointer p-3 rounded text-white transition-colors duration-150 
            hover:bg-blue-900 hover:text-blue-300
            ${selectedFileId === file.id ? 'bg-blue-800 border-l-4 border-blue-400' : ''}`}
          onClick={() => onSelect(file.id)}
        >
          {file.name}
        </li>
      ))}
    </ul>
  </div>
);

export default FileList; 