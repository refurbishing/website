"use client";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Time from "@/components/Time";
import Cat from "@/components/Cat";
import Technologies from "@/components/Technologies";
import CardComponent from "@/components/Card";
import Projects from "@/components/Projects";
import { Footer } from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import About from "@/components/About";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Statistics from "@/components/Statistics";
import { SocketProvider } from "@/hooks/SocketContext";
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function Home() {
	const lenisRef = useRef<Lenis | null>(null);

	useEffect(() => {
		lenisRef.current = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 1,
		});

		function raf(time: number) {
			lenisRef.current?.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenisRef.current?.destroy();
		};
	}, []);

	return (
		<>
			<Background />
			<SocketProvider>
				<Header />
			</SocketProvider>
			<Time />
			<CardComponent />
			<MusicPlayer />
			<Technologies />
			<About />
			<Statistics />
			<Projects />
			<Cat />
			<Footer />
			<Analytics />
			<SpeedInsights />
		</>
	);
}
