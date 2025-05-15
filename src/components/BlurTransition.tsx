"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface BlurTransitionProps {
    children: React.ReactNode;
    isVisible?: boolean;
    duration?: number;
    className?: string;
}

const BlurTransition = memo(({
    children,
    isVisible = true,
    duration = 0.3,
    className = ""
}: BlurTransitionProps) => {
    return (
        <motion.div
            initial={{ filter: "blur(8px)", opacity: 0 }}
            animate={{
                filter: isVisible ? "blur(0px)" : "blur(8px)",
                opacity: isVisible ? 1 : 0
            }}
            transition={{
                duration,
                filter: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                }
            }}
            className={`will-change-[filter,opacity] ${className}`}
            style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translate3d(0, 0, 0)",
                WebkitTransform: "translate3d(0, 0, 0)"
            }}
        >
            {children}
        </motion.div>
    );
});

BlurTransition.displayName = "BlurTransition";

export default BlurTransition;