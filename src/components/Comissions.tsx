"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useInview } from "@/lib/animateInscroll";
import { TextFade } from "../app/structure/TextFade";
import {
	Paintbrush,
	Globe,
	Laptop,
	DollarSign,
	Coffee,
	BugOff,
	MousePointer2,
	GitFork,
} from "lucide-react";
import { useLanguage } from "@/hooks/LanguageContext";
import { getTranslation } from "@/utils/translations";

export default function Comissions() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInview(ref);
	const { language } = useLanguage();

	const t = (key: string) => getTranslation(language, key);

	return (
		<div
			id="commissions"
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
						words={t("commissions")}
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
								<div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
									<div className="flex items-center justify-center">
										<motion.div
											whileTap={{ scale: 0.8, rotate: -30 }}
											className="relative mr-2 sm:mr-6 sm:mt-1"
										>
											<BugOff className="w-6 h-6 sm:w-5 sm:h-5 text-white/70 transform -rotate-12 transition-transform duration-300 hover:scale-125 hover:rotate-[20deg]" />
										</motion.div>
										<div className="relative flex items-center">
											<motion.div
												whileTap={{ scale: 0.9, rotate: 15 }}
												className="relative"
											>
												<Globe className="w-12 h-12 sm:w-16 sm:h-16 text-white/80 sm:-mb-1 sm:-ml-1 transition-transform duration-300 hover:scale-110 hover:rotate-6" />
											</motion.div>
											<motion.div
												whileTap={{ scale: 0.8, rotate: -20 }}
												className="hidden sm:block absolute sm:bottom-[-22px] sm:right-[-26px]"
											>
												<GitFork className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 transform rotate-6 transition-transform duration-300 hover:scale-125 hover:rotate-[15deg]" />
											</motion.div>
										</div>
									</div>
									<motion.div
										whileTap={{ scale: 0.8, rotate: -20 }}
										className="block sm:hidden"
									>
										<GitFork className="w-5 h-5 text-white/70 transform rotate-6 transition-transform duration-300 hover:scale-125 hover:rotate-[15deg]" />
									</motion.div>
									<motion.div
										whileTap={{ scale: 0.8, rotate: -15 }}
										className="sm:-ml-2 sm:mx-0"
									>
										<Laptop className="w-9 h-9 sm:w-10 sm:h-10 text-white/80 transition-transform duration-300 hover:scale-110 hover:-rotate-6" />
									</motion.div>
									<div className="flex items-center sm:block sm:pl-8 sm:-mt-4 relative">
										<motion.div whileTap={{ scale: 0.9, rotate: 10 }}>
											<Paintbrush className="w-12 h-12 sm:w-14 sm:h-14 text-white/80 transition-transform duration-300 hover:scale-110 hover:rotate-3" />
										</motion.div>
										<motion.div
											whileTap={{ scale: 0.7, rotate: 30 }}
											className="relative sm:absolute ml-1 sm:ml-0 sm:-bottom-1 sm:-left-2"
										>
											<Coffee className="w-7 h-7 sm:w-5 sm:h-5 text-white/70 transform rotate-12 transition-transform duration-300 hover:scale-125 hover:rotate-[20deg]" />
										</motion.div>
										<motion.div
											whileTap={{ scale: 0.8, rotate: -20 }}
											className="hidden sm:block absolute sm:top-6 sm:-right-14 sm:translate-y-0"
										>
											<MousePointer2 className="w-6 h-6 text-white/70 transform -rotate-12 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
										</motion.div>
									</div>
								</div>

								<motion.div
									whileTap={{ scale: 0.8, rotate: -20 }}
									className="block sm:hidden -mt-2"
								>
									<MousePointer2 className="w-6 h-6 text-white/70 transform -rotate-12 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
								</motion.div>

								<div className="flex flex-col items-center">
									<div className="block sm:hidden w-56 h-[1px] my-2 mx-auto bg-gradient-to-r from-transparent via-[#dbdbdb] to-transparent opacity-50 relative">
										<div className="absolute w-16 h-[3px] bg-white/20 blur-sm -top-[1px]" />
										<div className="absolute w-16 h-[3px] bg-white/20 blur-sm -top-[1px] right-0" />
									</div>
									<div className="hidden sm:block w-auto h-32 my-2 justify-center sm:ml-12">
										<div className="h-full w-[1px] bg-gradient-to-b from-transparent via-[#dbdbdb] to-transparent opacity-50 relative rotate-[-25deg]">
											<div className="absolute h-8 w-[3px] bg-white/20 blur-sm -left-[1px]" />
											<div className="absolute h-8 w-[3px] bg-white/20 blur-sm -left-[1px] bottom-0" />
										</div>
									</div>
								</div>
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
										className="text-white text-sm flex-[1.5] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent backdrop-blur-sm px-3 py-1 rounded-xl shadow-lg border border-white/[0.02]"
									>
										{t("commissionsText.openFor")}
									</motion.div>

									<motion.div
										whileHover={{
											scale: 1.03,
											boxShadow: "0 0 2px rgba(255, 255, 255, 0.08)",
										}}
										whileTap={{ scale: 0.98 }}
										className="flex items-center justify-center sm:justify-end gap-1.5 bg-white/[0.03] w-fit px-2.5 py-1 rounded-md mt-3 mx-auto sm:ml-auto border border-white/[0.03] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent backdrop-blur-sm"
									>
										<div className="bg-white/[0.06] p-0.5 rounded-md border border-white/[0.03]">
											<DollarSign className="w-3.5 h-3.5 text-white/80" />
										</div>
										<span className="text-white/80 text-xs">
											{t("commissionsText.affordableServices")}
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
