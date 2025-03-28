import { NextResponse } from "next/server";

declare global {
	var statsCache: StatsCache | undefined;
}

interface StatsCache {
	data: {
		contributions: any;
		total: number;
		languages: { [key: string]: number };
		wakatime: any;
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

		const fetchWithCheck = async (url: string, options = {}) => {
			const res = await fetch(url, options);
			if (!res.ok) {
				throw new Error(
					`Fetch error: ${url} - ${res.status} ${res.statusText}`,
				);
			}
			return res.json();
		};

		const contributionsData = await fetchWithCheck(
			"https://github-contributions-api.jogruber.de/v4/refurbishing?y=last",
			{ next: { revalidate: 18000 } }, // Cache for 5 hours
		);

		const wakatimeData = await fetchWithCheck(
			"https://wakatime.com/api/v1/users/enhance/stats?is_including_today=true",
			{ next: { revalidate: 18000 } }, // Cache for 5 hours
		);

		const reposRes = await fetch(
			"https://api.github.com/users/refurbishing/repos",
			{
				headers: {
					Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
					Accept: "application/vnd.github.v3+json",
				},
				next: { revalidate: 18000 }, // Cache for 5 hours
			},
		);

		if (!reposRes.ok) {
			throw new Error(
				`GitHub API error: ${reposRes.status} ${reposRes.statusText}`,
			);
		}

		const repos = await reposRes.json();

		if (!Array.isArray(repos)) {
			throw new Error("Unexpected response format from GitHub API");
		}

		const filteredRepos = repos.filter(
			(repo) => !repo.fork || repo.full_name === "refurbishing/dots-hyprland",
		);

		const languagePromises = filteredRepos.map((repo) =>
			fetchWithCheck(repo.languages_url, { next: { revalidate: 18000 } }),
		);

		const languageData = await Promise.all(languagePromises);

		const aggregatedLanguages: { [key: string]: number } = {};
		languageData.forEach((repoLangs: { [key: string]: number }) => {
			Object.entries(repoLangs).forEach(([lang, bytes]) => {
				aggregatedLanguages[lang] = (aggregatedLanguages[lang] || 0) + bytes;
			});
		});

		const topLanguages: { [key: string]: number } = {};
		Object.entries(aggregatedLanguages)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6)
			.forEach(([lang, bytes]) => {
				topLanguages[lang] = bytes;
			});

		const statsData = {
			contributions: contributionsData.contributions,
			total: contributionsData.total.lastYear,
			languages: topLanguages,
			wakatime: wakatimeData.data,
		};

		global.statsCache = {
			data: statsData,
			timestamp: now,
		};

		return NextResponse.json({
			...statsData,
			cached: false,
		});
	} catch (error: unknown) {
		console.error("API Error:", error);

		const cache = global.statsCache as StatsCache;
		if (cache.data) {
			return NextResponse.json({
				...cache.data,
				cached: true,
				error: `API failure: ${String(error)}`,
			});
		}

		return NextResponse.json(
			{
				error: `Failed to fetch GitHub data. Possible rate limit. Error: ${String(error)}`,
			},
			{ status: 500 },
		);
	}
}
