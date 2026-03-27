# react-native-supabase

Utility hooks for supabase usage in react-native

## Installation

```sh
npm install react-native-supabase
```

## Usage

### Setting up the provider

Wrap your app with `SupabaseProvider`. You can either pass a pre-created client or let the provider create one for you:

```tsx
import { SupabaseProvider } from 'react-native-supabase';

export default function App() {
  return (
    <SupabaseProvider
      supabaseUrl="https://your-project.supabase.co"
      supabaseKey="your-publishable-key"
    >
      <MainApp />
    </SupabaseProvider>
  );
}
```

Or with an existing client:

```tsx
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider } from 'react-native-supabase';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-publishable-key'
);

export default function App() {
  return (
    <SupabaseProvider client={supabase}>
      <MainApp />
    </SupabaaseProvider>
  );
}
```

### Subscribing to a realtime channel

`useRealtimeChannel` creates and subscribes to a Supabase realtime channel. It automatically manages the subscription lifecycle.

```tsx
import { useRealtimeChannel } from 'react-native-supabase';

function Chat() {
  const channel = useRealtimeChannel({ channelName: 'chat-room' });

  useEffect(() => {
    channel.on('broadcast', { event: 'message' }, (payload) => {
      console.log('New message:', payload);
    });
  }, [channel]);

  return <View>{/* your UI */}</View>;
}
```

## DIY

### useRealtimeChannel

If you prefer to manage the realtime channel yourself instead of using the hook from this library, here's a reference implementation covering what `useRealtimeChannel` does under the hood:

```tsx
import { useEffect, useMemo, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type {
  SupabaseClient,
  RealtimeChannel,
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js';

function useRealtimeChannel(
  client: SupabaseClient,
  channelName: string
): RealtimeChannel {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Create the channel and subscribe. Recreated when the client or channel name changes.
  const channel = useMemo(() => {
    const ch = client.channel(channelName);

    ch.subscribe((status, error) => {
      console.log('Channel subscription status', status, error);
    });

    return ch;
  }, [client, channelName, onSubscribe]);

  const channelRef = useRef(channel);

  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  // Reconnect the underlying socket when the app returns to the foreground.
  // Mobile OS's may silently drop the WebSocket while the app is backgrounded.
  useEffect(() => {
    appStateRef.current = AppState.currentState;

    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        const prev = appStateRef.current;
        appStateRef.current = nextAppState;

        if (
          prev !== 'active' &&
          nextAppState === 'active' &&
          channelRef.current
        ) {
          await channelRef.current.socket.disconnect();
          channelRef.current.socket.connect();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return channel;
}
```

Key responsibilities handled by the hook:

- **Channel creation & subscription** — creates the channel via `client.channel()` and calls `.subscribe()` immediately, memoized on `client` and `channelName`.
- **Foreground reconnection** — listens to `AppState` changes and, when the app transitions back to `active`, disconnects and reconnects the underlying socket so the subscription recovers from OS-level WebSocket drops.
- **Ref tracking** — keeps a stable ref to the latest channel so the `AppState` listener always operates on the current instance without requiring effect re-registration.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
