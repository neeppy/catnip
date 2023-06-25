declare global {
    type Concatenable = string | number;
    type Concat<TFirst, TSecond> = TFirst extends Concatenable ? TSecond extends Concatenable ? `${TFirst}${'' extends TSecond ? '' : '.'}${TSecond}` : never : never;

    type DeepKey<T> = T extends object ? {
        [Key in keyof T]-?: Key extends Concatenable ? `${Key}` | Concat<Key, DeepKey<T[Key]>> : never;
    }[keyof T] : '';

    type Leaves<T> = T extends object ? {
        [Key in keyof T]-?: Concat<Key, Leaves<T[Key]>>;
    }[keyof T] : '';

    type LeafType<TType extends Record<string, any>, TNestedKey extends string> =
        TNestedKey extends `${infer TCurrentKey}.${infer TNextKey}` ?
            LeafType<TType[TCurrentKey], TNextKey> :
            TType[TNestedKey];
}

export default null;
