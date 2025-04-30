"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="w-full h-full min-h-[100px] flex items-center justify-center">
            <motion.div
                className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
}