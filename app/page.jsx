"use client";
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');

  return (
    <div className="p-4">
      <textarea
        value={text}
        onChange={(e) => {
          console.log('Input changing:', e.target.value);
          setText(e.target.value);
        }}
        className="w-full h-32 border p-2"
      />
      <pre>{text}</pre>
    </div>
  );
}
