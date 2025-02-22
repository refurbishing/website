"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Background() {
	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		setWindowWidth(window.innerWidth);

		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<motion.div
			className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<motion.div
				className="absolute inset-0 w-full h-full"
				style={{
					backgroundImage: "url('/assets/background.svg')",
					backgroundSize: windowWidth <= 1000 ? "250%" : "100%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					filter: "brightness(1.2)",
				}}
				animate={{
					scale: [1, 1.01, 1, 1.005, 1],
					y: ["0%", "1%", "-0.5%", "0.5%", "0%"],
					x: ["0%", "-0.5%", "0.5%", "-0.25%", "0%"],
				}}
				transition={{
					duration: 20,
					ease: "easeInOut",
					repeat: Infinity,
					repeatType: "mirror",
				}}
			/>
		</motion.div>
	);
}
