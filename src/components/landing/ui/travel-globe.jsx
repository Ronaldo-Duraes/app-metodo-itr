import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import { cn } from '@/lib/utils';
// Importação direta do mapa baixado (não depende de fetch da internet)
import worldAtlas from '@/components/landing/ui/world-110m.json';

// Cidades da rota para simular a expansão (Inglês) dando a volta ao mundo com hops curtos
const ROUTE = [
    { label: "Você", id: "sp", lat: -23.55, lng: -46.63 }, // São Paulo, BR
    { label: "You", id: "ny", lat: 40.71, lng: -74.00 },   // New York, US
    { label: "You", id: "tor", lat: 43.65, lng: -79.38 },  // Toronto, CA
    { label: "You", id: "lon", lat: 51.50, lng: -0.12 },   // London, UK
    { label: "You", id: "cpt", lat: -33.92, lng: 18.42 },  // Cape Town, ZA
    { label: "You", id: "del", lat: 28.61, lng: 77.21 },   // Delhi, IN
    { label: "You", id: "syd", lat: -33.87, lng: 151.21 }, // Sydney, AU
    { label: "You", id: "akl", lat: -36.84, lng: 174.76 }, // Auckland, NZ
    { label: "You", id: "la", lat: 34.05, lng: -118.24 },  // Los Angeles, US
    { label: "You", id: "mex", lat: 19.43, lng: -99.13 }   // Mexico City, MX (e volta pro BR)
];

export function TravelGlobe({
    className,
    size = 600,
    globeColor = "rgba(4, 47, 46, 0.4)", // Teal 950 com opacidade pro fundo
    countryStroke = "rgba(16, 185, 129, 0.4)", // Emerald 500
    trailColor = "rgba(52, 211, 153, 0.5)", // Teal 400
    activeColor = "#34d399",
    autoRotateSpeed = 0.003
}) {
    const canvasRef = useRef(null);
    const worldRef = useRef(null);
    const rotationRef = useRef([0, -15, 0]); // Começa focando Brasil
    const timeRef = useRef(0);

    // Controle de Animação 
    const stateRef = useRef({
        currentIndex: 0,
        progress: 0, // 0 a 1 (andando no trajeto)
        currentPause: 60, // frames pausados na origem
        pulses: []
    });

    const lerp = useCallback((a, b, t) => a + (b - a) * t, []);
    // Easing function natively
    const easeCubicInOut = useCallback((t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, []);

    useEffect(() => {
        // Processa o mapa estático já na montagem
        worldRef.current = topojson.feature(worldAtlas, worldAtlas.objects.countries);
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        if (canvas.width !== w * dpr) canvas.width = w * dpr;
        if (canvas.height !== h * dpr) canvas.height = h * dpr;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const radius = Math.min(w, h) * 0.4;
        const cx = w / 2;
        const cy = h / 2;

        const projection = d3.geoOrthographic()
            .translate([cx, cy])
            .scale(radius)
            .rotate(rotationRef.current);

        const pathGenerator = d3.geoPath().projection(projection).context(ctx);

        timeRef.current += 1; // frame counter geral

        // Limpa canvas
        ctx.clearRect(0, 0, w, h);

        // Esfera (Oceano)
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = globeColor;
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Desenha Países
        if (worldRef.current) {
            ctx.beginPath();
            pathGenerator(worldRef.current);
            ctx.fillStyle = "rgba(2, 44, 34, 0.6)"; // Teal-950/Teal-900 misturado
            ctx.fill();
            ctx.strokeStyle = countryStroke;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        const s = stateRef.current;

        // Auto rotation base
        rotationRef.current[0] += autoRotateSpeed * 30;

        // Lógica da Viagem 
        if (s.currentPause > 0) {
            s.currentPause--;
        } else {
            s.progress += 0.006;
            if (s.progress >= 1) {
                s.progress = 0;
                s.currentIndex = (s.currentIndex + 1) % ROUTE.length;
                s.currentPause = 60; // Pausa no destino

                // Pouso! Pulse ring
                const city = ROUTE[s.currentIndex];
                s.pulses.push({
                    lng: city.lng, lat: city.lat,
                    radius: 0, alpha: 1
                });
            }
        }

        const cityA = ROUTE[s.currentIndex];
        const cityB = ROUTE[(s.currentIndex + 1) % ROUTE.length];

        // Força a câmera do D3 ir acompanhando a viagem (easing pra suavizar)
        const tCamera = s.currentPause > 0 ? 0 : easeCubicInOut(s.progress);
        const cameraTarget = d3.geoInterpolate([cityA.lng, cityA.lat], [cityB.lng, cityB.lat])(tCamera);

        // Força a câmera do D3 ir acompanhando a viagem
        rotationRef.current[0] += (-cameraTarget[0] - rotationRef.current[0]) * 0.04;
        rotationRef.current[1] += (-cameraTarget[1] - rotationRef.current[1]) * 0.04;

        // --- Lógica da Rota 2D Lateralizada Especial ---
        const mathProj = d3.geoOrthographic()
            .translate([cx, cy])
            .scale(radius)
            .rotate(rotationRef.current)
            .clipAngle(null); // pega posições visíveis ou não

        const camLng = -rotationRef.current[0];
        const camLat = -rotationRef.current[1];

        const isVisible = (lng, lat) => {
            const dist = d3.geoDistance([lng, lat], [camLng, camLat]);
            return dist <= Math.PI / 2 + 0.1; // 0.1 de tolerância para o horizonte
        };

        const ptA = mathProj([cityA.lng, cityA.lat]);
        const ptB = mathProj([cityB.lng, cityB.lat]);
        let cpX = cx, cpY = cy;

        if (ptA && ptB) {
            // Ponto Central do Segmento em 2D
            const midX = (ptA[0] + ptB[0]) / 2;
            const midY = (ptA[1] + ptB[1]) / 2;

            // Distância no Canvas
            const dx = ptB[0] - ptA[0];
            const dy = ptB[1] - ptA[1];
            const dist2D = Math.sqrt(dx * dx + dy * dy);

            // Vetor do Centro do Globo pro Meio da Reta removido!
            // Vamos usar apenas a normal geométrica da reta bidimensional.
            // Ao girar a terra, a reta gira, e o vetor normal gira rigidamente junto.
            let nx = -dy / dist2D;
            let ny = dx / dist2D;

            // Elevação do Arco
            const arcHeight = dist2D * 0.35;
            cpX = midX + nx * arcHeight;
            cpY = midY + ny * arcHeight;

            // Desenha Linha Interativa
            // Checa se pelo menos um dos pontos tá visível (ou desenhar mesmo assim se quiser deixar ir pro fundo)
            // Apenas desenhamos a pontilhada inteira se pelo menos o midpoint tá quase visível
            const midLngLat = d3.geoInterpolate([cityA.lng, cityA.lat], [cityB.lng, cityB.lat])(0.5);

            if (isVisible(midLngLat[0], midLngLat[1]) || isVisible(cityA.lng, cityA.lat) || isVisible(cityB.lng, cityB.lat)) {
                ctx.beginPath();
                ctx.strokeStyle = trailColor;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.lineDashOffset = -(timeRef.current * 0.5);
                ctx.moveTo(ptA[0], ptA[1]);
                ctx.quadraticCurveTo(cpX, cpY, ptB[0], ptB[1]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // --- Renderiza Pulses do destino (Ondinhas) ---
        for (let i = s.pulses.length - 1; i >= 0; i--) {
            const p = s.pulses[i];
            p.radius += 0.8;
            p.alpha -= 0.02;

            if (p.alpha <= 0) {
                s.pulses.splice(i, 1);
                continue;
            }

            if (isVisible(p.lng, p.lat)) {
                const ptPulse = mathProj([p.lng, p.lat]);
                if (ptPulse) {
                    ctx.beginPath();
                    ctx.arc(ptPulse[0], ptPulse[1], p.radius, 0, 2 * Math.PI);
                    ctx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0, p.alpha)})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }

        // --- Renderiza o "Avião"/Ponteiro Atual ---
        const pct = s.currentPause > 0 ? 0 : s.progress;

        // Calcula Posição Atual baseada na Curva Bezier Real
        if (ptA && ptB) {
            const currentX = (1 - pct) ** 2 * ptA[0] + 2 * (1 - pct) * pct * cpX + pct ** 2 * ptB[0];
            const currentY = (1 - pct) ** 2 * ptA[1] + 2 * (1 - pct) * pct * cpY + pct ** 2 * ptB[1];

            const currentLngLat = d3.geoInterpolate([cityA.lng, cityA.lat], [cityB.lng, cityB.lat])(pct);

            // Só renderiza o Avião e a Tag se ele estiver na parte da Frente do Globo
            if (isVisible(currentLngLat[0], currentLngLat[1])) {
                // Glow atrás do ponto atual
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(52, 211, 153, 0.4)";
                ctx.fill();

                // Ponto Base
                ctx.beginPath();
                ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
                ctx.fillStyle = activeColor;
                ctx.fill();

                // Desenha a Label flutuando junto com o ponto
                const labelA = cityA.label;
                const labelB = cityB.label;

                ctx.font = "bold 13px system-ui, sans-serif";
                const wA = ctx.measureText(labelA).width;
                const wB = ctx.measureText(labelB).width;

                let activeLabel = labelA;
                let activeW = wA;
                let textAlpha = 1;

                if (labelA !== labelB) {
                    if (pct < 0.5) {
                        activeLabel = labelA;
                        activeW = wA;
                        textAlpha = 1 - (pct * 2); // Fade out 1 -> 0
                    } else {
                        activeLabel = labelB;
                        activeW = wB;
                        textAlpha = (pct - 0.5) * 2; // Fade in 0 -> 1
                    }
                }

                const padX = 8, padY = 4;

                ctx.fillStyle = "rgba(4, 47, 46, 0.9)"; // Fundo ultra escuro
                ctx.beginPath();
                ctx.roundRect(currentX + 12, currentY - 12 - 14, activeW + padX * 2, 14 + padY * 2, 6);
                ctx.fill();
                ctx.strokeStyle = "rgba(52, 211, 153, 0.5)"; // Borda
                ctx.lineWidth = 1;
                ctx.stroke();

                // Label Text
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, textAlpha));
                ctx.fillStyle = activeColor;
                ctx.fillText(activeLabel, currentX + 12 + padX, currentY - 12 - 14 + padY + 11);
                ctx.restore();
            }
        }

        // loop infinito
        requestAnimationFrame(draw);
    }, [globeColor, countryStroke, trailColor, activeColor, autoRotateSpeed, lerp, easeCubicInOut]);

    useEffect(() => {
        let animId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animId);
    }, [draw]);

    return (
        <div className={cn("w-full h-full relative pointer-events-none select-none", className)} style={{ minHeight: size }}>
            <canvas
                ref={canvasRef}
                className="w-full h-full absolute inset-0"
            />
        </div>
    );
}
