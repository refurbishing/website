"use client";
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/LanguageContext";
import { getTranslation } from "@/utils/translations";

export function Footer() {
	const { language } = useLanguage();
	const t = (key: string) => getTranslation(language, key);

	return (
		<motion.footer
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="bg-dot-white/[0.4] h-[8rem] w-full flex flex-col items-center justify-end overflow-hidden relative [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
		>
			<div className="flex-grow" />
			<div className="w-4/5 h-[2px] mb-2 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full relative" />
			<h1 className="md:text-base text-xs lg:text-sm font-bold text-center text-white relative mb-3 z-10">
				<a
					href="https://github.com/refurbishing/website"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-gray-300"
				>
					{t("footer.allRightsReserved")}
				</a>
				&nbsp;• {t("footer.madeWith")}
			</h1>
		</motion.footer>
	);
}
