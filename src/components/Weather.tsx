"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	Sun,
	SunMedium,
	SunDim,
	Cloud,
	CloudSun,
	CloudRain,
	CloudRainWind,
	CloudSunRain,
	CloudSnow,
	CloudHail,
	CloudLightning,
	CloudFog,
	Cloudy,
	LucideIcon,
} from "lucide-react";
import WeatherWidget from "./WeatherWidget";
import type { WeatherData } from "./WeatherWidget";

const WEATHER_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
	clear: { icon: Sun, color: "text-yellow-300" },
	sunny: { icon: SunMedium, color: "text-yellow-300" },
	thunder: { icon: CloudLightning, color: "text-yellow-400" },
	"thunder-snow": { icon: CloudSnow, color: "text-blue-100" },
	blizzard: { icon: CloudSnow, color: "text-blue-100" },
	torrential: { icon: CloudRainWind, color: "text-blue-200" },
	fog: { icon: CloudFog, color: "text-gray-300" },
	"freezing-fog": { icon: CloudFog, color: "text-blue-100" },
	"heavy-rain": { icon: CloudRainWind, color: "text-blue-200" },
	"freezing-rain": { icon: CloudHail, color: "text-blue-100" },
	"light-rain": { icon: CloudSunRain, color: "text-blue-200" },
	rain: { icon: CloudRain, color: "text-blue-200" },
	"heavy-snow": { icon: CloudSnow, color: "text-blue-100" },
	"light-snow": { icon: CloudSnow, color: "text-gray-200" },
	snow: { icon: CloudSnow, color: "text-blue-100" }, // never snows but i keep dreaming
	"partly-cloudy": { icon: CloudSun, color: "text-gray-200" },
	overcast: { icon: Cloud, color: "text-gray-300" },
	cloudy: { icon: Cloudy, color: "text-gray-300" },
	default: { icon: SunDim, color: "text-gray-300" },
};

const WeatherSkeleton = () => {
	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const showIconOnly = windowWidth < 415;

	return (
		<div
			className={`animate-pulse bg-white/5 backdrop-blur-sm px-3 py-1 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_2px_rgba(255,255,255,0.08)] ${
				showIconOnly ? "w-[42px]" : "w-[80px]"
			}`}
		>
			<div className="w-4 h-4" />
			{!showIconOnly && <div className="h-4 w-[32px]" />}
		</div>
	);
};

const Weather = () => {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [windowWidth, setWindowWidth] = useState(0);
	const [showWeatherWidget, setShowWeatherWidget] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const fetchWeather = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/weather");
			if (!response.ok) throw new Error("Weather service unavailable");

			const data = await response.json();
			if (data.error) throw new Error(data.error);

			setWeatherData(data);
			setError(null);
		} catch (error) {
			console.error("Error fetching weather:", error);
			setError("Unable to fetch weather data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWeather();
	}, []);

	const showIconOnly = windowWidth < 415;

	if (loading) return <WeatherSkeleton />;
	if (error) {
		return (
			<div className="bg-red-500/10 backdrop-blur-sm px-3 py-1 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_2px_rgba(255,255,255,0.08)]">
				<span className="text-sm text-red-500">
					{windowWidth < 860 ? "Error" : error}
				</span>
			</div>
		);
	}

	return (
		<>
			<div
				className="outline outline-1 outline-[#999a9e]/20 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_2px_rgba(255,255,255,0.08)] hover:bg-white/10 transition-all duration-300 cursor-pointer"
				onClick={() => setShowWeatherWidget(true)}
			>
				<WeatherIcon condition={weatherData?.condition || ""} />
				{!showIconOnly && (
					<span className="text-sm text-white/85 font-medium">
						{weatherData?.temp}
					</span>
				)}
			</div>

			{isMounted &&
				showWeatherWidget &&
				createPortal(
					<WeatherWidget
						isOpen={showWeatherWidget}
						onClose={() => setShowWeatherWidget(false)}
						weatherData={weatherData}
						loading={loading}
						error={error}
						onRetry={fetchWeather}
					/>,
					document.body,
				)}
		</>
	);
};

const WeatherIcon = ({ condition }: { condition: string }) => {
	const getWeatherIcon = (condition: string) => {
		const lowercaseCondition = condition.toLowerCase();

		const matchedIcon =
			Object.entries(WEATHER_ICONS).find(([key]) =>
				lowercaseCondition.includes(key),
			)?.[1] ?? WEATHER_ICONS.default;

		const IconComponent = matchedIcon.icon;
		return <IconComponent className={`w-4 h-4 ${matchedIcon.color}`} />;
	};

	return getWeatherIcon(condition);
};

export default Weather;
