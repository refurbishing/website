"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import UserArea from "./DiscordPresence";
import Weather from "./Weather";
import { useLanguage } from "@/hooks/LanguageContext";
import { getTranslation } from "@/utils/translations";

export default function Header() {
	const [hamburgerTriggered, setHamburgerTriggered] = useState(false);
	const { status } = useSocket();
	const [showUserArea, setShowUserArea] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);
	const { language } = useLanguage();

	const statusColor = {
		online: {
			normal:
				"bg-green-500 shadow-[0_0_3px_rgba(34,197,94,0.2),_0_0_5px_rgba(34,197,94,0.12),_0_0_8px_rgba(34,197,94,0.05)]",
			hover:
				"hover:bg-green-400 hover:shadow-[0_0_5px_rgba(34,197,94,0.3),_0_0_8px_rgba(34,197,94,0.2),_0_0_12px_rgba(34,197,94,0.1)]",
		},
		dnd: {
			normal:
				"bg-red-500 shadow-[0_0_3px_rgba(239,68,68,0.2),_0_0_5px_rgba(239,68,68,0.12),_0_0_8px_rgba(239,68,68,0.05)]",
			hover:
				"hover:bg-red-400 hover:shadow-[0_0_5px_rgba(239,68,68,0.3),_0_0_8px_rgba(239,68,68,0.2),_0_0_12px_rgba(239,68,68,0.1)]",
		},
		idle: {
			normal:
				"bg-yellow-500 shadow-[0_0_3px_rgba(234,179,8,0.2),_0_0_5px_rgba(234,179,8,0.12),_0_0_8px_rgba(234,179,8,0.05)]",
			hover:
				"hover:bg-yellow-400 hover:shadow-[0_0_5px_rgba(234,179,8,0.3),_0_0_8px_rgba(234,179,8,0.2),_0_0_12px_rgba(234,179,8,0.1)]",
		},
		offline: {
			normal:
				"bg-gray-500 shadow-[0_0_3px_rgba(107,114,128,0.2),_0_0_5px_rgba(107,114,128,0.12),_0_0_8px_rgba(107,114,128,0.05)]",
			hover:
				"hover:bg-gray-400 hover:shadow-[0_0_5px_rgba(107,114,128,0.3),_0_0_8px_rgba(107,114,128,0.2),_0_0_12px_rgba(107,114,128,0.1)]",
		},
	} as const;

	const statusClass =
		status in statusColor
			? `${statusColor[status as keyof typeof statusColor].normal} ${statusColor[status as keyof typeof statusColor].hover} transition-all duration-300`
			: `${statusColor.offline.normal} ${statusColor.offline.hover} transition-all duration-300`;

	const t = (key: string) => getTranslation(language, key);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024);
			if (window.innerWidth >= 1100) {
				setHamburgerTriggered(false);
			}
		};
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 50;
			setScrolled(isScrolled);
		};
		handleScroll();

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		document.documentElement.style.scrollBehavior = "xsmooth";

		return () => {
			document.documentElement.style.scrollBehavior = "auto";
		};
	}, []);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	let isScrolling = false;
	function smoothScrollTo(targetY: number, duration: number) {
		if (isScrolling) return;

		isScrolling = true;
		const startY = window.scrollY;
		const distance = targetY - startY;
		let startTime: number | null = null;

		function animation(currentTime: number) {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);
			const ease = easeInOutQuad(progress);
			window.scrollTo(0, startY + distance * ease);

			if (timeElapsed < duration) {
				requestAnimationFrame(animation);
			} else {
				isScrolling = false;
			}
		}

		function easeInOutQuad(t: number) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		}

		requestAnimationFrame(animation);
	}

	return (
		<div>
			<div className="h-20" />

			<AnimatePresence>
				{hamburgerTriggered && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-200"
						onClick={() => setHamburgerTriggered(false)}
					></motion.div>
				)}
			</AnimatePresence>

			<motion.div
				initial={{ y: -100, scale: 0.98 }}
				animate={{
					y: 0,
					scale: 1,
					marginLeft: scrolled && isDesktop ? "8.5rem" : "5rem",
					marginRight: scrolled && isDesktop ? "8.5rem" : "5rem",
				}}
				transition={{
					y: { type: "spring", stiffness: 180, damping: 30, mass: 0.8 },
					scale: { type: "spring", stiffness: 180, damping: 30, mass: 0.8 },
					marginLeft: { type: "spring", stiffness: 150, damping: 35, mass: 1 },
					marginRight: { type: "spring", stiffness: 150, damping: 35, mass: 1 },
				}}
				className={`fixed top-0 left-0 right-0 mt-4 bg-dark/85 text-white border border-[#999a9e]/30 backdrop-blur-[5px] rounded-2xl shadow-md non-selectable relative z-50`}
				style={{ position: "fixed", top: 0, left: 0, right: 0 }}
				onMouseMove={handleMouseMove}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div
					className="absolute pointer-events-none"
					style={
						{
							background:
								"radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.04), transparent 25%)",
							border: "1px solid transparent",
							borderImage:
								"radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15), transparent 25%) 1",
							inset: "-1px",
							borderRadius: "16px",
							WebkitMask:
								"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
							opacity: isHovered && isDesktop ? 1 : 0,
							transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							"--mouse-x": `${mousePosition.x}px`,
							"--mouse-y": `${mousePosition.y}px`,
						} as React.CSSProperties
					}
				/>
				<div className="p-3.5 px-4 non-selectable">
					<div className="flex justify-between items-center non-selectable">
						<div className="flex items-center gap-2 non-selectable min-w-fit xsm:w-1/4">
							<div
								className="flex items-center gap-2 cursor-pointer group"
								onClick={() => setShowUserArea(!showUserArea)}
							>
								<h1 className="text-xl font-bold transition-all duration-300 non-selectable relative">
									<span className="inline-block bg-gradient-to-r from-[rgba(240,237,255,0.7)] via-white to-[rgba(240,237,255,0.7)] bg-clip-text text-transparent bg-[length:200%] animate-gradient transition-all duration-300 tracking-[0.25px]">
										Cortex
									</span>
								</h1>
								<div
									className={`w-2 h-2 rounded-full ${statusClass} non-selectable ml-0.5`}
								></div>
							</div>
						</div>

						<div className="flex-grow flex justify-center zsm:w-2/4">
							<div className="pl-4 zsm:pl-8 xsm:pl-0 xsm:mx-auto w-full flex justify-center items-center">
								<div className="w-full max-w-[250px] flex justify-center">
									<Weather />
								</div>
							</div>
						</div>

						<div className="flex items-center w-1/4 justify-end">
							<button
								className="lg:hidden flex items-center justify-center non-selectable"
								onClick={() => setHamburgerTriggered(!hamburgerTriggered)}
								aria-label="Toggle menu"
							>
								<div className="relative w-8 h-8 flex items-center justify-center">
									<motion.span
										className="absolute h-0.5 bg-white rounded-full"
										initial={false}
										animate={{
											rotate: hamburgerTriggered ? 45 : 0,
											y: hamburgerTriggered ? 0 : -8,
											width: hamburgerTriggered ? "20px" : "24px",
										}}
										transition={{ duration: 0.2, ease: "easeInOut" }}
									/>
									<motion.span
										className="absolute w-6 h-0.5 bg-white rounded-full"
										initial={false}
										animate={{
											opacity: hamburgerTriggered ? 0 : 1,
											scale: hamburgerTriggered ? 0 : 1,
										}}
										transition={{ duration: 0.1, ease: "easeInOut" }}
									/>
									<motion.span
										className="absolute h-0.5 bg-white rounded-full"
										initial={false}
										animate={{
											rotate: hamburgerTriggered ? -45 : 0,
											y: hamburgerTriggered ? 0 : 8,
											width: hamburgerTriggered ? "20px" : "24px",
										}}
										transition={{ duration: 0.2, ease: "easeInOut" }}
									/>
								</div>
							</button>
							<nav className="hidden lg:flex gap-2.5 items-center non-selectable">
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										smoothScrollTo(0, 650);
										setHamburgerTriggered(false);
									}}
									className="nav-link text-white/80 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]non-selectable"
								>
									{t("home")}
								</a>
								<a
									href="#about"
									onClick={(e) => {
										e.preventDefault();
										const aboutElement = document.getElementById("about");
										if (aboutElement) {
											smoothScrollTo(aboutElement.offsetTop - 80, 650);
										}
										setHamburgerTriggered(false);
									}}
									className="nav-link text-white/80 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]non-selectable"
								>
									{t("about")}
								</a>
								<a
									href="#commissions"
									onClick={(e) => {
										e.preventDefault();
										const projectsElement =
											document.getElementById("commissions");
										if (projectsElement) {
											smoothScrollTo(projectsElement.offsetTop - 80, 650);
										}
										setHamburgerTriggered(false);
									}}
									className="nav-link text-white/80 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]non-selectable"
								>
									{t("commissions")}
								</a>
								<div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent mx-1.5" />
								<a
									href="mailto:me@cortex.rest"
									onClick={() => setHamburgerTriggered(false)}
									className="nav-link-icon text-white/80 hover:text-white transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</a>
								<a
									href="https://github.com/refurbishing/website"
									onClick={() => setHamburgerTriggered(false)}
									className="nav-link-icon text-white/80 hover:text-white transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
									target="_blank"
									rel="noopener noreferrer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-5 h-5"
									>
										<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
										<path d="M20 3v4" />
										<path d="M22 5h-4" />
										<path d="M4 17v2" />
										<path d="M5 18H3" />
									</svg>
								</a>
							</nav>
						</div>
					</div>

					<AnimatePresence>
						{hamburgerTriggered && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2 }}
								className="fixed left-0 right-0 mt-2 mx-4 bg-dark/70 text-white border border-[#898c91] rounded-2xl shadow-md lg:hidden non-selectable"
								style={{
									top: "4.5rem",
									zIndex: 45,
								}}
							>
								<nav className="index-nav p-4 non-selectable">
									<div className="flex flex-col non-selectable">
										<a
											href="#"
											onClick={(e) => {
												e.preventDefault();
												smoothScrollTo(0, 800);
												setHamburgerTriggered(false);
											}}
											className="hamburger-navlink text-white/80 hover:text-white py-2 hover:bg-white/10 transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
										>
											{t("home")}
										</a>
										<a
											href="#about"
											onClick={(e) => {
												e.preventDefault();
												const aboutElement = document.getElementById("about");
												if (aboutElement) {
													smoothScrollTo(aboutElement.offsetTop - 80, 800);
												}
												setHamburgerTriggered(false);
											}}
											className="hamburger-navlink text-white/80 hover:text-white py-2 hover:bg-white/10 transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
										>
											{t("about")}
										</a>
										<a
											href="#commissions"
											onClick={(e) => {
												e.preventDefault();
												const projectsElement =
													document.getElementById("commissions");
												if (projectsElement) {
													smoothScrollTo(projectsElement.offsetTop - 80, 800);
												}
												setHamburgerTriggered(false);
											}}
											className="hamburger-navlink text-white/80 hover:text-white py-2 hover:bg-white/10 transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
										>
											{t("commissions")}
										</a>
										<a
											href="mailto:me@cortex.rest"
											className="hamburger-navlink text-white/80 hover:text-white py-2 hover:bg-white/10 transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
										>
											<div className="flex items-center">
												<svg
													className="w-5 h-5 mr-2"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
												{t("contact")}
											</div>
										</a>
										<a
											href="https://github.com/refurbishing/website"
											className="hamburger-navlink text-white/80 hover:text-white py-2 hover:bg-white/10 transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable"
											target="_blank"
											rel="noopener noreferrer"
										>
											<div className="flex items-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="w-5 h-5 mr-2"
												>
													<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
													<path d="M20 3v4" />
													<path d="M22 5h-4" />
													<path d="M4 17v2" />
													<path d="M5 18H3" />
												</svg>
												{t("source")}
											</div>
										</a>
									</div>
								</nav>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>

			<UserArea isOpen={showUserArea} onClose={() => setShowUserArea(false)} />
		</div>
	);
}
