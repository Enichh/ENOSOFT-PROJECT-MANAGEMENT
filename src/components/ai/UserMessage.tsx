import React from 'react';

interface UserMessageProps {
  content: string;
  timestamp: string;
}

export default function UserMessage({ content, timestamp }: UserMessageProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%]">
        <div className="bg-primary-600 text-white rounded-lg rounded-br-sm px-4 py-2">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
}
