// src/hooks/useCountdown.js
import { useState, useEffect } from 'react';

const useCountdown = (initialSeconds) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const intervalId = setInterval(() => {
            setSecondsLeft(secondsLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const reset = () => setSecondsLeft(initialSeconds);

    return {
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isExpired: secondsLeft === 0,
        reset,
    };
};

export default useCountdown;