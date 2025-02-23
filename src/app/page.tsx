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
			<Projects />
			<Cat />
			<Footer />
			<Analytics />
			<SpeedInsights />
		</>
	);
}
