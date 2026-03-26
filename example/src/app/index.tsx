import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';
import { getRandomName } from '../utils/randomWords';

export default function IndexRoute() {
  const [roomName, setRoomName] = useState('General');
  const [username, setUsername] = useState(getRandomName());

  const handleJoinRoom = () => {
    router.navigate(
      `/chat?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(
        username
      )}`
    );
  };

  // const handleBugtest = () => {
  //   router.navigate('/bugtest');
  // };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Room Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter room name"
            value={roomName}
            onChangeText={setRoomName}
          />
        </View>
        <View style={styles.spacer} />
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.spacer} />
        <View style={styles.actionRow}>
          <Pressable style={styles.submitButton} onPress={handleJoinRoom}>
            <Text style={styles.submitButtonText}>Join Room</Text>
          </Pressable>
        </View>
      </View>
      {/*
      <Pressable
        style={[styles.submitButton, { marginTop: 24 }]}
        onPress={handleBugtest}
      >
        <Text style={styles.submitButtonText}>Go to Bugtest</Text>
      </Pressable> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 160,
  },
  form: {
    width: '75%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 2,
    borderColor: '#343434',
    borderWidth: StyleSheet.hairlineWidth,
  },
  field: {
    position: 'relative',
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#8e8e93',
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    left: 4,
    top: -1,
    zIndex: 1,
  },
  input: {
    borderColor: '#343434',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingTop: 10,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: '#343434',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  submitButtonText: {
    fontSize: 12,
    color: '#fff',
  },
  spacer: {
    height: 16,
  },
});
