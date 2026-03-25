import React, { useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatMessage from './components/ChatMessage';
import useChatScroll from './hooks/useChatScroll';
import useRealtimeChat, {
  type ChatMessage as ChatMsg,
} from './hooks/useRealtimeChat';

const RealtimeChat: React.FC = () => {
  const { listRef, scrollToEnd } = useChatScroll();
  const { messages, inputText, setInputText, sendMessage, currentUser } =
    useRealtimeChat(scrollToEnd);

  const renderItem = useCallback(
    ({ item }: { item: ChatMsg }) => (
      <ChatMessage
        message={item.message}
        sender={item.sender}
        isOwnMessage={item.sender === currentUser}
      />
    ),
    [currentUser]
  );

  const keyExtractor = useCallback((item: ChatMsg) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToEnd}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message…"
            placeholderTextColor="#8e8e93"
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
              inputText.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim().length === 0}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RealtimeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  messageList: {
    paddingVertical: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 34,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
    backgroundColor: '#F8F8F8',
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
  },
  sendButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#007AFF',
    borderRadius: 18,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  sendButtonDisabled: {
    backgroundColor: '#B0B0B5',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
