import { isNil } from 'lodash';

import { Match, MatchError, MatchFields, MatchKey, MatchOptions } from 'src/Match';
import { TypeName } from 'src/Types';

/**
 * This is the usual runtime validator and type guard.
 */
export class ObjectMatch<T> extends Match<T> {
  protected fields: Map<MatchKey, Match<any>>;

  /**
   * Create a new schema with the provided fields and matchers.
   */
  constructor(fields: MatchFields<T>) {
    super();

    this.fields = new Map();
    for (const [key, value] of Object.entries(fields)) {
      if (!(value instanceof Match)) {
        throw new Error('object match fields must be matches');
      }
      this.fields.set(key, value);
    }
  }

  public field(name: keyof T): TypeName {
    if (this.fields.has(name)) {
      const result = this.fields.get(name);
      if (result) {
        return result.type;
      } else {
        return 'never'; // @todo: should this throw?
      }
    } else {
      return 'never';
    }
  }

  public get required() {
    return false;
  }

  public get size() {
    return this.fields.size;
  }

  public get type(): TypeName {
    return 'object';
  }

  public match(value: any, options: MatchOptions): value is T {
    if (typeof value !== 'object') {
      throw new Error('value must be an object');
    }

    let clean = true;
    const visited = new Set();
    const errorHandler = (error: MatchError) => {
      clean = false;
      if (options.errors) {
        options.errors(error);
      }
    };

    for (const [key, match] of this.fields.entries()) {
      const next = Reflect.get(value, key, value);
      visited.add(key);

      if (match.required) {
        if (isNil(next)) {
          errorHandler({
            match,
            msg: 'required is nil',
            path: [...options.path, key.toString()],
            value: next,
          });
        }

        if (!match.match(next, options)) {
          errorHandler({
            match,
            msg: 'required does not match',
            path: [...options.path, key.toString()],
            value: next,
          });
        }
      } else {
        if (!isNil(next) && !match.match(next, options)) {
          errorHandler({
            match,
            msg: 'optional does not match',
            path: [...options.path, key.toString()],
            value: next,
          });
        }
      }
    }

    // check for extra properties
    if (options.strict) {
      for (const key in value) {
        if (!visited.has(key)) {
          errorHandler({
            match: this,
            msg: 'additional field not allowed',
            path: [...options.path, key],
            value: value[key],
          });
        }
      }
    }

    return clean;
  }
}
