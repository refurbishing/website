"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState, memo } from "react";

const BackgroundClient = memo(() => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = useCallback(() => {
        let timeoutId: NodeJS.Timeout;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 100);
        };
    }, []);

    useEffect(() => {
        const resizeListener = handleResize();
        window.addEventListener("resize", resizeListener);
        return () => window.removeEventListener("resize", resizeListener);
    }, [handleResize]);

    return (
        <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden animate-fadeIn">
            <div
                className="absolute inset-0 w-full h-full animate-float transition-colors will-change-transform"
                style={{
                    backgroundImage: "url('/assets/background.svg')",
                    backgroundSize: windowWidth <= 1000 ? "250%" : "100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(1.2)",
                }}
            />
        </div>
    );
});

BackgroundClient.displayName = "BackgroundClient";

export default dynamic(() => Promise.resolve(BackgroundClient), {
    ssr: false,
});
