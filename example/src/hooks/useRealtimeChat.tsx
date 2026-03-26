import { useCallback, useEffect, useState } from 'react';
import { useRealtimeChannel } from 'react-native-supabase';

import { uniqueId } from '../utils';

interface UseRealtimeChatOptions {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = 'message';

function useRealtimeChat(options: UseRealtimeChatOptions) {
  const { roomName, username } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const channel = useRealtimeChannel({ channelName: roomName });

  useEffect(() => {
    channel.on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        payload.payload as ChatMessage,
      ]);
    });
  }, [channel]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel) {
        return;
      }

      const message: ChatMessage = {
        id: uniqueId(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      };

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
      setMessages((prevMessages) => [...prevMessages, message]);
    },
    [channel, username]
  );

  return { messages, sendMessage };
}

export default useRealtimeChat;
