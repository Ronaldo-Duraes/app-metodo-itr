import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import ReactPlayer from 'react-player';

/* ───────────────────────────────────────────────
   VÍDEOS DE DEPOIMENTO — adicione/remova aqui
   ─────────────────────────────────────────────── */
const videos = [
    { id: 'ZWeW5_f6KA0' },
    { id: 'cBJMf6Mj2pI' },
    { id: '4amM1464bB8' },
    { id: 'FKsz-C5U4dE' },
];

const AUTO_ADVANCE_MS = 10000;

/* ── Hook para detectar breakpoint ── */
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        setIsMobile(mql.matches);
        return () => mql.removeEventListener('change', handler);
    }, [breakpoint]);
    return isMobile;
}

/* ── Player individual para cada vídeo ── */
function VideoCard({ videoId, globalIndex, onPlayingChange, activePlayingIndex, pauseAll }) {
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [showThumbnail, setShowThumbnail] = useState(true);

    // Reinicia este vídeo se outro começou a tocar
    useEffect(() => {
        if (activePlayingIndex !== null && activePlayingIndex !== globalIndex && !showThumbnail) {
            const el = playerRef.current;
            if (el) {
                el.pause();
                el.currentTime = 0;
            }
            setIsPlaying(false);
            setPlayed(0);
            setShowThumbnail(true);
        }
    }, [activePlayingIndex]);

    // Reinicia quando o carrossel navega (volta thumbnail)
    useEffect(() => {
        if (pauseAll > 0 && !showThumbnail) {
            const el = playerRef.current;
            if (el) {
                el.pause();
                el.currentTime = 0;
            }
            setIsPlaying(false);
            setPlayed(0);
            setShowThumbnail(true);
            onPlayingChange?.(false);
        }
    }, [pauseAll]);

    const handlePlay = () => {
        setShowThumbnail(false);
        const el = playerRef.current;
        if (el) {
            el.muted = false;
            el.play();
            setIsPlaying(true);
            onPlayingChange?.(true);
        }
    };

    const handleTogglePlay = (e) => {
        e.stopPropagation();
        const el = playerRef.current;
        if (!el) return;
        if (el.paused) {
            el.play();
            setIsPlaying(true);
            onPlayingChange?.(true);
        } else {
            el.pause();
            setIsPlaying(false);
            onPlayingChange?.(false);
        }
    };

    const handleRestart = (e) => {
        e.stopPropagation();
        const el = playerRef.current;
        if (el) {
            el.currentTime = 0;
            el.play();
            setIsPlaying(true);
            onPlayingChange?.(true);
            setPlayed(0);
        }
    };

    const handleTimeUpdate = () => {
        const el = playerRef.current;
        if (el && el.duration) {
            setPlayed(el.currentTime / el.duration);
        }
    };

    const handleSeek = (e) => {
        const el = playerRef.current;
        if (!el || !el.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        el.currentTime = pct * el.duration;
        setPlayed(pct);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        onPlayingChange?.(false);
        setPlayed(1);
    };

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    return (
        <div className="relative aspect-[9/16] rounded-xl md:rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl group/card">
            {/* ReactPlayer — escondido atrás do overlay */}
            <div className="absolute inset-0 z-0 scale-[1.08]">
                <ReactPlayer
                    ref={playerRef}
                    src={url}
                    width="100%"
                    height="100%"
                    muted={showThumbnail}
                    autoPlay={false}
                    controls={false}
                    playsInline={true}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    config={{
                        youtube: {
                            playerVars: {
                                autoplay: 0,
                                mute: 1,
                                modestbranding: 1,
                                showinfo: 0,
                                rel: 0,
                                controls: 0,
                                disablekb: 1,
                                fs: 0,
                                playsinline: 1,
                                cc_load_policy: 0,
                                iv_load_policy: 3,
                            },
                        },
                    }}
                />
            </div>

            {/* Thumbnail overlay — mostra até o user clicar em play */}
            {showThumbnail && (
                <button
                    onClick={handlePlay}
                    data-track={`play-depoimento-${globalIndex + 1}`}
                    className="absolute inset-0 z-20 w-full h-full cursor-pointer group/thumb"
                    aria-label={`Assistir depoimento ${globalIndex + 1}`}
                >
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={`Depoimento ${globalIndex + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/15 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover/thumb:scale-110 group-hover/thumb:bg-white/30 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                            <Play className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white fill-white ml-0.5" />
                        </div>
                    </div>
                </button>
            )}

            {/* Controles customizados */}
            {!showThumbnail && (
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                    style={{ opacity: isPlaying ? undefined : 1 }}
                >
                    {/* Barra de progresso */}
                    <div
                        className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-3 group/bar"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-emerald-400 rounded-full relative transition-[width] duration-100"
                            style={{ width: `${played * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-md" />
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleTogglePlay}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={isPlaying ? 'Pausar' : 'Play'}
                        >
                            {isPlaying
                                ? <Pause className="w-3.5 h-3.5 text-white" />
                                : <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            }
                        </button>
                        <button
                            onClick={handleRestart}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Reiniciar"
                        >
                            <RotateCcw className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Bloqueio de cliques no player do YouTube */}
            {!showThumbnail && (
                <div
                    className="absolute inset-0 z-10"
                    onClick={handleTogglePlay}
                    style={{ cursor: 'pointer' }}
                />
            )}
        </div>
    );
}

/* ── Carrossel principal (loop infinito — 1 por vez) ── */
export default function VideoTestimonials() {
    const isMobile = useIsMobile();
    const visible = isMobile ? 1 : 3;
    const total = videos.length;

    // Clones: adicionamos `visible` itens no começo e no fim pra criar o loop
    const clonedVideos = [
        ...videos.slice(-visible),
        ...videos,
        ...videos.slice(0, visible),
    ];

    const [pos, setPos] = useState(visible);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [anyPlaying, setAnyPlaying] = useState(false);
    const [activePlayingIndex, setActivePlayingIndex] = useState(null);
    const [pauseAll, setPauseAll] = useState(0);
    const timerRef = useRef(null);

    const cardWidth = 100 / visible;
    const realIndex = ((pos - visible) % total + total) % total;

    /* ── Quando a transição acaba nos clones, pula silenciosamente ── */
    const handleTransitionEnd = () => {
        if (pos <= visible - 1) {
            setIsTransitioning(false);
            setPos(pos + total);
        } else if (pos >= total + visible) {
            setIsTransitioning(false);
            setPos(pos - total);
        }
    };

    useEffect(() => {
        if (!isTransitioning) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true);
                });
            });
        }
    }, [isTransitioning]);

    /* ── Auto-advance ── */
    const resetTimer = useCallback(() => {
        clearTimeout(timerRef.current);
        if (!anyPlaying && total > visible) {
            timerRef.current = setTimeout(() => {
                setPos((p) => p + 1);
            }, AUTO_ADVANCE_MS);
        }
    }, [anyPlaying, total, visible]);

    useEffect(() => {
        resetTimer();
        return () => clearTimeout(timerRef.current);
    }, [pos, resetTimer]);

    const next = () => { setPauseAll((c) => c + 1); setAnyPlaying(false); setPos((p) => p + 1); };
    const prev = () => { setPauseAll((c) => c + 1); setAnyPlaying(false); setPos((p) => p - 1); };

    /* ── Swipe ── */
    const touchStart = useRef(0);
    const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    };

    // Reseta ao mudar breakpoint
    useEffect(() => {
        setIsTransitioning(false);
        setPos(visible);
    }, [visible]);

    return (
        <div
            className="relative w-full max-w-5xl mx-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Track */}
            <div className="overflow-hidden rounded-2xl">
                <div
                    className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                    style={{ transform: `translateX(-${pos * cardWidth}%)` }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {clonedVideos.map((video, i) => {
                        const ri = ((i - visible) % total + total) % total;
                        return (
                            <div
                                key={`slide-${i}`}
                                className="flex-shrink-0 px-1 md:px-2"
                                style={{ width: `${cardWidth}%` }}
                            >
                                <VideoCard
                                    videoId={video.id}
                                    globalIndex={ri}
                                    activePlayingIndex={activePlayingIndex}
                                    pauseAll={pauseAll}
                                    onPlayingChange={(playing) => {
                                        setAnyPlaying(playing);
                                        setActivePlayingIndex(playing ? ri : null);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Setas */}
            {total > visible && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] flex items-center justify-center text-white hover:bg-white/[0.12] hover:border-white/[0.2] transition-all duration-200 cursor-pointer"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] flex items-center justify-center text-white hover:bg-white/[0.12] hover:border-white/[0.2] transition-all duration-200 cursor-pointer"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots — um por vídeo */}
            {total > visible && (
                <div className="flex justify-center gap-2 mt-6">
                    {videos.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPos(i + visible)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === realIndex
                                ? 'w-8 bg-emerald-400'
                                : 'w-1.5 bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Vídeo ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
