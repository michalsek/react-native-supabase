import { createContext } from 'react';

export interface SupabaseContextType {}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export default SupabaseContext;
