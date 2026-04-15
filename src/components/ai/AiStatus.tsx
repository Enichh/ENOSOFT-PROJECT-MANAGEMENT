interface AiStatusProps {
  status: 'available' | 'loading' | 'error';
}

export default function AiStatus({ status }: AiStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'loading':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return 'AI Available';
      case 'loading':
        return 'AI Processing';
      case 'error':
        return 'AI Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-xs text-gray-600">{getStatusText()}</span>
    </div>
  );
}
