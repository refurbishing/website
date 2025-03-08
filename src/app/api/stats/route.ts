import { NextResponse } from "next/server";

declare global {
	var statsCache: StatsCache | undefined;
}

interface StatsCache {
	data: {
		contributions: any;
		total: number;
	} | null;
	timestamp: number;
}

if (!global.statsCache) {
	global.statsCache = {
		data: null,
		timestamp: 0,
	} as StatsCache;
}

const CACHE_DURATION = 120 * 60 * 1000; // 2 hours in milliseconds

export async function GET() {
	try {
		const now = Date.now();
		const cache = global.statsCache as StatsCache;
		if (cache.data && now - cache.timestamp < CACHE_DURATION) {
			return NextResponse.json({
				...cache.data,
				cached: true,
			});
		}

		const contributionsRes = await fetch(
			"https://github-contributions-api.jogruber.de/v4/refurbishing?y=last",
			{ next: { revalidate: 18000 } }, // Cache for 5 hours
		);
		const contributionsData = await contributionsRes.json();

		const statsData = {
			contributions: contributionsData.contributions,
			total: contributionsData.total.lastYear,
		};

		global.statsCache = {
			data: statsData,
			timestamp: now,
		};

		return NextResponse.json({
			...statsData,
			cached: false,
		});
	} catch (error) {
		console.error("API Error:", error);

		const cache = global.statsCache as StatsCache;
		if (cache.data) {
			return NextResponse.json({
				...cache.data,
				cached: true,
			});
		}

		return NextResponse.json(
			{
				error:
					"Failed to fetch GitHub data. Possible Ratelimit try again later.",
			},
			{ status: 500 },
		);
	}
}
