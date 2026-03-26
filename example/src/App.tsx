import { ExpoRoot, type RequireContext } from 'expo-router';
import { SupabaseProvider } from 'react-native-supabase';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Env } from './api';

const context = (
  require as unknown as { context: (path: string) => RequireContext }
).context('./app');

export default function App() {
  return (
    <SafeAreaProvider>
      <SupabaseProvider
        supabaseUrl={Env.supabaseUrl}
        supabaseKey={Env.supabaseKey}
      >
        <ExpoRoot context={context} />
      </SupabaseProvider>
    </SafeAreaProvider>
  );
}
