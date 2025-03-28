import esTranslations from "@/translations/es.json";
import enTranslations from "@/translations/en.json";
import { Language } from "@/hooks/LanguageContext";

export const translations: Record<Language, any> = {
	es: esTranslations,
	en: enTranslations,
};

export function getTranslation(language: Language, key: string): string {
	const keys = key.split(".");
	let value: any = translations[language];

	for (const k of keys) {
		if (value && typeof value === "object" && k in value) {
			value = value[k];
		} else {
			// If key not found in current language, try fallback to English
			if (language !== "en") {
				let fallbackValue = translations["en"];
				let fallbackFound = true;

				for (const fallbackKey of keys) {
					if (
						fallbackValue &&
						typeof fallbackValue === "object" &&
						fallbackKey in fallbackValue
					) {
						fallbackValue = fallbackValue[fallbackKey];
					} else {
						fallbackFound = false;
						break;
					}
				}

				if (fallbackFound && typeof fallbackValue === "string") {
					return fallbackValue;
				}
			}

			// If all else fails, return the key itself
			return key;
		}
	}

	return typeof value === "string" ? value : key;
}
