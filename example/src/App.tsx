import type React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SupabaseProvider, useRealtimeChannel } from 'react-native-supabase';

const InnerComponent: React.FC = () => {
  const channel = useRealtimeChannel({ channelName: 'my-channel' });

  useEffect(() => {
    channel.on('broadcast', { event: '*' }, (payload) => {
      console.log('Received broadcast message:', payload);
    });

    channel.on('presence', { event: '*' }, (payload) => {
      console.log('Received presence message:', payload);
    });

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      (payload) => {
        console.log('Received postgres change message:', payload);
      }
    );

    channel.on('system', { event: '*' }, (payload) => {
      console.log('Received system message:', payload);
    });
  }, [channel]);

  return null;
};

export default function App() {
  return (
    <SupabaseProvider
      supabaseKey="12332131"
      supabaseUrl="https://your-project.supabase.co"
    >
      <View style={styles.container}>
        <Text>HE!</Text>
        <InnerComponent />
      </View>
    </SupabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
