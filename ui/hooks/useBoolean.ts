import { useState } from 'react';

export default function useBoolean(defaultValue = false) {
    const [boolean, setBoolean] = useState(defaultValue);

    function toggle(value?: boolean) {
        setBoolean(value ?? !boolean);
    }

    function on() {
        setBoolean(true);
    }

    function off() {
        setBoolean(false);
    }

    return { boolean, toggle, on, off };
}
