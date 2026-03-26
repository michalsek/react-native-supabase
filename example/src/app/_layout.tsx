import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="chat"
        options={{ headerShown: true, title: 'Chat' }}
      />
      <Stack.Screen name="index" options={{ headerShown: false, title: '' }} />
    </Stack>
  );
}
