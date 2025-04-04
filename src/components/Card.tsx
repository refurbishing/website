"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";
import { Icon, loadIcon } from "@iconify/react";
import { getTranslatedQuotes, quotes } from "@/data/quotes";
import Image from "next/image";
import { useInview } from "@/lib/animateInscroll";
import { useLanguage } from "@/hooks/LanguageContext";
import { getTranslation } from "@/utils/translations";

export default function CardComponent() {
	const cardRef = useRef(null);
	const isInView = useInview(cardRef);
	const [iconsLoaded, setIconsLoaded] = useState(false);
	const { language } = useLanguage();

	const age = useMemo(() => {
		const birthDate = new Date("2009-08-29");
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}

		return age;
	}, []);

	const socialLinks = useMemo(
		() => [
			{
				href: "https://t.me/backdropped",
				icon: "mdi:telegram",
				alt: "Telegram",
			},
			{
				href: "https://github.com/refurbishing",
				icon: "mdi:github",
				alt: "GitHub",
			},
			{
				href: "https://steamcommunity.com/id/webassembly",
				icon: "mdi:steam",
				alt: "Steam",
			},
			{
				href: "https://stats.fm/maduro",
				icon: "/assets/statsfm.png",
				alt: "stats.fm",
			},
			{
				href: "https://ko-fi.com/authenticators",
				icon: "famicons:cash",
				alt: "Ko-fi",
			},
		],
		[],
	);

	useEffect(() => {
		const typewriterElement = document.getElementById("typewriter");
		if (!typewriterElement) return;

		const typewriter = new Typewriter("#typewriter", {
			cursor: "|",
			delay: 50,
			loop: true,
		});

		const translatedQuotes = getTranslatedQuotes(language);

		translatedQuotes
			.reduce(
				(tw: Typewriter, quote: string) =>
					tw.typeString(quote).pauseFor(1250).deleteAll(),
				typewriter,
			)
			.start();

		const loadIcons = async () => {
			try {
				await Promise.all(
					socialLinks
						.filter((link) => !link.icon.startsWith("/"))
						.map((link) => loadIcon(link.icon)),
				);
				setIconsLoaded(true);
			} catch (error) {
				console.error("Failed to load card icons:", error);
				setIconsLoaded(true);
			}
		};

		loadIcons();
	}, [socialLinks, language]);

	return (
		<motion.div
			ref={cardRef}
			initial={{ opacity: 0, y: 50, scale: 0.98, rotateX: -10 }}
			animate={
				isInView
					? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
					: { opacity: 0, y: 50, scale: 0.98, rotateX: -10 }
			}
			transition={{
				duration: 0.7,
				ease: [0.2, 0.8, 0.2, 1],
				opacity: { duration: 0.9, ease: [0.1, 0.3, 0.8, 1] },
				y: { duration: 0.6 },
				scale: { duration: 0.7 },
				rotateX: { duration: 0.8 },
			}}
		>
			<Card className="card-background bg-black/25 mt-4 mx-auto py-4 w-[95%] min-w-[320px] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-2xl xl:max-w-3xl px-4 sm:px-6 border border-[#999a9e]/75 rounded-xl relative z-0 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(35,32,32,15)] hover:border-opacity-60 hover:scale-[1.01]">
				<video autoPlay loop muted playsInline disablePictureInPicture>
					<source src="/assets/banner.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<CardHeader className="pb-2">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white overflow-hidden">
						{[
							getTranslation(language, "card.intro"),
							`${age} ${getTranslation(language, "card.yearOld")}`,
							getTranslation(language, "card.developer"),
							getTranslation(language, "card.country"),
						].map((text, index) => (
							<div key={index} className="relative inline-block">
								<motion.span
									className={`inline-block relative mr-[0.25em]`}
									initial={{ y: "100%", opacity: 0, filter: "blur(2.5px)" }}
									animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
									transition={{
										duration: 1.4,
										delay: index * 0.2,
										ease: [0.2, 0.8, 0.2, 1],
										filter: {
											duration: 1.2,
											delay: index * 0.15,
											ease: [0.4, 0, 0.2, 1],
										},
									}}
								>
									<motion.span
										className="inline-block bg-gradient-to-r bg-clip-text text-transparent"
										initial={{
											backgroundPosition: "-100%",
											opacity: 0.5,
											backgroundImage:
												index === 0 || index === 2
													? "linear-gradient(to right, rgb(229, 231, 235), rgb(209, 213, 219), rgb(229, 231, 235))"
													: "linear-gradient(to right, rgb(161, 161, 170), rgb(212, 212, 216), rgb(161, 161, 170))",
										}}
										animate={{
											backgroundPosition: "200%",
											opacity: 1,
											backgroundImage:
												index === 1
													? "linear-gradient(to top,rgb(169, 110, 225),rgb(193, 119, 220))"
													: index === 3
														? "linear-gradient(to right, rgba(84, 215, 255, 0.8), rgba(183, 231, 247, 0.8), rgba(84, 215, 255, 0.8))"
														: "linear-gradient(to right, rgb(229, 231, 235), rgb(209, 213, 219), rgb(229, 231, 235))",
										}}
										transition={{
											duration: 2.5,
											delay: index * 0.25 + 0.5,
											ease: "linear",
											repeat: Infinity,
											repeatDelay: 3.5,
											times: [0, 1],
											opacity: {
												duration: 0.6,
												ease: "circOut",
											},
											backgroundImage: {
												delay: index * 0.25 + 0.5,
												duration: 1.2,
												ease: [0.22, 1, 0.36, 1],
											},
										}}
									>
										{text}
									</motion.span>
								</motion.span>

								<motion.div
									className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent"
									initial={{ scaleX: 0, opacity: 0 }}
									animate={{
										scaleX: 1,
										opacity: [0, 1, 1, 0],
									}}
									transition={{
										duration: 1.4,
										delay: index * 0.2,
										ease: [0.2, 0.8, 0.2, 1],
										opacity: {
											times: [0, 0.3, 0.7, 1],
										},
									}}
								/>
							</div>
						))}
					</h1>
				</CardHeader>
				<CardBody>
					<p className="font-normal text-gray-200 dark:text-gray-300 leading-tight text-sm sm:text-base">
						<span id="typewriter"></span>
					</p>
					<div className="mr-2 flex justify-end mt-4">
						{iconsLoaded &&
							socialLinks.map((link, i) => (
								<motion.a
									key={link.icon}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									initial={{ y: -20, opacity: 0 }}
									whileHover={{
										scale: 1.03,
										transition: {
											duration: 0.3,
											ease: "easeOut",
										},
									}}
									whileTap={{
										scale: 0.97,
										transition: {
											duration: 0.2,
										},
									}}
									animate={{
										y: 0,
										opacity: 1,
										transition: {
											type: "spring",
											stiffness: 100,
											damping: 15,
											delay: 0.5 + i * 0.1,
										},
									}}
									className="border p-1 rounded-md border-[#999a9e]/45 hover:bg-[#1a1a1a]/60 mr-2 last:mr-0 cursor-pointer will-change-transform group"
								>
									{link.icon.startsWith("/") ? (
										<Image
											src={link.icon}
											alt={link.alt}
											width={24}
											height={24}
											className="w-6 h-6 sm:w-7 sm:h-7 text-[#b7b7b7] transition-transform duration-300 non-selectable group-hover:scale-105"
										/>
									) : (
										<Icon
											icon={link.icon}
											className="text-[#b7b7b7] text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-105"
											aria-label={link.alt}
										/>
									)}
								</motion.a>
							))}
					</div>
				</CardBody>
			</Card>
		</motion.div>
	);
}
