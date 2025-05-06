import { useInView as useFramerInView } from "framer-motion";
import { RefObject } from "react";

export function useInview(ref: RefObject<HTMLElement | null>) {
	const isInView = useFramerInView(ref, { once: true, amount: 0.45 });
	return isInView;
}

export const useInView = useInview;
