export const quotes = [
	"Developer making modern interfaces and designs with ease.",
	"Creating designs while being focused on aesthetics and user experience.",
	"Programming, UI/UX design and making intuitive user experiences.",
	"Designing and developing user-friendly interfaces and experiences.",
	"Building interfaces that tell stories and sometimes solve problems too.",
	"Modern minimalist designs that are both beautiful and functional.",
	"Passionate Cybersecurity enthusiast and full-stack developer.",
];

export const shuffleArray = (array: string[]) => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const shuffledQuotes = shuffleArray(quotes);
