"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CareerCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    imageSrc: string;
    color?: string; // Icon color wrapper class
}

const CareerCard: React.FC<CareerCardProps> = ({
    title,
    description,
    icon,
    imageSrc,
    color = "text-blue-600",
}) => {
    return (
        <motion.div
            className="group relative flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            {/* Image Section (Left) */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Content Section (Right) */}
            <div className="flex-1 p-4 md:p-6 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-white/10 ${color}`}>
                        {icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white truncate">
                        {title}
                    </h3>
                </div>
                <p className="text-sm md:text-base text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 pointer-events-none transition-all duration-300" />
        </motion.div>
    );
};

export default CareerCard;
