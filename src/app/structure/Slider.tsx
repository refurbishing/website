export const Slider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<div className="relative flex max-w-[90vw] overflow-hidden py-0.5">
			<div className="flex w-max animate-slider gap-4 hover:pause-animation">
				{children}
				{children}
			</div>
		</div>
	);
};
