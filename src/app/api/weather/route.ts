import { NextResponse } from "next/server";

let lastSuccessfulResponse: any = null;
let lastRequestTime: number = 0;
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes

export async function GET() {
	try {
		const now = Date.now();
		if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW) {
			if (lastSuccessfulResponse) {
				return NextResponse.json(lastSuccessfulResponse);
			}
		} else {
			lastSuccessfulResponse = null;
		}

		lastRequestTime = now;

		const response = await fetch("https://wttr.in/Honduras?format=%t|%C", {
			next: { revalidate: 900 }, // Cache for 15 minutes
		});
		if (!response.ok) throw new Error("Weather service unavailable");

		const data = await response.text();
		const [temp, condition] = data.split("|");

		if (temp.toLowerCase().includes("error") || condition.toLowerCase().includes("unknown")) {
			throw new Error("Received error or unknown data");
		}

		lastSuccessfulResponse = {
			temp: temp.replace("+", "").trim(),
			condition: condition.trim(),
			lastUpdated: new Date().toLocaleString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			}),
			cached: false
		};

		return NextResponse.json(lastSuccessfulResponse);
	} catch (error) {
		console.error("Error fetching weather:", error);
		const now = Date.now();
		if (lastSuccessfulResponse && now - lastRequestTime < RATE_LIMIT_WINDOW) {
			return NextResponse.json({
				...lastSuccessfulResponse,
				cached: true
			});
		}
		lastSuccessfulResponse = null;
		return NextResponse.json(
			{ error: "Unable to fetch weather data" },
			{ status: 500 },
		);
	}
} 