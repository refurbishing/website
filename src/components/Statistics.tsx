"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { TextFade } from "../app/structure/TextFade";
import { useState, useEffect, useRef } from "react";
import { useInview } from "../lib/animateInscroll";
import { Icon } from "@iconify/react";

export default function Statistics() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInview(ref);
	const [contributions, setContributions] = useState([]);
	const [total, setTotal] = useState(0);
	const [months, setMonths] = useState<{ label: string; key: string }[]>([]);
	const [loading, setLoading] = useState(true);
	const [languages, setLanguages] = useState<{ [key: string]: number }>({});
	const [wakatime, setWakatime] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getLastTwelveMonths = () => {
			const monthNames = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			const current = new Date();
			const months = [];

			const startMonth = current.getMonth();
			const currentYear = current.getFullYear();

			for (let i = 0; i <= 12; i++) {
				const monthIndex = (startMonth + i) % 12;
				const yearOffset = Math.floor((startMonth + i) / 12);
				const year = currentYear + yearOffset;
				months.push({
					label: monthNames[monthIndex],
					key: `${monthNames[monthIndex]}-${year}`,
				});
			}

			return months;
		};

		setMonths(getLastTwelveMonths());

		fetch("/api/stats")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Error fetching GitHub stats: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}
				setContributions(data.contributions);
				setTotal(data.total);

				if (
					data.languages &&
					typeof data.languages === "object" &&
					!data.languages.message
				) {
					setLanguages(data.languages);
				} else {
					setLanguages({});
				}
				
				if (data.wakatime) {
					setWakatime(data.wakatime);
				}

				setError(null);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching GitHub data:", error);
				setError("Failed to load GitHub statistics. Please try again later.");
				setLoading(false);
			});
	}, []);

	return (
		<div
			id="statistics"
			ref={ref}
			className="mt-10 flex flex-col items-center justify-center min-h-[25vh] py-6"
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
			>
				<TextFade
					words="Statistics"
					className="mb-3.5 text-2xl font-bold text-white/90"
					fullLoadedDuration={2}
					duration={1.85}
					slideDirection="up"
					slideDistance={25}
				/>
			</motion.div>

			{loading ? (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
				>
					<Card className="w-full max-w-[95vw] md:w-auto bg-black/5 backdrop-blur-[1.5px] border border-[#999a9e]/75 rounded-xl">
						<CardHeader className="px-2 md:px-4 pt-2 md:pt-4 flex gap-3 justify-between items-center">
							<div className="flex items-center gap-3">
								<div className="h-7 w-64 bg-white/10 animate-pulse rounded-2xl" />
								<div className="h-4 w-4 bg-white/10 animate-pulse rounded-full" />
							</div>
							<div className="h-7 w-32 bg-white/10 animate-pulse rounded-2xl" />
						</CardHeader>
						<CardBody>
							<div className="w-full">
								<div className="border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl shadow-lg p-4">
									<div className="flex gap-2">
										<div className="flex flex-col justify-between pt-6 pb-2 space-y-8">
											<div className="h-3 w-6 bg-white/10 animate-pulse rounded" />
											<div className="h-3 w-6 bg-white/10 animate-pulse rounded" />
											<div className="h-3 w-6 bg-white/10 animate-pulse rounded" />
										</div>
										<div className="w-full overflow-x-auto">
											<div className="min-w-[750px]">
												<div className="flex justify-between mb-2 gap-[50px] md:gap-0">
													{[...Array(12)].map((_, i) => (
														<div
															key={i}
															className="h-3 w-6 bg-white/10 animate-pulse rounded"
														/>
													))}
												</div>
												<div className="grid grid-flow-col auto-cols-min grid-rows-[repeat(7,_minmax(0,_1fr))] gap-1 md:gap-[3.5px]">
													{[...Array(371)].map((_, i) => (
														<div
															key={i}
															className="h-3 w-3 bg-white/10 animate-pulse rounded-sm"
														/>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-2 border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl p-4">
								<div className="flex flex-col gap-2">
									{[...Array(5)].map((_, i) => (
										<div key={i} className="flex items-center gap-2">
											<div className="h-3 w-20 bg-white/10 animate-pulse rounded" />
											<div className="flex-1 h-3 bg-white/10 animate-pulse rounded-full" />
											<div className="h-3 w-10 bg-white/10 animate-pulse rounded" />
										</div>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</motion.div>
			) : error ? (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
				>
					<Card className="w-full max-w-[95vw] md:w-auto bg-black/5 backdrop-blur-[1.5px] border border-[#999a9e]/75 rounded-xl">
						<CardHeader className="px-2 md:px-4 pt-2 md:pt-4 flex gap-3 justify-between items-center">
							<div className="flex items-center gap-3">
								<div className="h-7 w-64 bg-white/10 rounded-2xl" />
								<div className="h-4 w-4 bg-white/10 rounded-full" />
							</div>
							<div className="h-7 w-32 bg-white/10 rounded-2xl" />
						</CardHeader>
						<CardBody>
							<div className="w-full">
								<div className="border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl shadow-lg p-4">
									<div className="flex flex-col items-center justify-center py-8 text-center">
										<div className="text-red-400 mb-3">
											<svg
												className="w-12 h-12 mx-auto"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
												/>
											</svg>
										</div>
										<p className="text-zinc-300">{error}</p>
										<button
											onClick={() => {
												setLoading(true);
												setError(null);
												fetch("/api/stats")
													.then((res) => {
														if (!res.ok)
															throw new Error(
																`Error fetching GitHub stats: ${res.status}`,
															);
														return res.json();
													})
													.then((data) => {
														if (data.error) throw new Error(data.error);
														setContributions(data.contributions);
														setTotal(data.total);
														setLanguages(data.languages);
														setWakatime(data.wakatime);
														setError(null);
														setLoading(false);
													})
													.catch((error) => {
														console.error("Error fetching GitHub data:", error);
														setError(
															"Failed to load GitHub statistics. Please try again later.",
														);
														setLoading(false);
													});
											}}
											className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
										>
											Try Again
										</button>
									</div>
								</div>
							</div>
							<div className="mt-4 border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl p-4">
								<div className="flex flex-col gap-2">
									{[...Array(5)].map((_, i) => (
										<div key={i} className="flex items-center gap-2">
											<div className="h-3 w-20 bg-white/10 rounded" />
											<div className="flex-1 h-3 bg-white/10 rounded-full" />
											<div className="h-3 w-10 bg-white/10 rounded" />
										</div>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
				>
					<Card className="bg-black/5 w-full max-w-[95vw] md:w-auto backdrop-blur-[1.5px] border border-[#999a9e]/75 rounded-xl relative overflow-hidden z-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_10px_rgba(35,32,32,15)] hover:border-opacity-60 hover:scale-[1.02] hover:backdrop-blur-none">
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-35 -z-10 scale-[1.5]"
							autoPlay
							loop
							muted
							playsInline
							disablePictureInPicture
							preload="auto"
						>
							<source src="/assets/card.mp4" type="video/mp4" />
						</video>
						<CardHeader className="px-2 md:px-4 pt-2 md:pt-4 flex gap-3 justify-between items-center relative z-[-1]">
							<div className="flex items-center gap-3">
								<motion.div
									whileHover={{
										scale: 1.03,
									}}
									whileTap={{ scale: 0.98 }}
									transition={{
										duration: 0.2,
										ease: "easeInOut",
									}}
									className="text-xs md:text-sm text-white/80 inline-flex items-center px-2 py-1 border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl shadow-lg"
								>
									<div className="flex items-center gap-1">
										<span className="font-medium">{total}</span>
										<span>Contributions in the last year</span>
									</div>
								</motion.div>
								<motion.div
									whileHover={{
										scale: 1.1,
									}}
									transition={{
										duration: 0.2,
										ease: "easeInOut",
									}}
								>
									<div className="group relative">
										<Icon
											icon="material-symbols:info-outline-rounded"
											className="w-4 h-4 -ml-1 text-white/60 hover:text-white/80 transition-colors duration-200 self-center cursor-help"
										/>
										<div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden md:group-hover:block">
											<div className="relative bg-zinc-950/95 border border-white/10 text-white/90 text-xs px-2 py-1 rounded-xl whitespace-nowrap shadow-xl">
												All GitHub & Wakatime activity
											</div>
										</div>
									</div>
								</motion.div>
							</div>
							<div className="flex items-center gap-2">
								<motion.div
									whileHover={{
										scale: 1.03,
									}}
									whileTap={{ scale: 0.98 }}
									transition={{
										duration: 0.2,
										ease: "easeInOut",
									}}
									className="border border-white/[0.03] non-selectable flex items-center gap-2 text-xs text-gray-400 bg-white/[0.01] backdrop-blur-sm px-2 py-1 rounded-2xl shadow-lg"
								>
									<span>Less</span>
									<div className="flex gap-1">
										{[0, 1, 2, 3, 4].map((level) => (
											<div
												key={level}
												className={`h-2.5 w-2.5 rounded-sm ${
													[
														"bg-white/10",
														"bg-white/25",
														"bg-white/50",
														"bg-white/75",
														"bg-white/90",
													][level]
												}`}
											/>
										))}
									</div>
									<span>More</span>
								</motion.div>
							</div>
						</CardHeader>
						<CardBody>
							<div className="w-full">
								<div className="w-full overflow-visible">
									<motion.div
										whileHover={{
											scale: 1.005,
											boxShadow: "0 0 2px rgba(255, 255, 255, 0.08)",
										}}
										whileTap={{ scale: 0.98 }}
										transition={{
											type: "tween",
											ease: [0.4, 0, 0.2, 1],
											duration: 0.3,
										}}
										className="relative border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl shadow-lg p-4 overflow-visible z-[1]"
									>
										<div className="overflow-x-auto pb-2 custom-scrollbar">
											<div className="min-w-[750px]">
												<div className="flex gap-2">
													<div className="flex flex-col justify-between pt-6 pb-2 text-[10px] md:text-xs text-gray-400">
														<span>Mon</span>
														<span>Wed</span>
														<span>Fri</span>
													</div>
													<div
														className="w-full relative"
														style={{ zIndex: 10 }}
													>
														<div className="flex justify-between mb-2 gap-[50px] md:gap-0">
															{months.map((month) => (
																<span
																	key={month.key}
																	className="text-[10px] md:text-xs text-gray-400"
																>
																	{month.label}
																</span>
															))}
														</div>
														<div className="grid grid-flow-col auto-cols-min grid-rows-[repeat(7,_minmax(0,_1fr))] gap-1 md:gap-[3.5px]">
															{contributions.map(
																({ date, level, count }, index) => (
																	<div
																		key={date}
																		className="relative"
																		style={{
																			animation: isInView
																				? `fadeScale 0.35s ease-out ${Math.floor(index / 7) * 0.02}s backwards`
																				: "none",
																		}}
																	>
																		<div
																			className={`group relative h-3 w-3 rounded-sm ${
																				[
																					"bg-white/10 hover:bg-white/15",
																					"bg-white/25 hover:bg-white/30",
																					"bg-white/50 hover:bg-white/55",
																					"bg-white/75 hover:bg-white/80",
																					"bg-white/90 hover:bg-white/95",
																				][level]
																			}`}
																		>
																			<div
																				className="pointer-events-none fixed bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 hidden group-hover:block z-[100] transition-all duration-200 ease-in-out transform-gpu translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
																			>
																				<div className="relative bg-zinc-950/95 border border-white/10 text-white/90 text-xs px-2 py-1 rounded-xl whitespace-nowrap shadow-xl">
																					{(() => {
																						const day = new Date(
																							date,
																						).getDate();
																						const suffix =
																							day % 10 === 1 && day !== 11
																								? "st"
																								: day % 10 === 2 && day !== 12
																									? "nd"
																									: day % 10 === 3 && day !== 13
																										? "rd"
																										: "th";
																						const formattedDate =
																							new Date(date).toLocaleDateString(
																								"en-US",
																								{
																									month: "long",
																									day: "numeric",
																								},
																							) + suffix;
																						return count === 1
																							? `1 contribution on ${formattedDate}`
																							: `${count} contributions on ${formattedDate}`;
																					})()}
																				</div>
																			</div>
																		</div>
																	</div>
																),
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								</div>
							</div>

							{Object.keys(languages).length > 0 && (
								<div className="mt-4 flex flex-col md:flex-row gap-4">
									<motion.div
										whileHover={{ scale: 1.005 }}
										className="flex-1 border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center"
									>
										<div className="flex flex-col gap-2 w-full">
											{(() => {
												const totalBytes = Object.values(languages).reduce(
													(a, b) => a + b,
													0,
												);
												return Object.entries(languages)
													.sort(([, a], [, b]) => b - a)
													.filter(([, bytes]) => (bytes / totalBytes) * 100 >= 1)
													.slice(0, 8)
													.map(([lang, bytes]) => {
														const percentage = (bytes / totalBytes) * 100;
														return (
															<div key={lang} className="flex items-center gap-2 group">
																<span className="text-xs text-white/60 w-20 truncate group-hover:text-white/80 transition-colors">
																	{lang}
																</span>
																<div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
																	<motion.div
																		className="h-full bg-gradient-to-r from-white/70 to-white/90 rounded-full"
																		initial={{ width: "0%" }}
																		animate={
																			isInView
																				? { width: `${percentage}%` }
																				: { width: "0%" }
																		}
																		transition={{
																			duration: 0.8,
																			ease: "easeOut",
																		}}
																		style={{ originX: 0 }}
																	/>
																</div>
																<span className="text-xs text-white/60 w-10 text-right group-hover:text-white/80 transition-colors">
																	{percentage.toFixed(1)}%
																</span>
															</div>
														);
													});
											})()}
										</div>
									</motion.div>
									
									{wakatime && wakatime.languages && wakatime.languages.length > 0 && (
										<motion.div
											whileHover={{ scale: 1.005 }}
											className="flex-1 border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm rounded-2xl p-4"
										>
											<div className="flex w-full items-center">
												<div className="relative flex-shrink-0">
													<svg viewBox="0 0 100 100" className="w-[150px] h-[150px] -rotate-90 drop-shadow-lg overflow-visible">
														{(() => {
															const languages = wakatime.languages || [];
															const total = languages.reduce((sum: number, lang: any) => sum + lang.total_seconds, 0);
															let currentAngle = 0;
															
															const colors = [
																"rgba(255, 255, 255, 0.9)", 
																"rgba(255, 255, 255, 0.75)", 
																"rgba(255, 255, 255, 0.6)", 
																"rgba(255, 255, 255, 0.45)",
																"rgba(255, 255, 255, 0.3)", 
																"rgba(255, 255, 255, 0.15)"
															];
															
															return languages
																.filter((lang: any) => lang.percent >= 1)
																.map((lang: any, index: number) => {
																	const percentage = lang.percent;
																	const angle = (percentage / 100) * 360;
																	const startAngle = currentAngle;
																	currentAngle += angle;
																	
																	const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
																	const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
																	const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
																	const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
																	
																	const largeArcFlag = angle > 180 ? 1 : 0;
																	
																	return (
																		<g key={lang.name} className="group">
																			<path
																				d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
																				fill={colors[index % colors.length]}
																				className="transition-all duration-200 hover:opacity-90 hover:scale-105 origin-center"
																				stroke="rgba(0,0,0,0.1)"
																				strokeWidth="0.5"
																			>
																				<animate 
																					attributeName="opacity" 
																					from="0" 
																					to="1" 
																					dur="0.8s" 
																					begin={`${index * 0.1}s`} 
																					fill="freeze" 
																				/>
																			</path>
																		</g>
																	);
																});
														})()}
														<circle cx="50" cy="50" r="25" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
													</svg>
													
													<div className="absolute inset-0 overflow-visible">
														{(() => {
															const languages = wakatime.languages || [];
															let currentAngle = 0;
															
															return languages
																.filter((lang: any) => lang.percent >= 1)
																.map((lang: any, index: number) => {
																	const percentage = lang.percent;
																	const angle = (percentage / 100) * 360;
																	const midAngle = currentAngle + angle / 2;
																	currentAngle += angle;
																	
																	const radius = 30; 
																	const radian = ((midAngle - 90) * Math.PI) / 180;
																	const x = 75 + radius * Math.cos(radian);
																	const y = 75 + radius * Math.sin(radian);
																	
																	return (
																		<div 
																			key={lang.name}
																			className="absolute w-10 h-10 -mt-5 -ml-5 group cursor-pointer overflow-visible"
																			style={{
																				left: `${x}px`,
																				top: `${y}px`,
																			}}
																		>
																			<div className="opacity-0 group-hover:opacity-100 absolute z-[100] -mt-6 -ml-14 w-auto min-w-24 pointer-events-none transition-all duration-200 ease-in-out transform-gpu translate-y-1 group-hover:translate-y-0 overflow-visible">
																				<div className="bg-zinc-950/95 border border-white/10 text-white/90 text-[10px] px-1.5 py-0.5 rounded-lg whitespace-nowrap shadow-xl text-center mx-auto">
																					{`${lang.name}: ${lang.text} (${lang.percent.toFixed(1)}%)`}
																				</div>
																			</div>
																		</div>
																	);
																});
														})()}
													</div>
												</div>

												<div className="flex-1 pl-4 flex flex-col gap-1.5 justify-center">
													<div className="mb-3 flex items-center gap-2">
														<span className="text-lg font-semibold text-white/90 block">
															{wakatime.human_readable_total || "0 hrs"}
														</span>
														<div className="group relative overflow-visible">
															<Icon
																icon="material-symbols:info-outline-rounded"
																className="w-4 h-4 text-white/60 hover:text-white/80 transition-colors cursor-help"
															/>
															<div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[100]">
																<div className="relative bg-zinc-950/95 border border-white/10 text-white/90 text-xs px-2 py-1 rounded-xl whitespace-nowrap shadow-xl">
																	<span className="hidden sm:inline">Coding </span>
																	<span className="sm:hidden">A</span><span className="hidden sm:inline">a</span>ctivity from last 7 days
																</div>
															</div>
														</div>
													</div>
													
													{wakatime.languages && wakatime.languages
														.filter((lang: any) => lang.percent >= 3)
														.slice(0, 6)
														.map((lang: any, index: number) => {
															const colors = [
																"rgba(255, 255, 255, 0.9)", 
																"rgba(255, 255, 255, 0.75)", 
																"rgba(255, 255, 255, 0.6)", 
																"rgba(255, 255, 255, 0.45)",
																"rgba(255, 255, 255, 0.3)", 
																"rgba(255, 255, 255, 0.15)"
															];
															return (
																<motion.div 
																	key={lang.name} 
																	className="flex items-center gap-1.5 group"
																	initial={{ opacity: 0, x: -5 }}
																	animate={{ opacity: 1, x: 0 }}
																	transition={{ delay: index * 0.1, duration: 0.3 }}
																>
																	<span 
																		className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125 duration-300" 
																		style={{ backgroundColor: colors[index % colors.length] }}
																	></span>
																	<span className="text-xs text-white/70 font-medium group-hover:text-white/90 transition-colors">
																		{lang.name}
																	</span>
																	<div className="flex-1 h-1.5 bg-white/10 rounded-full mx-2 overflow-hidden">
																		<motion.div 
																			className="h-full rounded-full"
																			style={{ backgroundColor: colors[index % colors.length] }}
																			initial={{ width: 0 }}
																			animate={{ width: `${lang.percent}%` }}
																			transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
																		/>
																	</div>
																	<span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
																		{lang.percent.toFixed(0)}%
																	</span>
																</motion.div>
															);
														})}
												</div>
											</div>
										</motion.div>
									)}
								</div>
							)}
						</CardBody>
					</Card>
				</motion.div>
			)}
		</div>
	);
}
