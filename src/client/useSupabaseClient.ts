import { useContext } from 'react';

import SupabaseContext from './context';

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DefaultSchemaName,
  DefaultSchemaNameOrClientOptions,
  SchemaKeys,
  SchemaNameOrClientOptionsConstraint,
} from '../types';

export default function useSupabaseClient<
  Database = any,
  SchemaNameOrClientOptions extends SchemaNameOrClientOptionsConstraint<Database> = DefaultSchemaNameOrClientOptions<Database>,
  SchemaName extends SchemaKeys<Database> = DefaultSchemaName<
    Database,
    SchemaNameOrClientOptions
  >
>() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabaseClient must be used within a SupabaseProvider');
  }

  return context.client as SupabaseClient<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  >;
}
