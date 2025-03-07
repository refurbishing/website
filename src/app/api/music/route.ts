import { NextResponse } from "next/server";

const USER_ID = "31mfwctmusrgnxl6tm3t7m2sl6mu";
const range = "weeks";

declare global {
	var musicCache: MusicCache | undefined;
}

interface MusicCache {
	data: {
		artists: any;
		tracks: any;
	} | null;
	timestamp: number;
}

if (!global.musicCache) {
	global.musicCache = {
		data: null,
		timestamp: 0,
	} as MusicCache;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
	try {
		const now = Date.now();
		const cache = global.musicCache as MusicCache;

		if (cache.data && now - cache.timestamp < CACHE_DURATION) {
			return NextResponse.json({
				...cache.data,
				cached: true,
			});
		}

		const [artistsRes, tracksRes] = await Promise.all([
			fetch(
				`https://api.stats.fm/api/v1/users/${USER_ID}/top/artists?range=${range}`,
			),
			fetch(
				`https://api.stats.fm/api/v1/users/${USER_ID}/top/tracks?range=${range}`,
			),
		]);

		const artists = await artistsRes.json();
		const tracks = await tracksRes.json();

		const musicData = { artists, tracks };
		global.musicCache = {
			data: musicData,
			timestamp: now,
		};

		return NextResponse.json({
			...musicData,
			cached: false,
		});
	} catch (error) {
		console.error("Error fetching music stats:", error);

		const cache = global.musicCache as MusicCache;
		if (cache.data) {
			return NextResponse.json({
				...cache.data,
				cached: true,
			});
		}

		return NextResponse.json(
			{ error: "Failed to fetch music stats" },
			{ status: 500 },
		);
	}
}
