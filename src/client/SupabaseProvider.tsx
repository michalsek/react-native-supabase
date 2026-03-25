import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

import SupabaseContext, { type SupabaseContextType } from './context';

import type {
  DefaultSchemaName,
  DefaultSchemaNameOrClientOptions,
  SchemaKeys,
  SchemaNameOrClientOptionsConstraint,
  SupabaseProviderProps,
} from '../types';

function SupabaseProvider<
  Database = any,
  SchemaNameOrClientOptions extends SchemaNameOrClientOptionsConstraint<Database> = DefaultSchemaNameOrClientOptions<Database>,
  SchemaName extends SchemaKeys<Database> = DefaultSchemaName<
    Database,
    SchemaNameOrClientOptions
  >
>(
  props: SupabaseProviderProps<Database, SchemaNameOrClientOptions, SchemaName>
) {
  const { children, ...clientProps } = props;

  const contextValue: SupabaseContextType = useMemo(() => {
    if ('client' in clientProps) {
      return { client: clientProps.client };
    }

    const { supabaseUrl, supabaseKey, options } = clientProps;
    const client = createClient(supabaseUrl, supabaseKey, options);
    return { client };
  }, [clientProps]);

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
}

export default SupabaseProvider;
