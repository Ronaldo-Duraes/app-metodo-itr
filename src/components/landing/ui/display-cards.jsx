import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function DisplayCard({
    className,
    icon = <Sparkles className="size-4 text-blue-300" />,
    title = "Featured",
    description = "Discover amazing content",
    date = "Just now",
    iconClassName = "text-blue-500",
    titleClassName = "text-blue-500",
    index = 0,
    stackX = 0,
    stackY = 0,
}) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, x: stackX, y: stackY + 20 }}
            whileInView={{ scale: 1, opacity: 1, x: stackX, y: stackY }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                delay: index * 0.5,
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
            className={cn(
                "relative flex h-auto min-h-[7rem] w-[22rem] sm:w-[26rem] select-none flex-col justify-start rounded-2xl border border-emerald-900/50 bg-[#0b141a]/90 shadow-2xl backdrop-blur-md px-5 py-4 transition-all duration-700 hover:border-emerald-500/30 hover:bg-[#111b21]/95",
                className
            )}
        >
            <div className="flex items-center gap-3 mb-2">
                <span className={cn("relative flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-emerald-900/40 border border-emerald-800", iconClassName)}>
                    {icon}
                </span>
                <div className="flex flex-col">
                    <p className={cn("text-[15px] font-semibold tracking-tight", titleClassName)}>{title}</p>
                    <p className="text-slate-400 text-[11px] leading-none uppercase tracking-wider font-medium">{date}</p>
                </div>
            </div>
            <p className="whitespace-normal text-[15px] leading-relaxed mt-1 text-slate-200 break-words pl-[52px]">
                {description}
            </p>
        </motion.div>
    );
}

export default function DisplayCards({ cards }) {
    const displayCards = cards || [];

    return (
        <div className="grid [grid-template-areas:'stack'] place-items-center">
            {displayCards.map((cardProps, index) => (
                <DisplayCard key={index} index={index} {...cardProps} />
            ))}
        </div>
    );
}
