import type { SupabaseClient } from '@supabase/supabase-js';
import { createContext } from 'react';

import type {
  DefaultSchemaName,
  DefaultSchemaNameOrClientOptions,
  SchemaKeys,
  SchemaNameOrClientOptionsConstraint,
} from '../types';

export interface SupabaseContextType<
  Database = any,
  SchemaNameOrClientOptions extends SchemaNameOrClientOptionsConstraint<Database> = DefaultSchemaNameOrClientOptions<Database>,
  SchemaName extends SchemaKeys<Database> = DefaultSchemaName<
    Database,
    SchemaNameOrClientOptions
  >
> {
  client: SupabaseClient<Database, SchemaNameOrClientOptions, SchemaName>;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export default SupabaseContext;
