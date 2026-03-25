import {
  SupabaseClient,
  type SupabaseClientOptions,
} from '@supabase/supabase-js';
import type { PropsWithChildren } from 'react';

export type SchemaKeys<Database> = string &
  keyof Omit<Database, '__InternalSupabase'>;

export type SchemaNameOrClientOptionsConstraint<Database> =
  | SchemaKeys<Database>
  | { PostgrestVersion: string };

export type DefaultSchemaNameOrClientOptions<Database> =
  'public' extends keyof Omit<Database, '__InternalSupabase'>
    ? 'public'
    : SchemaKeys<Database>;

export type DefaultSchemaName<Database, SchemaNameOrClientOptions> =
  SchemaNameOrClientOptions extends SchemaKeys<Database>
    ? SchemaNameOrClientOptions
    : 'public' extends keyof Omit<Database, '__InternalSupabase'>
    ? 'public'
    : SchemaKeys<Omit<Database, '__InternalSupabase'>>;

export interface ClientProps<
  Database,
  SchemaNameOrClientOptions extends SchemaNameOrClientOptionsConstraint<Database>,
  SchemaName extends SchemaKeys<Database>
> {
  client: SupabaseClient<Database, SchemaNameOrClientOptions, SchemaName>;
  supabaseUrl?: never;
  supabaseKey?: never;
  options?: never;
}

export interface ClientConfigProps<SchemaName extends string> {
  client?: never;
  supabaseUrl: string;
  supabaseKey: string;
  options?: SupabaseClientOptions<SchemaName>;
}

export type SupabaseProviderProps<
  Database = any,
  SchemaNameOrClientOptions extends SchemaNameOrClientOptionsConstraint<Database> = DefaultSchemaNameOrClientOptions<Database>,
  SchemaName extends SchemaKeys<Database> = DefaultSchemaName<
    Database,
    SchemaNameOrClientOptions
  >
> = PropsWithChildren<
  | ClientProps<Database, SchemaNameOrClientOptions, SchemaName>
  | ClientConfigProps<SchemaName>
>;
