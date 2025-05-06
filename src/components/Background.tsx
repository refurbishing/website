"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { StarsBackground } from "./ui/stars";
import { Star } from "lucide-react";

const BackgroundClient = () => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden animate-fadeIn">
			<div
				className="absolute inset-0 w-full h-full animate-float transition-colors"
				style={{
					backgroundImage: "url('/assets/background.svg')",
					backgroundSize: windowWidth <= 1000 ? "250%" : "100%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					filter: "brightness(1.4)",
				}}
			/>
			
			<div className="absolute inset-0 w-full h-full">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,220,220,0.03)_0%,rgba(0,0,0,0.35)_80%)]" />
				<StarsBackground
					allStarsTwinkle={true}
					minTwinkleSpeed={0.5}
					maxTwinkleSpeed={1.2}
					className="opacity-90"
				/>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(BackgroundClient), {
	ssr: false,
});
