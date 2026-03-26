import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Botão com efeito "Glow" e Hover Magnético
export const MagneticButton = ({ children, onClick, className = '' }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPos = e.clientX - rect.left - rect.width / 2;
        const yPos = e.clientY - rect.top - rect.height / 2;
        x.set(xPos * 0.2); // Fator de atração
        y.set(yPos * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ x, y }}
            onClick={onClick}
            className={`relative group ${className} outline-none border-none`}
        >
            {/* Brilho de fundo rotativo - sem overflow hidden no pai para evitar artefatos */}
            <div className="absolute inset-[-4px] bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-full"></div>

            {/* Corpo do botão */}
            <div className="relative z-10 flex items-center justify-center bg-emerald-500 text-white px-5 py-3 md:px-8 md:py-4 rounded-full font-extrabold text-sm md:text-lg shadow-[0_4px_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.6)] transition-shadow">
                {children}
            </div>
        </motion.button>
    );
};

// Card 3D que rotaciona conforme o mouse (Tilt Effect)
export const TiltCard = ({ children, className = '' }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useTransform(x, [-100, 100], [-10, 10]);
    const mouseYSpring = useTransform(y, [-100, 100], [10, -10]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Distância do centro
        x.set(e.clientX - rect.left - centerX);
        y.set(e.clientY - rect.top - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: mouseYSpring,
                rotateY: mouseXSpring,
                perspective: 1000
            }}
            className={`relative rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl shrink-0 overflow-hidden ${className}`}
        >
            {/* Reflexo sutil acompanhando o mouse */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [x, y],
                        ([latestX, latestY]) => `radial-gradient(600px circle at ${latestX + 150}px ${latestY + 150}px, rgba(16,185,129,0.1), transparent 40%)`
                    )
                }}
            />
            {children}
        </motion.div>
    );
};
