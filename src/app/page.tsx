import Header from "@/components/Header";
import Time from "@/components/Time";
import Layout from "@/app/layout";
import Cat from "@/components/Cat";
import Technologies from "@/components/Technologies";
import CardComponent from "@/components/Card";
import Projects from "@/components/Projects";
import { BackgroundBeams } from "@/components/Background";
import { Footer } from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import About from "@/components/About";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Statistics from "@/components/Statistics";

export default function Home() {
	return (
		<Layout>
			<BackgroundBeams className="fixed inset-0 z-0" />
			<div className="flex-grow relative z-10">
				<Header />
				<Time />
				<CardComponent />
				<MusicPlayer />
				<Technologies />
				<About />
				<Statistics />
				<Projects />
				<Cat />
			</div>
			<Footer />
			<Analytics />
			<SpeedInsights />
		</Layout>
	);
}
