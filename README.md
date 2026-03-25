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

`useRealtimeChannel` creates and subscribes to a Supabase realtime channel. It automatically manages the subscription lifecycle — subscribing when the component mounts and the app is in the foreground, and unsubscribing when the component unmounts or the app goes to the background.

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

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
