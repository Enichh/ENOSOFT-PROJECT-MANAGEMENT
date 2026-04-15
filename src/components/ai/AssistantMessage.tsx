interface AssistantMessageProps {
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

export default function AssistantMessage({ content, timestamp, isLoading }: AssistantMessageProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />');
  };

  if (isLoading) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-sm px-4 py-3">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-sm px-4 py-2">
          <div
            className="text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
}
