"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface StarProps {
	x: number;
	y: number;
	radius: number;
	opacity: number;
	twinkleSpeed: number | null;
	depth: number;
	color: string;
	baseX: number;
	baseY: number;
	movementSpeed: number;
	movementAngle: number;
}

interface StarBackgroundProps {
	starDensity?: number;
	allStarsTwinkle?: boolean;
	twinkleProbability?: number;
	minTwinkleSpeed?: number;
	maxTwinkleSpeed?: number;
	className?: string;
}

const easeInOutSine = (x: number): number => {
	return -(Math.cos(Math.PI * x) - 1) / 2;
};

const getStarColor = (): string => {
	const colors = [
		"rgba(220, 220, 220, ",
		"rgba(220, 220, 180, ",
		"rgba(180, 180, 220, ",
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

export const StarsBackground: React.FC<StarBackgroundProps> = ({
	starDensity = 0.00008,
	allStarsTwinkle = true,
	twinkleProbability = 0.7,
	minTwinkleSpeed = 0.5,
	maxTwinkleSpeed = 1,
	className,
}) => {
	const [stars, setStars] = useState<StarProps[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mousePosition = useRef({ x: 0, y: 0 });
	const targetMousePosition = useRef({ x: 0, y: 0 });
	const lastTime = useRef(performance.now());

	const generateStars = useCallback(
		(width: number, height: number): StarProps[] => {
			const area = width * height;
			const numStars = Math.floor(area * starDensity);
			return Array.from({ length: numStars }, () => {
				const shouldTwinkle =
					allStarsTwinkle || Math.random() < twinkleProbability;
				const x = Math.random() * width;
				const y = Math.random() * height;
				const baseRadius = Math.random() * 0.08 + 0.3;
				return {
					x,
					y,
					baseX: x,
					baseY: y,
					radius: baseRadius,
					opacity: Math.random() * 0.4 + 0.6,
					twinkleSpeed: shouldTwinkle
						? minTwinkleSpeed +
							Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
						: null,
					depth: Math.random() * 0.5 + 0.5,
					color: getStarColor(),
					movementSpeed: Math.random() * 0.008 + 0.004,
					movementAngle: Math.random() * Math.PI * 2,
				};
			});
		},
		[
			starDensity,
			allStarsTwinkle,
			twinkleProbability,
			minTwinkleSpeed,
			maxTwinkleSpeed,
		],
	);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (canvasRef.current) {
				const rect = canvasRef.current.getBoundingClientRect();
				targetMousePosition.current = {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				};
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		const updateStars = () => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				const { width, height } = canvas.getBoundingClientRect();
				canvas.width = width;
				canvas.height = height;
				setStars(generateStars(width, height));
			}
		};

		updateStars();

		const resizeObserver = new ResizeObserver(updateStars);
		if (canvasRef.current) {
			resizeObserver.observe(canvasRef.current);
		}

		return () => {
			if (canvasRef.current) {
				resizeObserver.unobserve(canvasRef.current);
			}
		};
	}, [
		starDensity,
		allStarsTwinkle,
		twinkleProbability,
		minTwinkleSpeed,
		maxTwinkleSpeed,
		generateStars,
	]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;

		const render = (currentTime: number) => {
			const _deltaTime = Math.min((currentTime - lastTime.current) / 1000, 0.1);
			lastTime.current = currentTime;

			const smoothingFactor = 0.08;
			mousePosition.current = {
				x:
					mousePosition.current.x +
					(targetMousePosition.current.x - mousePosition.current.x) *
						smoothingFactor,
				y:
					mousePosition.current.y +
					(targetMousePosition.current.y - mousePosition.current.y) *
						smoothingFactor,
			};

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const sortedStars = [...stars].sort((a, b) => a.depth - b.depth);

			sortedStars.forEach((star) => {
				const centerX = canvas.width / 2;
				const centerY = canvas.height / 2;
				const mouseX = mousePosition.current.x;
				const mouseY = mousePosition.current.y;

				const movement = star.movementSpeed * 0.02;
				star.baseX += Math.cos(star.movementAngle) * movement;
				star.baseY += Math.sin(star.movementAngle) * movement;

				if (star.baseX < 0) star.baseX = canvas.width;
				if (star.baseX > canvas.width) star.baseX = 0;
				if (star.baseY < 0) star.baseY = canvas.height;
				if (star.baseY > canvas.height) star.baseY = 0;

				const parallaxX = (mouseX - centerX) * 0.015 * star.depth;
				const parallaxY = (mouseY - centerY) * 0.015 * star.depth;

				star.x = star.baseX + parallaxX;
				star.y = star.baseY + parallaxY;

				if (star.twinkleSpeed !== null) {
					const time = (currentTime * 0.001) / star.twinkleSpeed;
					const easedValue = easeInOutSine(Math.sin(time));
					star.opacity = 0.3 + Math.abs(easedValue * 0.5);
				}

				const gradient = ctx.createRadialGradient(
					star.x,
					star.y,
					0,
					star.x,
					star.y,
					star.radius * 4,
				);
				gradient.addColorStop(0, `${star.color}${star.opacity})`);
				gradient.addColorStop(1, `${star.color}0)`);

				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
				ctx.fillStyle = gradient;
				ctx.fill();

				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
				ctx.fillStyle = `${star.color}${star.opacity})`;
				ctx.fill();

				const spikeLength = star.radius * 3;
				const spikeWidth = star.radius * 0.3;
				const spikeOpacity = star.opacity * 0.3;

				ctx.save();
				ctx.translate(star.x, star.y);
				ctx.rotate(Math.PI / 4);

				for (let i = 0; i < 4; i++) {
					ctx.rotate(Math.PI / 2);
					ctx.beginPath();
					ctx.moveTo(-spikeWidth, 0);
					ctx.lineTo(spikeWidth, 0);
					ctx.lineTo(spikeWidth, spikeLength);
					ctx.lineTo(-spikeWidth, spikeLength);
					ctx.closePath();
					ctx.fillStyle = `${star.color}${spikeOpacity})`;
					ctx.fill();
				}

				ctx.restore();
			});

			animationFrameId = requestAnimationFrame(render);
		};

		render(performance.now());

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [stars]);

	return (
		<canvas
			ref={canvasRef}
			className={cn("h-full w-full absolute inset-0 object-cover", className)}
			style={{ maxWidth: "1920px", maxHeight: "1080px" }}
		/>
	);
};
