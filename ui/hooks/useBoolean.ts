import { useState } from 'react';

export function useBoolean(defaultValue = false) {
    const [boolean, setBoolean] = useState(defaultValue);

    function toggle() {
        setBoolean(!boolean);
    }

    function on() {
        setBoolean(true);
    }

    function off() {
        setBoolean(false);
    }

    return { boolean, toggle, on, off };
}
