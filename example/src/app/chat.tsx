import { useLocalSearchParams } from 'expo-router';
import RealtimeChat from '../components/RealtimeChat';

type ChatRouteParams = {
  room: string;
  username: string;
};

export default function ChatRoute() {
  const searchParams = useLocalSearchParams<ChatRouteParams>();

  return (
    <RealtimeChat
      roomName={searchParams.room}
      username={searchParams.username}
    />
  );
}
