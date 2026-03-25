import { useCallback, useState } from 'react';

export interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: number;
}

const CURRENT_USER = 'You';

/**
 * Manages local chat state with a list of messages and a draft input.
 *
 * Provides the current messages array, the current input text, a setter
 * for the input, and a send function that appends a new message from
 * the current user and clears the input.
 *
 * No backend wiring — all state is local.
 *
 * @param onMessageSent - Optional callback invoked after a message is added.
 * @returns {{ messages, inputText, setInputText, sendMessage }}
 */
function useRealtimeChat(onMessageSent?: () => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Alice',
      message: 'Hey! Welcome to the chat 👋',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      sender: 'Bob',
      message: 'Hi there! How is it going?',
      timestamp: Date.now() - 30000,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) {
      return;
    }

    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: CURRENT_USER,
      message: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    onMessageSent?.();
  }, [inputText, onMessageSent]);

  return {
    messages,
    inputText,
    setInputText,
    sendMessage,
    currentUser: CURRENT_USER,
  };
}

export default useRealtimeChat;
