import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

declare global {
	var songsCache: SongsCache | undefined;
}

interface SongsCache {
	data: Array<{
		title: string;
		artist: string;
	}> | null;
	timestamp: number;
}

if (!global.songsCache) {
	global.songsCache = {
		data: null,
		timestamp: 0,
	} as SongsCache;
}
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function GET() {
	try {
		const now = Date.now();
		const cache = global.songsCache as SongsCache;

		if (cache.data && now - cache.timestamp < CACHE_DURATION) {
			return NextResponse.json({
				songs: cache.data,
				cached: true,
			});
		}

		const musicDir = path.join(process.cwd(), "public", "songs");
		const files = await fs.readdir(musicDir);

		const songs = await Promise.all(
			files
				.filter((file) => file.endsWith(".mp3"))
				.map(async (file) => {
					const [artist, ...titleParts] = file.replace(".mp3", "").split("-");
					const title = titleParts.join("-").trim();

					return {
						title,
						artist: artist.trim(),
					};
				}),
		);

		global.songsCache = {
			data: songs,
			timestamp: now,
		};

		return NextResponse.json({
			songs,
			cached: false,
		});
	} catch (error) {
		console.error("Error loading songs:", error);

		const cache = global.songsCache as SongsCache;
		if (cache.data) {
			return NextResponse.json({
				songs: cache.data,
				cached: true,
			});
		}

		return NextResponse.json(
			{ error: "Failed to load songs" },
			{ status: 500 },
		);
	}
}
