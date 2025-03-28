"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguage } from "@/hooks/LanguageContext";
import { ReactNode, useEffect, useState } from "react";

import esMessages from "@/translations/es.json";
import enMessages from "@/translations/en.json";

const messages: Record<string, any> = {
	es: esMessages,
	en: enMessages,
};

export function IntlProvider({ children }: { children: ReactNode }) {
	const { language } = useLanguage();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const messagesWithFallback = {
		...(messages[language as keyof typeof messages] || messages.es),
	};

	return (
		<NextIntlClientProvider
			locale={language}
			messages={messagesWithFallback}
			onError={(error) => {
				if (error.code === "MISSING_MESSAGE") {
					return undefined;
				}
				throw error;
			}}
		>
			{children}
		</NextIntlClientProvider>
	);
}
