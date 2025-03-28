import { getTranslation } from "@/utils/translations";
import { Language } from "@/hooks/LanguageContext";

import enTranslations from "../translations/en.json";
import esTranslations from "../translations/es.json";

export const quotes = {
	en: enTranslations.quotes,
	es: esTranslations.quotes,
};

export const defaultQuotes = enTranslations.quotes;

export const getTranslatedQuotes = (language: Language) => {
	return quotes[language].map((quote) => getTranslation(language, quote));
};

export const shuffleArray = (array: string[]) => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const getShuffledQuotes = (language: Language) => {
	const translatedQuotes = getTranslatedQuotes(language);
	return shuffleArray(translatedQuotes);
};
