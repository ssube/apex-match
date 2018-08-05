import { MatchOptions } from 'src/Match';
import { TypeMatch } from 'src/TypeMatch';
import { TypeName, Types } from 'src/Types';

export class ValueMatch<TName extends TypeName, TValue extends Types[TName]> extends TypeMatch<TName> {
  public readonly value: TValue;

  constructor(type: TName, value: TValue) {
    super(type);

    this.value = value;
  }

  public match(value: any, options: MatchOptions): value is TValue {
    return super.match(value, options) && value === this.value;
  }
}
