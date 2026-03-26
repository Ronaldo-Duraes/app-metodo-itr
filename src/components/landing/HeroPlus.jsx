import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Play, Pause, VolumeX, Volume2, Maximize2, Minimize2 } from 'lucide-react';
import ReactPlayer from 'react-player';
import { MagneticButton } from './Common';
import { TravelGlobe } from './ui/travel-globe';
const videoThumb = '/assets/video-thumb.png';

export default function HeroPlus() {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [played, setPlayed] = useState(0);
    const [videoReady, setVideoReady] = useState(false);
    const playerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Sync fullscreen state when user exits via Esc or browser controls
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        document.addEventListener('webkitfullscreenchange', handler);
        return () => {
            document.removeEventListener('fullscreenchange', handler);
            document.removeEventListener('webkitfullscreenchange', handler);
        };
    }, []);

    const handleInteract = () => {
        setHasInteracted(true);
        setIsPlaying(true);
        // Restart the video from the beginning when the user unmutes
        // ReactPlayer v3 uses youtube-video-element which has HTMLMediaElement API
        const el = playerRef.current;
        if (el) {
            el.currentTime = 0;
            el.muted = false;
            el.play();
        }
    };

    const handlePlayPause = (e) => {
        e.stopPropagation();
        const el = playerRef.current;
        if (el) {
            if (el.paused) {
                el.play();
                setIsPlaying(true);
            } else {
                el.pause();
                setIsPlaying(false);
            }
        }
    };

    // Track progress using native HTMLMediaElement timeupdate event
    const handleTimeUpdate = () => {
        const el = playerRef.current;
        if (el && el.duration) {
            setPlayed(el.currentTime / el.duration);
            if (!videoReady) setVideoReady(true);
        }
    };

    // Calculate non-linear progress for the visual bar.
    // Math.pow(x, 0.4) creates a curve where:
    // 10% real = 40% visual, 30% real = 62% visual, 80% real = 91% visual
    const visualProgress = Math.min(Math.pow(played, 0.4), 1);

    const handleFullscreen = () => {
        const rect = document.getElementById('hero-video-container');
        if (!rect) return;
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        } else {
            // Enter fullscreen
            if (rect.requestFullscreen) {
                rect.requestFullscreen();
            } else if (rect.webkitRequestFullscreen) {
                rect.webkitRequestFullscreen();
            } else if (rect.msRequestFullscreen) {
                rect.msRequestFullscreen();
            }
        }
    };

    return (
        <section data-section="Herói / Início da Página" className="relative flex items-center justify-center overflow-x-clip bg-[#030308] pt-5 pb-10 md:pt-6 md:pb-16 lg:minh-[92vh]">

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUscDAuMDUpIi8+PC9zdmc+')] opacity-20"></div>

            <div className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 items-center">

                {/* Left Column: Copy & CTA */}
                <div className="text-left flex flex-col items-start pt-2 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-2"
                    >
                        <img src="/logo-itr.png" alt="ITR | Inglês em Tempo Recorde" className="h-8 md:h-10" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-2 md:mb-3 tracking-tight"
                    >
                        O Fim da <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 text-glow">
                            Tradução Mental
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-emerald-400 mb-2 md:mb-3 max-w-xl leading-snug md:leading-relaxed font-bold uppercase tracking-widest"
                    >
                        Destrave sua Fluência e Fale Inglês com Naturalidade.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-base md:text-lg text-[#E2E2E2] mb-4 md:mb-6 max-w-xl leading-relaxed font-light"
                    >
                        Descubra o método exato de memorização que desbloqueia a sua mente para aprender dezenas de palavras por dia, eliminando os "brancos" na hora de conversar — mesmo que você já tenha tentado de tudo.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="flex flex-col items-start gap-4 md:gap-6 w-full md:w-auto"
                    >
                        {/* Video Player Area */}
                        <div id="hero-video-container" className="hidden w-full max-w-xl aspect-video relative rounded-2xl overflow-hidden border border-slate-700 bg-black group z-20 shadow-[0_0_50px_-12px_rgba(52,211,153,0.3)]">

                            {/* Video wrapper: Slight overscale to hide YouTube's black edge artifact */}
                            <div className="absolute inset-0 z-0 bg-black scale-[1.02]">
                                <ReactPlayer
                                    ref={playerRef}
                                    src="https://www.youtube.com/watch?v=b0l5aMp5fHc"
                                    width="100%"
                                    height="100%"
                                    autoPlay={true}
                                    muted={!hasInteracted}
                                    controls={false}
                                    playsInline={true}
                                    onTimeUpdate={handleTimeUpdate}
                                    onProgress={({ played }) => {
                                        const percents = [25, 50, 75, 90];
                                        percents.forEach(pct => {
                                            if (played >= pct / 100) {
                                                const key = `vsl_tracked_${pct}`;
                                                if (!window[key]) {
                                                    window[key] = true;
                                                    window.dispatchEvent(new CustomEvent('itr_track', { 
                                                        detail: { type: 'video_progress', label: `${pct}%` } 
                                                    }));
                                                }
                                            }
                                        });
                                    }}
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                autoplay: 1,
                                                mute: 1,
                                                modestbranding: 1,
                                                showinfo: 0,
                                                rel: 0,
                                                controls: 0,
                                                disablekb: 1,
                                                fs: 0,
                                                playsinline: 1,
                                                cc_load_policy: 0,
                                                iv_load_policy: 3
                                            }
                                        }
                                    }}
                                />
                            </div>

                            {/* Custom Thumbnail — shows until video starts playing */}
                            <AnimatePresence>
                                {!videoReady && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 z-[5]"
                                    >
                                        <img
                                            src={videoThumb}
                                            alt="Método ITR"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Protective Invisible Overlay to block interactions after start */}
                            {hasInteracted && (
                                <div
                                    className="absolute inset-0 z-10 w-full h-full cursor-pointer"
                                    onClick={handlePlayPause}
                                />
                            )}

                            {/* Initial Sound overlay (Click to hear) */}
                            <AnimatePresence>
                                {!hasInteracted && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer z-30"
                                        onClick={handleInteract}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse">
                                                <VolumeX className="w-8 h-8 ml-1" />
                                            </div>
                                            <span className="text-white font-bold tracking-wide shadow-black drop-shadow-md">
                                                Toque para ouvir
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Custom Controls Bar */}
                            {hasInteracted && (
                                <div className="absolute inset-x-0 bottom-0 max-h-20 pt-10 pb-4 px-5 bg-gradient-to-t from-black via-black/80 to-transparent z-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4">
                                    <button
                                        onClick={handlePlayPause}
                                        className="text-white hover:text-emerald-400 transition-colors"
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                                    </button>

                                    {/* Fake Progress Bar (Read-only, Non-linear) */}
                                    <div className="flex-1 flex items-center relative h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${visualProgress * 100}%` }}
                                            transition={{ type: "tween", ease: "linear", duration: 0.5 }}
                                        />
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
                                        className="text-white/80 hover:text-white transition-opacity p-1"
                                    >
                                        {isFullscreen
                                            ? <Minimize2 className="w-5 h-5" />
                                            : <Maximize2 className="w-5 h-5" />
                                        }
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center md:items-start gap-3 w-full">
                            <MagneticButton className="w-full md:w-auto text-center" onClick={() => document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })}>
                                <div data-track="cta-hero" className="w-full h-full flex items-center justify-center">
                                    <span className="hidden sm:inline">QUERO ACELERAR MEU INGLÊS AGORA</span>
                                    <span className="sm:hidden">ACELERAR MEU INGLÊS</span>
                                </div>
                            </MagneticButton>
                            <p className="text-[10px] text-[#CCCCCC] font-medium tracking-widest w-full text-center uppercase">
                                Acesso Imediato • 7 Dias de Garantia
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50 w-auto self-center md:self-start justify-center">
                            <div className="flex -space-x-3">
                                <img src="/avatar-social-1.jpg" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" alt="Student" />
                                <img src="/avatar-social-2.jpg" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" alt="Student" />
                                <img src="/avatar-social-3.jpg" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" alt="Student" />
                            </div>
                            <div className="flex flex-col text-left">
                                <div className="flex text-yellow-500 gap-0.5">
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                </div>
                                <span className="text-[10px] text-[#E2E2E2] font-bold tracking-tight whitespace-nowrap">+200 alunos satisfeitos</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Globe 3D */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="hidden lg:flex items-center justify-center relative min-h-[400px]"
                >
                    {/* Add a subtle glow behind the globe to make it pop like the demo */}
                    <div className="absolute w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                    <TravelGlobe size={600} autoRotateSpeed={0.002} />
                </motion.div>

            </div>
        </section>
    );
}
