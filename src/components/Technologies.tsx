"use client";

import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Slider } from "../app/structure/Slider";
import { TextFade } from "../app/structure/TextFade";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInview } from "../lib/animateInscroll";
import { useLanguage } from "@/hooks/LanguageContext";
import { getTranslation } from "@/utils/translations";

export default function Technologies() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInview(ref);
	const { language } = useLanguage();

	const t = (key: string) => getTranslation(language, key);

	const technologies = [
		{
			href: "https://nextjs.org",
			icon: "simple-icons:nextdotjs",
			name: "Next.js",
		},
		{
			href: "https://astro.build",
			icon: "simple-icons:astro",
			name: "Astro",
		},
		{
			href: "https://www.typescriptlang.org",
			icon: "simple-icons:typescript",
			name: "TypeScript",
		},
		{
			href: "https://www.w3.org/Style/CSS/",
			icon: "simple-icons:css3",
			name: "CSS",
		},
		{
			href: "https://www.gnu.org/software/bash/",
			icon: "simple-icons:gnubash",
			name: "Bash",
		},
		{
			href: "https://www.python.org",
			icon: "simple-icons:python",
			name: "Python",
		},
		{
			href: "https://pnpm.io",
			icon: "simple-icons:pnpm",
			name: "pnpm",
		},
		{
			href: "https://www.kernel.org",
			icon: "teenyicons:linux-alt-solid",
			name: "Linux",
		},
		{
			href: "https://www.markdownguide.org",
			icon: "simple-icons:markdown",
			name: "Markdown",
		},
	];

	return (
		<div
			id="technologies"
			className="flex justify-center items-center mt-10"
			ref={ref}
		>
			<div className="flex flex-col items-center">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
					transition={{
						duration: 1.1,
						ease: [0.22, 0.03, 0.26, 1],
						opacity: { duration: 1.3 },
					}}
				>
					<TextFade
						fullLoadedDuration={1}
						duration={1}
						words={t("technologies.title")}
						className="text-2xl font-bold text-white/90"
						slideDirection="up"
						slideDistance={30}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 60 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
					transition={{
						duration: 1.2,
						ease: [0.22, 0.03, 0.26, 1],
						delay: 0.15,
						opacity: { duration: 1.4, delay: 0.15 },
					}}
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{
							duration: 0.8,
							ease: [0.22, 0.03, 0.26, 1],
							delay: 0.25,
						}}
					>
						<Card className="bg-black/5 relative mx-4 mt-3 w-auto max-w-4xl overflow-hidden backdrop-blur-[1px] py-0.5 border border-[#999a9e]/75 rounded-xl transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_rgba(35,32,32,15)] hover:border-opacity-60 slider-fade">
							<video
								className="absolute inset-0 w-full h-full object-cover opacity-35 scale-[1.25] -z-10"
								autoPlay
								loop
								muted
								playsInline
								preload="auto"
							>
								<source src="/assets/card.mp4" type="video/mp4" />
							</video>
							<CardBody className="overflow-visible px-0">
								<div
									className="pointer-events-none absolute inset-0"
									style={{ zIndex: 0 }}
								></div>
								<Slider>
									<div className="font-semibold flex justify-center gap-4 px-4 -mr-8">
										{technologies.map((tech) => (
											<a
												key={tech.name}
												href={tech.href}
												target="_blank"
												className="hover-effect shrink-0 transition-transform duration-500 ease-in-out"
											>
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{
														duration: 0.5,
														ease: "easeOut",
													}}
													className="border-[#aaabaf]/50 flex items-center gap-2 rounded-lg border px-3 py-2 whitespace-nowrap"
												>
													<Icon
														icon={tech.icon}
														className="h-6 w-6 text-[#b7b7b7]"
														aria-label={`${tech.name}`}
													/>
													<span className="text-gray-300">{tech.name}</span>
												</motion.div>
											</a>
										))}
									</div>
								</Slider>
							</CardBody>
						</Card>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
