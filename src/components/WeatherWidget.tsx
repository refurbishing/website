"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardBody } from "@heroui/react";
import {
	CloudSun,
	CloudRain,
	CloudRainWind,
	CloudSnow,
	CloudLightning,
	CloudFog,
	Cloudy,
	Sun,
	SunDim,
	Wind,
	Droplets,
	Thermometer,
	Eye,
	Compass,
} from "lucide-react";
import { getTranslation } from "@/utils/translations";
import { useLanguage } from "@/hooks/LanguageContext";

interface WeatherWidgetProps {
	isOpen: boolean;
	onClose: () => void;
	weatherData: WeatherData | null;
	loading: boolean;
	error: string | null;
	onRetry: () => void;
}

export interface WeatherData {
	temp: string;
	condition: string;
	feelsLike?: string;
	humidity?: string;
	windSpeed?: string;
	windDirection?: string;
	visibility?: string;
	pressure?: string;
	lastUpdated: string;
	forecast?: {
		date: string;
		condition: string;
		maxTemp: string;
		minTemp: string;
	}[];
	cached?: boolean;
	error?: string;
}

export default function WeatherWidget({
	isOpen,
	onClose,
	weatherData,
	loading,
	error,
	onRetry,
}: WeatherWidgetProps) {
	const { language } = useLanguage();
	const t = (key: string) => getTranslation(language, key);

	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscapeKey);
		return () => document.removeEventListener("keydown", handleEscapeKey);
	}, [isOpen, onClose]);

	const getWeatherIcon = (condition: string, size: number = 5) => {
		const lowercaseCondition = condition.toLowerCase();
		let IconComponent;
		let iconColor = "text-gray-300";

		if (
			lowercaseCondition.includes("clear") ||
			lowercaseCondition.includes("sunny")
		) {
			IconComponent = Sun;
			iconColor = "text-yellow-300";
		} else if (lowercaseCondition.includes("thunder")) {
			IconComponent = CloudLightning;
			iconColor = "text-yellow-400";
		} else if (lowercaseCondition.includes("fog")) {
			IconComponent = CloudFog;
			iconColor = "text-gray-300";
		} else if (
			lowercaseCondition.includes("heavy rain") ||
			lowercaseCondition.includes("torrential")
		) {
			IconComponent = CloudRainWind;
			iconColor = "text-blue-200";
		} else if (lowercaseCondition.includes("rain")) {
			IconComponent = CloudRain;
			iconColor = "text-blue-200";
		} else if (
			lowercaseCondition.includes("snow") ||
			lowercaseCondition.includes("blizzard")
		) {
			IconComponent = CloudSnow;
			iconColor = "text-blue-100";
		} else if (lowercaseCondition.includes("partly cloudy")) {
			IconComponent = CloudSun;
			iconColor = "text-gray-200";
		} else if (
			lowercaseCondition.includes("overcast") ||
			lowercaseCondition.includes("cloudy")
		) {
			IconComponent = Cloudy;
			iconColor = "text-gray-300";
		} else {
			IconComponent = SunDim;
			iconColor = "text-gray-300";
		}

		return (
			<motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
				<IconComponent className={`w-${size} h-${size} ${iconColor}`} />
			</motion.div>
		);
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence mode="popLayout">
			{isOpen && (
				<motion.div
					className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-[12px]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.25,
						ease: [0.25, 0.8, 0.25, 1],
					}}
				>
					<div className="absolute inset-0 bg-black/60" onClick={onClose} />
					<motion.div
						className="w-[95%] max-w-lg relative z-10"
						initial={{ scale: 0.98, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.98, opacity: 0 }}
						transition={{
							duration: 0.25,
							ease: [0.25, 0.8, 0.25, 1],
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<Card className="rounded-lg border border-zinc-800 relative overflow-hidden bg-zinc-900/90">
							<CardHeader className="relative z-10 flex justify-between items-center py-4.5 px-6">
								<div className="absolute left-4 top-5 w-5 h-5 text-zinc-500">
									<Thermometer />
								</div>
								<button
									onClick={onClose}
									className="text-zinc-400 hover:text-white transition-colors absolute right-4 top-4"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
								<div className="flex flex-col items-center mx-auto w-full">
									<h2 className="text-lg font-semibold text-white">
										{t("weather.title")}
									</h2>
									<span className="text-xs text-zinc-500 mt-1 px-2 rounded-xl bg-zinc-800/35">
										{weatherData
											? weatherData.lastUpdated
											: new Date().toLocaleDateString("en-US", {
													weekday: "long",
												})}
									</span>
								</div>
							</CardHeader>
							<div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
							<CardBody className="relative px-6 py-3">
								{error ? (
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
											onClick={onRetry}
											className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
										>
											Try Again
										</button>
									</div>
								) : loading ? (
									<div className="py-1">
										<div className="flex items-center justify-center w-full mb-6">
											<div className="flex items-center gap-4">
												<div className="w-24 h-24 bg-zinc-800/50 rounded-full animate-pulse" />
												<div className="text-center">
													<div className="h-10 bg-zinc-800/50 rounded animate-pulse w-28 mb-2" />
													<div className="h-5 bg-zinc-800/50 rounded animate-pulse w-36" />
													<div className="h-4 bg-zinc-800/50 rounded animate-pulse w-24 mt-1" />
												</div>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 w-full mb-6">
											{[...Array(4)].map((_, i) => (
												<div
													key={i}
													className="flex items-center gap-2 p-2 bg-zinc-800/20 rounded-lg outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all"
												>
													<div className="w-5 h-5 bg-zinc-800/50 rounded animate-pulse" />
													<div className="flex-1">
														<div className="h-3 bg-zinc-800/50 rounded animate-pulse w-16" />
														<div className="h-4 bg-zinc-800/50 rounded animate-pulse w-12 mt-1" />
													</div>
												</div>
											))}
										</div>

										<div className="w-full">
											<div className="h-4 bg-zinc-800/50 rounded animate-pulse w-32 mx-auto mb-3" />
											<div className="grid grid-cols-3 gap-2">
												{[...Array(3)].map((_, i) => (
													<div
														key={i}
														className="p-2 bg-zinc-800/20 rounded-lg outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all"
													>
														<div className="h-3 bg-zinc-800/50 rounded animate-pulse w-16 mx-auto mb-2" />
														<div className="w-8 h-8 bg-zinc-800/50 rounded-full animate-pulse mx-auto my-2" />
														<div className="h-4 bg-zinc-800/50 rounded animate-pulse w-20 mx-auto" />
													</div>
												))}
											</div>
										</div>

										<div className="flex justify-center mt-4">
											<div className="h-3 bg-zinc-800/50 rounded animate-pulse w-24" />
										</div>
									</div>
								) : weatherData ? (
									<div className="py-1">
										<div className="flex items-center justify-center w-full mb-6">
											<div className="flex items-center gap-4">
												<div className="flex-shrink-0">
													{getWeatherIcon(weatherData.condition, 28)}
												</div>
												<div className="text-center">
													<h1 className="text-4xl font-bold text-white">
														{weatherData.temp}
													</h1>
													<p className="text-zinc-400">
														{t(
															`weather.conditions.${weatherData.condition.toLowerCase().replace(/ /g, "_")}`,
														)}
													</p>
													{weatherData.feelsLike && (
														<p className="text-sm text-zinc-500 mt-1">
															{t("weather.feelsLike")} {weatherData.feelsLike}
														</p>
													)}
												</div>
											</div>
										</div>

										{(weatherData.humidity ||
											weatherData.windSpeed ||
											weatherData.windDirection ||
											weatherData.visibility) && (
											<div className="grid grid-cols-2 gap-4 w-full mb-6">
												{weatherData.humidity && (
													<div className="flex items-center gap-2 p-2 bg-zinc-800/20 rounded-lg outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all">
														<Droplets className="w-5 h-5 text-blue-400" />
														<div>
															<p className="text-xs text-zinc-500">
																{t("weather.humidity")}
															</p>
															<p className="text-white">
																{weatherData.humidity}
															</p>
														</div>
													</div>
												)}
												{weatherData.windSpeed && (
													<div className="flex items-center gap-2 p-2 bg-zinc-800/20 rounded-lg outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all">
														<Wind className="w-5 h-5 text-blue-300" />
														<div>
															<p className="text-xs text-zinc-500">
																{t("weather.wind")}
															</p>
															<p className="text-white">
																{weatherData.windSpeed}
															</p>
														</div>
													</div>
												)}
												{weatherData.windDirection && (
													<div className="flex items-center gap-2 p-2 bg-zinc-800/20 rounded-lg outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all">
														<Compass className="w-5 h-5 text-zinc-400" />
														<div>
															<p className="text-xs text-zinc-500">
																{t("weather.direction")}
															</p>
															<p className="text-white">
																{weatherData.windDirection}
															</p>
														</div>
													</div>
												)}
												{weatherData.visibility && (
													<div className="flex items-center gap-2 p-2 bg-zinc-800/20 rounded-lg outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all">
														<Eye className="w-5 h-5 text-zinc-400" />
														<div>
															<p className="text-xs text-zinc-500">
																{t("weather.visibility")}
															</p>
															<p className="text-white">
																{weatherData.visibility}
															</p>
														</div>
													</div>
												)}
											</div>
										)}

										{weatherData.forecast &&
											weatherData.forecast.length > 0 && (
												<div className="w-full">
													<h3 className="text-sm font-medium text-zinc-400 mb-3 text-center">
														{t("weather.forecast")}
													</h3>
													<div className="grid grid-cols-3 gap-2">
														{weatherData.forecast.map((day, index) => (
															<div
																key={index}
																className="p-2 bg-zinc-800/20 rounded-lg text-center outline-none outline-[0px] outline-dashed outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-zinc-700 hover:-translate-y-0.5 transition-all"
															>
																<p className="text-xs text-zinc-500 mb-1.5">
																	{day.date.split("-").join("/")}
																</p>
																<div className="my-2 flex justify-center">
																	{getWeatherIcon(day.condition, 8)}
																</div>
																<p className="text-sm">
																	<span className="text-white">
																		{day.maxTemp}
																	</span>{" "}
																	<span className="text-zinc-500 text-base">
																		•
																	</span>{" "}
																	<span className="text-zinc-400">
																		{day.minTemp}
																	</span>
																</p>
															</div>
														))}
													</div>
												</div>
											)}
									</div>
								) : null}
							</CardBody>
						</Card>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
