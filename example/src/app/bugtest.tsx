import {
  type RealtimePostgresInsertPayload,
  type RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useSupabaseClient } from 'react-native-supabase';

const BugtestRoute: React.FC = () => {
  const client = useSupabaseClient();

  useEffect(() => {
    const channel = client.channel('test', { config: {} });

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'test' },
        (payload: RealtimePostgresInsertPayload<Record<string, unknown>>) => {
          console.log(`~~~~~~ INSERT: ${payload.new}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'test' },
        (payload: RealtimePostgresUpdatePayload<Record<string, unknown>>) => {
          console.log(`~~~~~~ UPDATE: ${payload.new}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'test' },
        () => {
          console.log(`~~~~~~ DELETE`);
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error(':x: settingsStore: Supabase sub error:', err);
        } else {
          console.log(':warning: settingsStore: Supabase sub status:', status);
        }
      });
  }, [client]);

  return null;
};

export default BugtestRoute;
