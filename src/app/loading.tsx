"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 animate-gradient"
                animate={{
                    background: [
                        "linear-gradient(135deg, rgb(24, 24, 27) 0%, rgb(0, 0, 0) 50%, rgb(24, 24, 27) 100%)",
                        "linear-gradient(225deg, rgb(24, 24, 27) 0%, rgb(0, 0, 0) 50%, rgb(24, 24, 27) 100%)",
                        "linear-gradient(315deg, rgb(24, 24, 27) 0%, rgb(0, 0, 0) 50%, rgb(24, 24, 27) 100%)",
                        "linear-gradient(45deg, rgb(24, 24, 27) 0%, rgb(0, 0, 0) 50%, rgb(24, 24, 27) 100%)",
                        "linear-gradient(135deg, rgb(24, 24, 27) 0%, rgb(0, 0, 0) 50%, rgb(24, 24, 27) 100%)",
                    ]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    backgroundSize: "200% 200%"
                }}
            />
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="p-12 rounded-3xl backdrop-blur-xl bg-white/5 flex flex-col items-center justify-center gap-8 z-10"
                >
                    <motion.div className="relative">
                        <motion.div
                            className="w-16 h-16 border-4 border-white/10 rounded-full"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </motion.div>
                    <motion.div
                        className="flex gap-1"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-white/50 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}