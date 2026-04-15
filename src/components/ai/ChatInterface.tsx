import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import SystemMessage from './SystemMessage';
import ChatInput from './ChatInput';
import { Project, Employee } from '../../types/models';

interface ChatInterfaceProps {
  context?: {
    currentProject?: Project;
    availableEmployees?: Employee[];
  };
  height?: string;
}

export default function ChatInterface({ context, height = '500px' }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage, setContext } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context) {
      setContext(context);
    }
  }, [context, setContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg" style={{ height }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">Start a conversation with AI assistant</p>
          </div>
        )}
        {messages.map((message) => {
          if (message.role === 'user') {
            return <UserMessage key={message.id} content={message.content} timestamp={message.timestamp} />;
          }
          if (message.role === 'assistant') {
            return (
              <AssistantMessage key={message.id} content={message.content} timestamp={message.timestamp} />
            );
          }
          if (message.role === 'system') {
            return <SystemMessage key={message.id} content={message.content} />;
          }
          return null;
        })}
        {isLoading && <AssistantMessage content="" timestamp="" isLoading />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
