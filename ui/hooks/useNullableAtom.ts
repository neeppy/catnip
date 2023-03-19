import { PrimitiveAtom, useAtom } from 'jotai';

export default function useNullableAtom<T>(atom: PrimitiveAtom<T>) {
    const [value, setter] = useAtom(atom);

    if (value === null) {
        throw new TypeError("Atom is null, when it shouldn't.");
    }

    return [value, setter] as const;
};
