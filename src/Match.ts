import { TypeName, Types } from 'src/Types';

export interface MatchError {
  match: Match<any>;
  msg: string;
  path: Array<string>;
  value: any;
}

export type MatchErrorCallback = (error: MatchError) => void;

export interface MatchOptions {
  errors: MatchErrorCallback;
  strict: boolean;
}

export abstract class Match<TType> {
  public readonly required: boolean;
  public readonly type: TypeName;

  public abstract field(name: keyof TType): TypeName;
  public abstract match(value: any, options: MatchOptions): value is TType;
}

/**
 * This enforces recursive type safety in the schema constructor, ensuring each key is a match or a nested schema.
 */
export type MatchFields<T> = {
  [key in keyof T]: Match<T[key]>;
};

export type MatchKey = number | string | symbol;
