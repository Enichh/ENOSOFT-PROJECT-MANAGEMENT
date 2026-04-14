import React from 'react';

interface SystemMessageProps {
  content: string;
}

export default function SystemMessage({ content }: SystemMessageProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200">
        {content}
      </div>
    </div>
  );
}
