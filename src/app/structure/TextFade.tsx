"use client";
import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { useInview } from "@/lib/animateInscroll";

export const TextFade = ({
	words,
	className,
	filter = true,
	duration,
	fullLoadedDuration,
	slideDirection,
	slideDistance = 20,
}: {
	words: string;
	className?: string;
	filter?: boolean;
	duration?: number;
	fullLoadedDuration?: number;
	slideDirection?: "up" | "down" | "left" | "right";
	slideDistance?: number;
}) => {
	const [scope, animate] = useAnimate();
	const isInView = useInview(scope);
	const mounted = useRef(false);

	useEffect(() => {
		if (isInView) {
			const currentDuration = !mounted.current
				? (fullLoadedDuration ?? duration)
				: duration;

			animate(
				"span",
				{
					opacity: 1,
					filter: filter ? "blur(0px)" : "none",
					y: 0,
					x: 0,
				},
				{
					duration: currentDuration,
					delay: stagger(0.2),
				},
			);
		}
		mounted.current = true;
	}, [
		animate,
		duration,
		filter,
		fullLoadedDuration,
		isInView,
		slideDirection,
		slideDistance,
	]);

	const renderWords = () => {
		const initialY =
			slideDirection === "up"
				? slideDistance
				: slideDirection === "down"
					? -slideDistance
					: 0;
		const initialX =
			slideDirection === "left"
				? slideDistance
				: slideDirection === "right"
					? -slideDistance
					: 0;

		return (
			<motion.div ref={scope}>
				<motion.span
					className="opacity-0"
					style={{
						filter: filter ? "blur(10px)" : "none",
						y: initialY,
						x: initialX,
					}}
				>
					{words}
				</motion.span>
			</motion.div>
		);
	};

	return (
		<div className={`font-bold ${className || ""}`}>
			<div className="mt-4">
				<div className="leading-snug tracking-wide">{renderWords()}</div>
			</div>
		</div>
	);
};
