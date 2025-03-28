import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/LanguageContext";

export default function TranslateGlobe() {
	const { toggleLanguage, language } = useLanguage();

	return (
		<motion.div
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9, rotate: 15 }}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{
				opacity: 1,
				scale: 1,
			}}
			transition={{
				type: "spring",
				stiffness: 180,
				damping: 20,
				duration: 0.3,
			}}
			className="fixed bottom-6 left-6 flex items-center justify-center cursor-pointer fadeIn"
			style={{ pointerEvents: "auto" }}
			onClick={toggleLanguage}
			aria-label={language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
		>
			<div className="absolute inset-0 bg-white/[0.03] backdrop-blur-sm rounded-full border border-white/[0.05] shadow-lg" />
			<div className="relative p-2 nav-link-icon text-white/80 hover:text-white transition-all duration-300 hover:text-shadow-[0_0_12px_rgba(255,255,255,0.7)] non-selectable flex items-center justify-center">
				<span className="text-sm font-bold">
					{language === "en" ? "ES" : "EN"}
				</span>
			</div>
		</motion.div>
	);
}
