"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState, memo } from "react";
import { StarsBackground } from "./ui/stars";
import { Star } from "lucide-react";

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
          filter: "brightness(1.4)",
        }}
      />
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,220,220,0.03)_0%,rgba(0,0,0,0.35)_80%)] animate-maskReveal origin-center" />
        <StarsBackground
          allStarsTwinkle={true}
          minTwinkleSpeed={0.5}
          maxTwinkleSpeed={1.2}
          className="opacity-90"
        />
      </div>
    </div>
  );
});

BackgroundClient.displayName = "BackgroundClient";

export default dynamic(() => Promise.resolve(BackgroundClient), {
  ssr: false,
});