import { createClient } from '@supabase/supabase-js';
import { type Context, useMemo } from 'react';

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
  const Context = SupabaseContext as Context<SupabaseContextType<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  > | null>;

  const {
    children,
    client: externalClient,
    supabaseUrl,
    supabaseKey,
    options,
  } = props;

  const contextValue: SupabaseContextType<
    Database,
    SchemaNameOrClientOptions,
    SchemaName
  > = useMemo(() => {
    if (externalClient != null) {
      return { client: externalClient };
    }

    const client = createClient<
      Database,
      SchemaNameOrClientOptions,
      SchemaName
    >(supabaseUrl, supabaseKey, options);

    return { client };
  }, [externalClient, supabaseUrl, supabaseKey, options]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default SupabaseProvider;
