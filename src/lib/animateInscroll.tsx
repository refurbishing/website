import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export function useInview(ref: RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(false);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        setIsInView(true);
        hasAnimated.current = true;

        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.45,
    };

    observerRef.current = new IntersectionObserver(callback, options);
    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, callback]);

  return isInView;
}

export const useInView = useInview;