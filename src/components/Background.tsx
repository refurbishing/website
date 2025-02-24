"use client";
import React, { useState, useEffect } from "react";

export default function Background() {
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
					filter: "brightness(1.2)",
				}}
			/>
		</div>
	);
}
