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
  const Context = SupabaseContext as React.Context<SupabaseContextType<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  > | null>;

  const { children, ...clientProps } = props;

  const contextValue: SupabaseContextType<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  > = useMemo(() => {
    if ('client' in clientProps) {
      return { client: clientProps.client! };
    }

    const { supabaseUrl, supabaseKey, options } = clientProps;

    const client = createClient<
      Database,
      SchemaNameOrClientOptions,
      SchemaName
    >(supabaseUrl, supabaseKey, options);

    return { client };
  }, [clientProps]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default SupabaseProvider;
