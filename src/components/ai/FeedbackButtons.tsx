import React from 'react';

interface FeedbackButtonsProps {
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  showLabels?: boolean;
}

export default function FeedbackButtons({ onThumbsUp, onThumbsDown, showLabels = false }: FeedbackButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onThumbsUp}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-green-600"
        aria-label="Thumbs up"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        {showLabels && <span className="text-xs">Helpful</span>}
      </button>
      <button
        onClick={onThumbsDown}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-600"
        aria-label="Thumbs down"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
        {showLabels && <span className="text-xs">Not helpful</span>}
      </button>
    </div>
  );
}
