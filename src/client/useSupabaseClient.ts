import { useContext } from 'react';

import SupabaseContext, { type SupabaseContextType } from './context';

export default function useSupabaseClient(): SupabaseContextType {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabaseClient must be used within a SupabaseProvider');
  }

  return context;
}
