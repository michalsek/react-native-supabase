import { useEffect, useEffectEvent, useMemo, useRef } from 'react';
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

interface UseRealtimeChannelOptions {
  channelName: string;
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
  const { channelName } = options;

  const appStateRef = useRef<AppStateStatus>(
    AppState.currentState as AppStateStatus
  );

  const client = useSupabaseClient<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  >();

  const channel = useMemo(
    () => client.channel(channelName),
    [client, channelName]
  );

  const subscribeToChannel = useEffectEvent(() => {
    channel.subscribe((status, error) => {
      // TODO: add external handler and retry logic???
      if (error) {
        Log.error('Error subscribing to realtime channel', { status, error });
      } else {
        Log.debug('Subscribed to realtime channel', { status });
      }
    });
  });

  const unsubscribeFromChannel = useEffectEvent(() => {
    channel.unsubscribe();
  });

  useEffect(() => {
    subscribeToChannel();

    return () => {
      unsubscribeFromChannel();
    };
  }, []);

  useEffect(() => {
    appStateRef.current = AppState.currentState as AppStateStatus;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (previousAppState !== 'active' && nextAppState === 'active') {
        subscribeToChannel();
      }

      if (previousAppState === 'active' && nextAppState !== 'active') {
        unsubscribeFromChannel();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return channel;
}
