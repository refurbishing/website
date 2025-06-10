import { NextResponse } from "next/server";

declare global {
	var weatherCache: WeatherCache | undefined;
}

interface WeatherCache {
	data: {
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
	} | null;
	timestamp: number;
}

if (!global.weatherCache) {
	global.weatherCache = {
		data: null,
		timestamp: 0,
	} as WeatherCache;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const API_URL = "https://wttr.in/Honduras?format=j1";

const getCachedData = () => {
	const cache = global.weatherCache as WeatherCache;
	if (cache.data) {
		return NextResponse.json({
			...cache.data,
			lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
				timeZone: "America/Tegucigalpa",
			}),
			cached: true,
		});
	}
	return null;
};

export async function GET() {
	try {
		const now = Date.now();
		const cache = global.weatherCache as WeatherCache;

		if (cache.data && now - cache.timestamp < CACHE_DURATION) {
			return NextResponse.json({
				...cache.data,
				lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "numeric",
					hour12: true,
					timeZone: "America/Tegucigalpa",
				}),
				cached: true,
			});
		}

		const response = await fetch(API_URL, {
			next: { revalidate: 900 }, // Cache for 15 minutes
		});

		if (!response.ok) {
			const cachedData = cache.data;
			if (cachedData) {
				return NextResponse.json({
					...cachedData,
					lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: true,
						timeZone: "America/Tegucigalpa",
					}),
					cached: true,
				});
			}
			throw new Error(`Weather service unavailable: ${response.status}`);
		}

		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			const cachedData = cache.data;
			if (cachedData) {
				return NextResponse.json({
					...cachedData,
					lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: true,
						timeZone: "America/Tegucigalpa",
					}),
					cached: true,
				});
			}
			throw new Error("Invalid response from weather service");
		}

		let data;
		try {
			data = await response.json();
		} catch (jsonError) {
			const cachedData = cache.data;
			if (cachedData) {
				return NextResponse.json({
					...cachedData,
					lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: true,
						timeZone: "America/Tegucigalpa",
					}),
					cached: true,
				});
			}
			throw new Error("Invalid JSON response from weather service");
		}

		if (!data || !data.current_condition || !data.current_condition[0]) {
			const cachedData = cache.data;
			if (cachedData) {
				return NextResponse.json({
					...cachedData,
					lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: true,
						timeZone: "America/Tegucigalpa",
					}),
					cached: true,
				});
			}
			throw new Error("Invalid weather data format");
		}

		const current = data.current_condition[0];

		const forecast =
			data.weather?.slice(0, 3).map((day: any) => ({
				date: day.date,
				condition: day.hourly[4].weatherDesc[0].value,
				maxTemp: `${day.maxtempC}°C`,
				minTemp: `${day.mintempC}°C`,
			})) || [];

		const weatherData = {
			temp: `${current.temp_C}°C`,
			condition: current.weatherDesc[0].value,
			feelsLike: `${current.FeelsLikeC}°C`,
			humidity: `${current.humidity}%`,
			windSpeed: `${current.windspeedKmph} km/h`,
			windDirection: current.winddir16Point,
			visibility: `${current.visibility} km`,
			pressure: `${current.pressure} mb`,
			lastUpdated: new Date(now).toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
				timeZone: "America/Tegucigalpa",
			}),
			forecast,
		};

		global.weatherCache = {
			data: weatherData,
			timestamp: now,
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
				lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "numeric",
					hour12: true,
					timeZone: "America/Tegucigalpa",
				}),
				cached: true,
			});
		}

		try {
			const now = Date.now();
			const basicResponse = await fetch(
				"https://wttr.in/Honduras?format=%t|%C",
				{
					next: { revalidate: 900 },
				},
			);

			if (!basicResponse.ok) {
				const cache = global.weatherCache as WeatherCache;
				if (cache.data) {
					return NextResponse.json({
						...cache.data,
						lastUpdated: new Date(cache.timestamp).toLocaleString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
							hour: "numeric",
							minute: "numeric",
							hour12: true,
							timeZone: "America/Tegucigalpa",
						}),
						cached: true,
					});
				}
				throw new Error("Weather service unavailable");
			}

			const basicData = await basicResponse.text();
			const [temp, condition] = basicData.split("|");

			const basicWeatherData = {
				temp: temp.replace("+", "").trim(),
				condition: condition.trim(),
				lastUpdated: new Date(now).toLocaleString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "numeric",
					hour12: true,
					timeZone: "America/Tegucigalpa",
				}),
			};

			global.weatherCache = {
				data: basicWeatherData,
				timestamp: Date.now(),
			};

			return NextResponse.json({
				...basicWeatherData,
				cached: false,
			});
		} catch (fallbackError) {
			console.error("Fallback weather fetch failed:", fallbackError);

			const cachedResponse = getCachedData();
			if (cachedResponse) return cachedResponse;

			return NextResponse.json(
				{ error: "Unable to fetch weather data" },
				{ status: 500 },
			);
		}
	}
}
