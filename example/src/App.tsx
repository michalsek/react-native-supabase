import { StyleSheet, Text, View } from 'react-native';

import { SupabaseProvider } from 'react-native-supabase';

export default function App() {
  return (
    <SupabaseProvider
      supabaseKey="12332131"
      supabaseUrl="https://your-project.supabase.co"
    >
      <View style={styles.container}>
        <Text>HE!</Text>
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
