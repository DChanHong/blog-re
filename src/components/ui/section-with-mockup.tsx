"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionWithMockupProps {
    leftNode: React.ReactNode;
    rightNode: React.ReactNode;
    reverseLayout?: boolean;
}

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
    leftNode,
    rightNode,
    reverseLayout = false,
}) => {

    const containerVariants = {
        hidden: {},
        visible: {
             transition: {
                staggerChildren: 0.2,
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
    };

    const layoutClasses = reverseLayout
        ? "md:grid-cols-2 md:grid-flow-col-dense"
        : "md:grid-cols-2";

    const textOrderClass = reverseLayout ? "md:col-start-2" : "";
    const imageOrderClass = reverseLayout ? "md:col-start-1" : "";


    return (
        <section className="relative py-24 md:py-48 overflow-hidden z-[5]">
            <div className="container max-w-[1800px] w-full px-6 md:px-10 relative z-10 mx-auto">
                <motion.div
                     className={`grid grid-cols-1 gap-16 md:gap-8 w-full items-center ${layoutClasses}`}
                     variants={containerVariants}
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Left Content (Text area in original) */}
                    <motion.div
                        className={`flex flex-col items-start gap-4 mt-10 md:mt-0 w-full mx-auto md:mx-0 ${textOrderClass}`}
                        variants={itemVariants}
                    >
                        {leftNode}
                    </motion.div>

                    {/* Right Content (Mockup area in original) */}
                    <motion.div
                        className={`relative mt-10 md:mt-0 mx-auto ${imageOrderClass} w-full`}
                        variants={itemVariants}
                    >
                        {/* Decorative Background Element */}
                        <motion.div
                             className={`absolute w-full h-full bg-[#090909] rounded-[32px] z-0`}
                             style={{
                                top: reverseLayout ? 'auto' : '10%',
                                bottom: reverseLayout ? '10%' : 'auto',
                                left: reverseLayout ? 'auto' : '-10%',
                                right: reverseLayout ? '-10%' : 'auto',
                                transform: reverseLayout ? 'translate(0, 0)' : 'translateY(10%)',
                                filter: 'blur(20px)',
                                opacity: 0.5
                            }}
                            initial={{ y: reverseLayout ? 0 : 0 }}
                            whileInView={{ y: reverseLayout ? -20 : -30 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}
                        />

                        {/* Main Mockup Card Container */}
                        <motion.div
                            className="relative w-full bg-[#ffffff0a] rounded-[32px] backdrop-blur-[15px] backdrop-brightness-[100%] border-0 z-10 overflow-hidden min-h-[400px]"
                            initial={{ y: reverseLayout ? 0 : 0 }}
                            whileInView={{ y: reverseLayout ? 20 : 30 }}
                             transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                             viewport={{ once: true, amount: 0.5 }}
                        >
                            <div className="p-6 h-full w-full">
                                {rightNode}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative bottom gradient */}
            <div
                className="absolute w-full h-px bottom-0 left-0 z-0"
                style={{
                    background:
                        "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)",
                }}
            />
        </section>
    );
};

export default SectionWithMockup;
