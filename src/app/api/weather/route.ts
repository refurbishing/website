import { NextResponse } from "next/server";

declare global {
	var weatherCache: WeatherCache | undefined;
}

interface WeatherCache {
	data: {
		temp: string;
		condition: string;
		lastUpdated: string;
	} | null;
	timestamp: number;
}

if (!global.weatherCache) {
	global.weatherCache = {
		data: null,
		timestamp: 0
	} as WeatherCache;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const API_URL = "https://wttr.in/Honduras?format=%t|%C";

export async function GET() {
	try {
		const now = Date.now();
		const cache = global.weatherCache as WeatherCache;
		
		if (cache.data && now - cache.timestamp < CACHE_DURATION) {
			return NextResponse.json({
				...cache.data,
				cached: true,
			});
		}
		
		const response = await fetch(API_URL, {
			next: { revalidate: 900 }, // Cache for 15 minutes
		});
		
		if (!response.ok) throw new Error("Weather service unavailable");
		
		const data = await response.text();
		const [temp, condition] = data.split("|");
		
		if (
			temp.toLowerCase().includes("error") ||
			condition.toLowerCase().includes("unknown")
		) {
			throw new Error("Received error or unknown data");
		}
			const weatherData = {
			temp: temp.replace("+", "").trim(),
			condition: condition.trim(),
			lastUpdated: new Date().toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			}),
		};
		
		global.weatherCache = {
			data: weatherData,
			timestamp: now
		};
		
		return NextResponse.json({
			...weatherData,
			cached: false,
		});
		
	} catch (error) {
		console.error("Error fetching weather:", error);
				const cache = global.weatherCache as WeatherCache;
		if (cache.data) {
			return NextResponse.json({
				...cache.data,
				cached: true,
			});
		}
		
		return NextResponse.json(
			{ error: "Unable to fetch weather data" },
			{ status: 500 },
		);
	}
}
