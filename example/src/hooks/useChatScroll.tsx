import { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';

/**
 * Manages FlatList scroll behavior for a chat interface.
 *
 * Returns a ref to attach to the FlatList and a function to scroll to the
 * bottom of the list, intended to be called when new messages arrive.
 *
 * @returns {{ listRef: React.RefObject<FlatList>, scrollToEnd: () => void }}
 */
function useChatScroll() {
  const listRef = useRef<FlatList>(null);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  return { listRef, scrollToEnd };
}

export default useChatScroll;
