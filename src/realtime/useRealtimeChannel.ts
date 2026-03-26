import { type REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { useEffect, useMemo, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useSupabaseClient } from '../client';
import { Logger } from '../utils';

import type {
  DefaultSchemaName,
  DefaultSchemaNameOrClientOptions,
  SchemaKeys,
  SchemaNameOrClientOptionsConstraint,
} from '../types';
import { LogCategory } from '../utils/Logger';

type OnSubscribeCallback = (
  status: REALTIME_SUBSCRIBE_STATES,
  error: Error | undefined
) => void;

interface UseRealtimeChannelOptions {
  channelName: string;
  onSubscribe?: OnSubscribeCallback;
}

const Log = Logger.extend(LogCategory.Realtime);

export default function useRealtimeChannel<
  Database = any,
  SchemaNameOrClientOptions extends SchemaNameOrClientOptionsConstraint<Database> = DefaultSchemaNameOrClientOptions<Database>,
  SchemaName extends SchemaKeys<Database> = DefaultSchemaName<
    Database,
    SchemaNameOrClientOptions
  >
>(options: UseRealtimeChannelOptions) {
  const { channelName, onSubscribe } = options;

  const appStateRef = useRef<AppStateStatus>(
    AppState.currentState as AppStateStatus
  );

  const client = useSupabaseClient<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  >();

  const channel = useMemo(() => {
    const realtimeChannel = client.channel(channelName);

    realtimeChannel.subscribe((status, error) => {
      onSubscribe?.(status, error);
    });

    return realtimeChannel;
  }, [client, channelName, onSubscribe]);

  const channelRef = useRef(channel);

  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  useEffect(() => {
    appStateRef.current = AppState.currentState as AppStateStatus;

    async function reconnectSocket() {
      if (!channelRef.current) {
        return;
      }

      Log.debug('Reconnecting socket', {
        channelName: channelRef.current?.topic,
      });

      await channelRef.current?.socket.disconnect();
      channelRef.current?.socket.connect();
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (previousAppState !== 'active' && nextAppState === 'active') {
        reconnectSocket();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return channel;
}
