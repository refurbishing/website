"use client";

import Image, { ImageProps } from "next/image";
import { useState, memo } from "react";
import { motion } from "framer-motion";

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
    withBlur?: boolean;
}

const OptimizedImage = memo(({ withBlur = true, className = "", ...props }: OptimizedImageProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative">
            <Image
                {...props}
                className={`${className} transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
            {withBlur && isLoading && (
                <motion.div
                    className="absolute inset-0 bg-zinc-800/50 animate-pulse rounded-[inherit]"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </div>
    );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;