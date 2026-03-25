import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatMessageProps {
  message: string;
  sender: string;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = (props) => {
  const { message, sender, isOwnMessage } = props;

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      {!isOwnMessage && <Text style={styles.sender}>{sender}</Text>}
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.message,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  sender: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 2,
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E9E9EB',
    borderBottomLeftRadius: 4,
  },
  message: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessage: {
    color: '#FFFFFF',
  },
  otherMessage: {
    color: '#000000',
  },
});
