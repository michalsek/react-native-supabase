import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import useChatScroll from '../hooks/useChatScroll';
import useRealtimeChat, {
  type ChatMessage as ChatMessageType,
} from '../hooks/useRealtimeChat';
import sendIconImage from '../icons/paperairplane.png';
import ChatMessage from './ChatMessage';

const keyExtractor = (item: ChatMessageType) => item.id;

interface RealtimeChatProps {
  roomName: string;
  username: string;
}

const RealtimeChat: React.FC<RealtimeChatProps> = ({ roomName, username }) => {
  const insets = useSafeAreaInsets();
  const { listRef, scrollToEnd } = useChatScroll();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const { messages, sendMessage } = useRealtimeChat({
    roomName,
    username,
  });

  const renderItem = useCallback(
    ({ item }: { item: ChatMessageType }) => (
      <ChatMessage
        message={item.content}
        sender={item.user.name}
        isOwnMessage={item.user.name === username}
      />
    ),
    [username]
  );

  const onSendMessage = useCallback(async () => {
    if (inputText.trim() === '') {
      return;
    }

    await sendMessage(inputText.trim());
    setInputText('');
    scrollToEnd();
  }, [inputText, sendMessage, scrollToEnd]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToEnd}
        />
      </SafeAreaView>

      <View
        style={[
          styles.inputBar,
          { paddingBottom: 8 + (isKeyboardVisible ? 0 : insets.bottom) },
        ]}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message…"
          placeholderTextColor="#8e8e93"
          returnKeyType="send"
          onSubmitEditing={onSendMessage}
        />
        {__DEV__ && (
          <Pressable onPress={onSendMessage}>
            {({ pressed }) => (
              <View
                style={[styles.sendButton, pressed && styles.sendButtonPressed]}
              >
                <Image source={sendIconImage} style={styles.sendButtonIcon} />
              </View>
            )}
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default RealtimeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messageList: {
    paddingVertical: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    marginLeft: 12,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343434',
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  sendButtonPressed: {
    opacity: 0.6,
  },
  sendButtonIcon: {
    width: 16,
    height: 16,
  },
});
