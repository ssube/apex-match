import { isBoolean, isNumber, isString } from 'lodash';

import { Match, MatchOptions } from 'src/Match';
import { typeConstructors, TypeName, Types } from 'src/Types';

/**
 * Runtime helper for the type system.
 */
export class TypeMatch<TName extends TypeName, TType = Types[TName]> implements Match<Types[TName]> {
  public readonly type: TName;

  constructor(type: TName) {
    this.type = type;
  }

  public field(name: keyof TType): TName {
    return this.type;
  }

  public match(value: any, options: MatchOptions): value is Types[TName] {
    const constructor = typeConstructors[this.type];

    if (this.type === 'boolean') {
      return isBoolean(value);
    } else if (this.type === 'decimal' || this.type === 'integer') {
      return isNumber(value);
    } else if (this.type === 'string') {
      return isString(value);
    } else {
      return (value instanceof constructor);
    }
  }

  public get required() {
    return true;
  }
}
