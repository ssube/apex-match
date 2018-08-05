export interface Collections<T> {
  list: Array<T>;
  map: Map<string, T>;
  set: Set<T>;
}

export type CollectionName<T> = keyof Collections<T>;

export interface Types extends Collections<any> {
  object: any;
  never: never;
  // primitive
  boolean: boolean;
  decimal: number;
  integer: number;
  string: string;
  // utility
  error: Error;
}

/**
 * If you just want a string literal that must be a valid type, use this.
 */
export type TypeName = keyof Types;

/**
 * This is a map of all type names to their base class constructor. This is used for schema and validation.
 *
 * The index type here ensures that keys match `Types` above.
 * @todo: find a good way to express never
 */
export const typeConstructors: {[key in keyof Types]: Function} = {
  boolean: Boolean,
  decimal: Number,
  error: Error,
  integer: Number,
  list: Array,
  map: Map,
  never: Symbol,
  object: Object,
  set: Set,
  string: String,
};
