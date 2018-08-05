import { Match, MatchOptions } from 'src/Match';
import { TypeMatch } from 'src/TypeMatch';
import { CollectionName, Collections } from 'src/Types';

export class CollectionMatch<
  TOuterName extends CollectionName<TValue>,
  TOuter extends Collections<TValue>[TOuterName],
  TValue
> extends TypeMatch<TOuterName> {
  public readonly value: Match<TValue>;

  constructor(type: TOuterName, value: Match<TValue>) {
    super(type);
    this.value = value;
  }

  public match(value: any, options: MatchOptions): value is TOuter {
    if (this.type === 'list') {
      if (Array.isArray(value)) {
        return value.every((item) => this.value.match(item, options));
      }
    } else if (this.type === 'map') {
      if (value instanceof Map) {
        return Array.from(value.values()).every((item) => this.value.match(item, options));
      }
    } else if (this.type === 'set') {
      if (value instanceof Set) {
        return Array.from(value.values()).every((item) => this.value.match(item, options));
      }
    }

    return false;
  }
}
