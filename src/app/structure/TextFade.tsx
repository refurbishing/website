"use client";
import { useEffect, useRef, memo } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { useInview } from "@/lib/animateInscroll";

const TextFade = memo(({
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
	const animationRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (isInView) {
			const currentDuration = !mounted.current
				? (fullLoadedDuration ?? duration)
				: duration;

			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}

			animationRef.current = requestAnimationFrame(() => {
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
					}
				);
			});
		}
		mounted.current = true;

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [animate, duration, filter, fullLoadedDuration, isInView, slideDirection, slideDistance]);

	const initialY = slideDirection === "up" ? slideDistance
		: slideDirection === "down" ? -slideDistance
			: 0;

	const initialX = slideDirection === "left" ? slideDistance
		: slideDirection === "right" ? -slideDistance
			: 0;

	return (
		<div className={`font-bold ${className || ""}`}>
			<div className="mt-4">
				<div className="leading-snug tracking-wide">
					<motion.div ref={scope} className="will-change-[opacity,transform] transform-gpu">
						<motion.span
							className="opacity-0"
							style={{
								filter: filter ? "blur(10px)" : "none",
								y: initialY,
								x: initialX,
								transform: "translate3d(0,0,0)",
								backfaceVisibility: "hidden"
							}}
						>
							{words}
						</motion.span>
					</motion.div>
				</div>
			</div>
		</div>
	);
});

TextFade.displayName = "TextFade";

export { TextFade };
