import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timer to update the value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // clear the timer if the value changes before the delay hits
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;