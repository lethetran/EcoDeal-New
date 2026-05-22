// src/hooks/useWindowSize.js
import { useState, useEffect } from 'react';

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        
        // Gọi handleResize ngay lần đầu để có kích thước ban đầu
        handleResize();

        // Cleanup function để gỡ bỏ event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Mảng rỗng đảm bảo effect chỉ chạy 1 lần

    return windowSize;
}

export default useWindowSize;