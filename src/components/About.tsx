"use client";
import { Card, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Code } from "lucide-react";
import { TextFade } from "../app/structure/TextFade";
import { useInview } from "../lib/animateInscroll";
import { useLanguage } from "@/hooks/LanguageContext";
import { getTranslation } from "@/utils/translations";

export default function About() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInview(ref);
	const { language } = useLanguage();
	const t = (key: string) => getTranslation(language, key);

	return (
		<div
			id="about"
			className="mt-10 flex justify-center items-center"
			ref={ref}
		>
			<div className="flex flex-col items-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
				>
					<TextFade
						fullLoadedDuration={1.9}
						duration={1.85}
						words={t("aboutMe.title")}
						className="text-2xl font-bold text-white/90"
						slideDirection="up"
						slideDistance={25}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
				>
					<Card className="backdrop-blur-[1.5px] bg-black/5 mt-4 mx-auto py-4 w-[95%] min-w-[320px] max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 sm:px-6 border border-[#999a9e]/75 rounded-xl relative z-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(35,32,32,15)] hover:border-opacity-60 hover:backdrop-blur-none will-change-transform overflow-hidden origin-center">
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-35 -z-10"
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
						>
							<source src="/assets/card.mp4" type="video/mp4" />
						</video>
						<div className="relative z-10">
							<CardHeader className="flex flex-col sm:flex-row items-center gap-4">
								<motion.div
									whileHover={{
										scale: 1.03,
										boxShadow: "0 0 2px rgba(255, 255, 255, 0.08)",
									}}
									whileTap={{ scale: 0.98 }}
									transition={{
										type: "tween",
										ease: [0.4, 0, 0.2, 1],
										duration: 0.3,
									}}
									className="text-white text-sm flex-[1.5] bg-gradient-to-br from-white/[0.03] via-white/[0.003] to-transparent backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg border border-white/[0.02]"
								>
									{t("aboutMe.description")}
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 40 }}
									animate={isInView ? { opacity: 1, y: 0 } : {}}
									transition={{
										duration: 0.7,
										ease: [0.25, 0.1, 0.25, 1],
										delay: 0.2,
									}}
								>
									<div className="block sm:hidden w-56 h-[1px] my-4 mx-auto bg-gradient-to-r from-transparent via-[#dbdbdb]/40 to-transparent opacity-40 relative">
										<div className="absolute w-16 h-[3px] bg-white/20 blur-sm -top-[1px]" />
										<div className="absolute w-16 h-[3px] bg-white/20 blur-sm -top-[1px] right-0" />
									</div>
									<div className="hidden sm:block w-auto h-28 my-2 justify-center sm:ml-8">
										<div className="h-full w-[1px] bg-gradient-to-b from-transparent via-[#dbdbdb]/40 to-transparent opacity-40 relative">
											<div className="absolute h-8 w-[3px] bg-white/20 blur-sm -left-[1px]" />
											<div className="absolute h-8 w-[3px] bg-white/20 blur-sm -left-[1px] bottom-0" />
										</div>
									</div>
								</motion.div>
								<div className="flex-1 sm:ml-8 text-center sm:text-left">
									<motion.div
										whileHover={{
											scale: 1.03,
											boxShadow: "0 0 2px rgba(255, 255, 255, 0.08)",
										}}
										whileTap={{ scale: 0.98 }}
										transition={{
											type: "tween",
											ease: [0.4, 0, 0.2, 1],
											duration: 0.3,
										}}
										className="text-white text-xs flex-[1.5] bg-gradient-to-br from-white/[0.03] via-white/[0.003] to-transparent backdrop-blur-sm px-3 py-1 rounded-xl shadow-lg border border-white/[0.02]"
									>
										{t("aboutMe.currentFocus")}
									</motion.div>
									<motion.div
										whileHover={{
											scale: 1.03,
											boxShadow: "0 0 2px rgba(255, 255, 255, 0.08)",
										}}
										whileTap={{ scale: 0.98 }}
										className="flex items-center justify-center sm:justify-start gap-1.5 bg-white/[0.03] w-fit px-2.5 py-1 rounded-md mt-3 mx-auto sm:mx-0 border border-white/[0.03] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent backdrop-blur-sm"
									>
										<div className="bg-white/[0.06] p-0.5 rounded-md border border-white/[0.03]">
											<Code className="w-3.5 h-3.5 text-white/80" />
										</div>
										<span className="text-white/80 text-xs">
											{t("aboutMe.experience")}
										</span>
									</motion.div>
								</div>
							</CardHeader>
						</div>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
