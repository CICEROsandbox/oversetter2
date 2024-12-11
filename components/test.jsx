
"use client";
import React, { useState } from 'react';

const Test = () => {
  const [text, setText] = useState('');

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Norwegian Text</h1>
      <textarea
        className="w-full p-2 border rounded"
        value={text}
        onChange={(e) => {
          console.log('Input changing:', e.target.value);
          setText(e.target.value);
        }}
        placeholder="Type here..."
        rows={5}
      />
      <button 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => console.log('Current text:', text)}
      >
        Test
      </button>
    </div>
  );
};

export default Test;
