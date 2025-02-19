import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import svgToDataUri from "mini-svg-data-uri";
import type { PluginAPI } from "tailwindcss/types/config";

const addVariablesForColors = ({ addBase, theme }: PluginAPI) => {
	const allColors = flattenColorPalette(theme("colors"));
	const newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
	);

	addBase({
		":root": newVars,
	});
};

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			screens: {
				'xs': {'max': '639px'},
				'zsm': '490px',
				'zssm': '415px',
				'xsm': '730px',
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			animation: {
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				slider: "slider var(--duration, 30s) linear infinite",
			},
			keyframes: {
				slider: {
					to: { transform: "translateX(-50%)" },
				},
				pulse: {
					"50%": { opacity: "0.5" },
				},
			},
		},
	},
	plugins: [
		addVariablesForColors,
		function ({ matchUtilities, theme }: any) {
			matchUtilities(
				{
					"bg-grid": (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
						)}")`,
					}),
					"bg-grid-small": (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
						)}")`,
					}),
					"bg-dot": (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
						)}")`,
					}),
				},
				{
					values: flattenColorPalette(theme("backgroundColor")),
					type: "color",
				},
			);
		},
	],
} satisfies Config;

export default config;
