import { SupabaseProvider } from 'react-native-supabase';

import RealtimeChat from './RealtimeChat';
import { Env } from './api';

export default function App() {
  return (
    <SupabaseProvider
      supabaseUrl={Env.supabaseUrl}
      supabaseKey={Env.supabaseKey}
    >
      <RealtimeChat />
    </SupabaseProvider>
  );
}
