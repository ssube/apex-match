import { Match, MatchOptions } from 'src/Match';
import { TypeMatch } from 'src/TypeMatch';
import { TypeName, Types } from 'src/Types';

/**
 * Asserts that a value is either completely `undefined` or matches the nested `Match`.
 */
export class OptionalMatch<TName extends TypeName, TValue extends Types[TName]> extends TypeMatch<TName> {
  protected nested: Match<TValue>;

  constructor(type: TName, nested: Match<TValue>) {
    super(type);

    this.nested = nested;
  }

  public match(value: any, options: MatchOptions): value is undefined | TValue {
    return value === undefined || this.nested.match(value, options);
  }

  public get required() {
    return false;
  }
}
