"use client";
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

export type Language = "en" | "es";

interface LanguageContextType {
	language: Language;
	toggleLanguage: () => void;
	setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>("en");

	useEffect(() => {
		const savedLanguage = localStorage.getItem("language") as Language;
		if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
			setLanguage(savedLanguage);
		}
	}, []);

	const toggleLanguage = () => {
		setLanguage((prevLang) => {
			const newLang = prevLang === "en" ? "es" : "en";
			localStorage.setItem("language", newLang);
			return newLang;
		});
	};

	return (
		<LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}
