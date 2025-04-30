"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Time from "@/components/Time";
import Loading from "@/app/loading";
import { SocketProvider } from "@/hooks/SocketContext";

const Cat = dynamic(() => import("@/components/Cat"), {
	loading: () => <Loading />
});
const Technologies = dynamic(() => import("@/components/Technologies"), {
	loading: () => <Loading />
});
const CardComponent = dynamic(() => import("@/components/Card"), {
	loading: () => <Loading />
});
const Projects = dynamic(() => import("@/components/Projects"), {
	loading: () => <Loading />
});
const Footer = dynamic(() => import("@/components/Footer"), {
	loading: () => <Loading />
});
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
	loading: () => <Loading />
});
const About = dynamic(() => import("@/components/About"), {
	loading: () => <Loading />
});
const Statistics = dynamic(() => import("@/components/Statistics"), {
	loading: () => <Loading />
});
const Comissions = dynamic(() => import("@/components/Comissions"), {
	loading: () => <Loading />
});
const TranslateGlobe = dynamic(() => import("@/components/Globe"), {
	loading: () => <Loading />
});

export default function Home() {
	return (
		<>
			<Background />
			<SocketProvider>
				<Header />
			</SocketProvider>

			<Time />

			<Suspense fallback={<Loading />}>
				<CardComponent />
			</Suspense>

			<Suspense fallback={<Loading />}>
				<MusicPlayer />
				<Technologies />
				<About />
				<Statistics />
				<Comissions />
				<Projects />
				<Footer />
				<Cat />
				<TranslateGlobe />
			</Suspense>

			<SpeedInsights />
			<Analytics />
		</>
	);
}
