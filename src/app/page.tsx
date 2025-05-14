"use client";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Time from "@/components/Time";
import { SocketProvider } from "@/hooks/SocketContext";

const Cat = dynamic(() => import("@/components/Cat"));
const Technologies = dynamic(() => import("@/components/Technologies"));
const CardComponent = dynamic(() => import("@/components/Card"));
const Projects = dynamic(() => import("@/components/Projects"));
const Footer = dynamic(() => import("@/components/Footer"));
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"));
const About = dynamic(() => import("@/components/About"));
const Statistics = dynamic(() => import("@/components/Statistics"));
const Comissions = dynamic(() => import("@/components/Comissions"));
const TranslateGlobe = dynamic(() => import("@/components/Globe"));

export default function Home() {
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
			<Comissions />
			<Projects />
			<Footer />
			<Cat />
			<TranslateGlobe />

			<SpeedInsights />
			<Analytics />
		</>
	);
}
