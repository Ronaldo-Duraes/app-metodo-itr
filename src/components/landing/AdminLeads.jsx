import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Activity, Users, MousePointer2, Clock, Smartphone, Monitor, ChevronDown, ChevronUp, Link as LinkIcon, Fingerprint, MapPin, Compass, Globe, Map, Download, Printer, Trash2, Filter, BarChart2, LogOut, Eye, Target, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, CartesianGrid, AreaChart, Area } from 'recharts';

export default function AdminLeads() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('itr_admin_auth') === 'true'
    );
    const [passInput, setPassInput] = useState('');
    const [rawLeads, setRawLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLead, setExpandedLead] = useState(null);
    const [dateFilter, setDateFilter] = useState('7d'); // 'today', '7d', '30d', 'all'
    const [sourceFilter, setSourceFilter] = useState('all');
    const [campaignFilter, setCampaignFilter] = useState('all');
    const [termFilter, setTermFilter] = useState('all'); // Conjunto (utm_term)
    const [contentFilter, setContentFilter] = useState('all'); // Anúncio (utm_content)
    const [mediumFilter, setMediumFilter] = useState('all'); // Posicionamento (utm_medium)

    useEffect(() => {
        if(!isAuthenticated) return;
        const q = query(
            collection(db, 'lead_interactions'),
            orderBy('startTime', 'desc'),
            limit(1000)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetched = [];
            querySnapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() });
            });
            setRawLeads(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching leads:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    const leads = useMemo(() => {
        // This `leads` useMemo now just sorts rawLeads, no filtering here.
        // Filtering will happen in `processedLeads` based on `dateFilter` and `sourceFilter`.
        return rawLeads.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }, [rawLeads]);

    const availableCampaigns = useMemo(() => {
        const camps = new Set();
        const terms = new Set();
        const contents = new Set();
        const mediums = new Set();
        leads.forEach(l => {
            if (l.utm_campaign && l.utm_campaign.trim() !== '') camps.add(l.utm_campaign.trim());
            if (l.utm_term && l.utm_term.trim() !== '') terms.add(l.utm_term.trim());
            if (l.utm_content && l.utm_content.trim() !== '') contents.add(l.utm_content.trim());
            if (l.utm_medium && l.utm_medium.trim() !== '') mediums.add(l.utm_medium.trim());
        });
        return {
            campaigns: Array.from(camps).sort(),
            terms: Array.from(terms).sort(),
            contents: Array.from(contents).sort(),
            mediums: Array.from(mediums).sort()
        };
    }, [leads]);

    // Filter Logic
    const processedLeads = useMemo(() => {
        let filtered = leads;
        if (dateFilter !== 'all') {
            const now = new Date().getTime();
            const limits = { 'today': 86400000, '7d': 86400000 * 7, '30d': 86400000 * 30 };
            filtered = filtered.filter(l => (now - new Date(l.startTime).getTime()) < limits[dateFilter]);
        }
        if (sourceFilter !== 'all') {
            filtered = filtered.filter(l => {
                let s = (l.utm_source || '').toLowerCase();
                if (sourceFilter === 'instagram') return s.includes('instagram') || s.includes('ig');
                if (sourceFilter === 'facebook') return s.includes('facebook') || s.includes('fb');
                if (sourceFilter === 'youtube') return s.includes('youtube') || s.includes('yt');
                if (sourceFilter === 'orgânico') return !l.utm_source || s.includes('orgânico') || s.includes('direct');
                return s.includes(sourceFilter);
            });
        }
        if (campaignFilter !== 'all') {
            filtered = filtered.filter(l => l.utm_campaign && l.utm_campaign.trim() === campaignFilter);
        }
        if (termFilter !== 'all') {
            filtered = filtered.filter(l => l.utm_term && l.utm_term.trim() === termFilter);
        }
        if (contentFilter !== 'all') {
            filtered = filtered.filter(l => l.utm_content && l.utm_content.trim() === contentFilter);
        }
        if (mediumFilter !== 'all') {
            filtered = filtered.filter(l => l.utm_medium && l.utm_medium.trim() === mediumFilter);
        }
        return filtered;
    }, [leads, dateFilter, sourceFilter, campaignFilter, termFilter, contentFilter, mediumFilter]);

    const stats = useMemo(() => {
        let mobileCount = 0;
        let scrollSum = 0;
        let timeSum = 0;
        let clickersCount = 0;

        processedLeads.forEach((data) => {
            if (data.isMobile) mobileCount++;
            scrollSum += (data.maxScrollDepth || 0);
            timeSum += (data.timeOnPageSeconds || 0);
            
            const hasClickEvent = data.journey && data.journey.some(e => e.type === 'click');
            const hasLegacyClick = data.clicks && data.clicks.length > 0;
            if (hasClickEvent || hasLegacyClick) clickersCount++;
        });

        const total = processedLeads.length;
        if(total > 0) {
            return {
                total,
                mobilePerc: Math.round((mobileCount / total) * 100),
                avgScroll: Math.round(scrollSum / total),
                avgTime: Math.round(timeSum / total),
                clickers: clickersCount
            };
        }
        return { total: 0, mobilePerc: 0, avgScroll: 0, avgTime: 0, clickers: 0 };
    }, [processedLeads]);

    // Data for Line Chart (Traffic Volume)
    const dailyData = useMemo(() => {
        const days = {};
        for(let i=9; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days[d.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})] = 0;
        }
        processedLeads.forEach(l => {
            const d = new Date(l.startTime).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'});
            if(days[d] !== undefined) days[d]++;
        });
        return Object.keys(days).map(date => ({ name: date, Visitas: days[date] }));
    }, [processedLeads]);

    // Data for Radar Chart (Sources)
    const sourceData = useMemo(() => {
        const counts = { Instagram: 0, Facebook: 0, Google: 0, TikTok: 0, YouTube: 0, Orgânico: 0 };
        processedLeads.forEach(l => {
            const s = (l.utm_source || '').toLowerCase();
            if (s.includes('instagram') || s.includes('ig')) counts.Instagram++;
            else if (s.includes('facebook') || s.includes('fb')) counts.Facebook++;
            else if (s.includes('google')) counts.Google++;
            else if (s.includes('tiktok')) counts.TikTok++;
            else if (s.includes('youtube') || s.includes('yt')) counts.YouTube++;
            else counts.Orgânico++;
        });
        const max = Math.max(...Object.values(counts), 1);
        return Object.keys(counts).map(key => ({ subject: key, A: counts[key], fullMark: max + (max * 0.2) }));
    }, [processedLeads]);

    // Data for Section Dropoff Bar Chart
    const sectionData = useMemo(() => {
        const counts = { '1. Início': 0, '2. Problema': 0, '3. Método': 0, '4. Prova Social': 0, '5. Oferta': 0 };
        processedLeads.forEach(l => {
            if(l.journey) {
                l.journey.forEach(e => {
                    if (e.type === 'section_view') {
                        if (e.label.includes('Herói')) counts['1. Início']++;
                        if (e.label.includes('Dores')) counts['2. Problema']++;
                        if (e.label.includes('Funciona')) counts['3. Método']++;
                        if (e.label.includes('Prova Social')) counts['4. Prova Social']++;
                        if (e.label.includes('Oferta Final')) counts['5. Oferta']++;
                    }
                    if (e.type === 'page_enter') {
                        counts['1. Início']++; // Everyone who enters sees Hero
                    }
                });
            } else {
                // Legacy leads: assume entering saw Hero
                counts['1. Início']++;
            }
        });
        return Object.keys(counts).map(k => ({ name: k, visualizações: counts[k], fill: '#0ea5e9' }));
    }, [processedLeads]);

    // Data for Click Tracking Bar Chart
    const clickData = useMemo(() => {
        const counts = {};
        let empty = true;
        processedLeads.forEach(l => {
            if(l.journey) {
                l.journey.forEach(e => {
                    if (e.type === 'click') {
                        empty = false;
                        let lbl = e.label.replace('cta-', '');
                        if(lbl === 'checkout') lbl = 'Botão Oferta';
                        else if(lbl === 'hero') lbl = 'Botão Topo';
                        else if(lbl === 'decisao') lbl = 'Botão Rodapé';
                        else if(lbl === 'crenca') lbl = 'Botão Crença';
                        else if(lbl === 'paraquem') lbl = 'Botão Para Quem';
                        else if(lbl === 'bonus') lbl = 'Botão Bônus';
                        else if(lbl.startsWith('play-depoimento-')) lbl = `Dep. em Vídeo ${lbl.replace('play-depoimento-', '')}`;
                        else if(lbl === 'play-vsl') lbl = 'Ver Vídeo VSL';
                        else if(lbl.startsWith('faq-')) lbl = `Abrir FAQ ${lbl.replace('faq-', '')}`;
                        
                        counts[lbl] = (counts[lbl] || 0) + 1;
                    }
                });
            }
        });
        
        if (empty) return [{ name: 'Sem Dados', cliques: 0, fill: '#14b8a6' }];
        
        return Object.keys(counts)
            .map(k => ({ name: k, cliques: counts[k], fill: '#14b8a6' }))
            .sort((a,b) => b.cliques - a.cliques)
            .slice(0, 5);
    }, [processedLeads]);

    const formatTimeDuration = (seconds) => {
        if (!seconds) return '0s';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const formatDate = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const toggleExpand = (id) => {
        if (expandedLead === id) setExpandedLead(null);
        else setExpandedLead(id);
    };

    const getSourceStyle = (source) => {
        const s = (source || '').toLowerCase();
        if (s.includes('instagram') || s.includes('ig')) return "bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20";
        if (s.includes('facebook') || s.includes('fb')) return "bg-[#1877F2] text-white shadow-lg shadow-blue-500/20";
        if (s.includes('google')) return "bg-white text-slate-800 font-semibold shadow-lg shadow-white/10";
        if (s.includes('tiktok')) return "bg-black text-white shadow-lg shadow-black/50 border border-slate-800";
        if (s.includes('youtube') || s.includes('yt')) return "bg-[#FF0000] text-white shadow-lg shadow-red-500/20";
        return "bg-slate-800 text-slate-300";
    };

    const getSourceLabel = (source) => {
        const s = (source || '').toLowerCase();
        if (s.includes('instagram') || s.includes('ig')) return "Instagram";
        if (s.includes('facebook') || s.includes('fb')) return "Facebook";
        if (s.includes('google')) return "Google Ads";
        if (s.includes('tiktok')) return "TikTok";
        if (s.includes('youtube') || s.includes('yt')) return "YouTube";
        return source || "Orgânico / Direto";
    };

    const exportCSV = () => {
        const headers = ["Data", "Hora", "Nome", "Email", "Telefone", "Origem", "Campanha", "Scroll %", "Tempo (s)", "Dispositivo", "Localização", "ID do Lead"];
        const rows = processedLeads.map(l => [
            formatDate(l.startTime).split(' ')[0],
            formatDate(l.startTime).split(' ')[1],
            l.contact_name || '-',
            l.contact_email || '-',
            l.contact_phone || '-',
            l.utm_source || 'Orgânico',
            l.utm_campaign || '-',
            l.maxScrollDepth || 0,
            l.timeOnPageSeconds || 0,
            l.isMobile ? 'Mobile' : 'Desktop',
            `"${l.location || 'Desconhecida'}"`,
            l.visitorId || l.id
        ]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `itr_leads_export_${dateFilter}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    const clearLeads = async () => {
        if(window.confirm(`⚠️ PERIGO EXTREMO: Você está prestes a apagar permanentemente os registros do banco de dados.\n\nDeseja mesmo limpar estes contatos?`)) {
            let i = 0;
            for(let l of processedLeads) {
                await deleteDoc(doc(db, 'lead_interactions', l.id));
                i++;
            }
            alert(`✅ ${i} leads apagados com sucesso.`);
        }
    };

    const deleteLead = async (id, e) => {
        if (e) e.stopPropagation();
        if(window.confirm("Deseja apagar APENAS este lead especificamente? Esta ação não pode ser desfeita.")) {
            try {
                await deleteDoc(doc(db, 'lead_interactions', id));
                if (expandedLead === id) setExpandedLead(null);
            } catch (err) {
                console.error("Erro ao apagar lead:", err);
                alert("Erro ao apagar lead.");
            }
        }
    };

    const handleLogout = () => {
        if(window.confirm("Deseja sair do Painel VIP? Seu navegador voltará a ser rastreado pelas métricas como um visitante normal.")) {
            localStorage.removeItem('itr_admin_auth');
            localStorage.removeItem('itr_admin_mode');
            setIsAuthenticated(false);
            window.location.href = '/';
        }
    };

    const handleAuth = (e) => {
        e.preventDefault();
        if (passInput === 'SocioITR') {
            localStorage.setItem('itr_admin_auth', 'true');
            setIsAuthenticated(true);
        } else {
            alert('Acesso Restrito: Código Incorreto.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#030308] flex items-center justify-center p-4 font-sans">
                <div className="bg-gradient-to-br from-[#0a0f18] to-slate-900/40 border border-white/5 p-8 rounded-3xl w-full max-w-sm shadow-2xl backdrop-blur-sm">
                    <div className="flex justify-center mb-6">
                        <Activity className="w-12 h-12 text-emerald-500/80" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2 text-center tracking-tight">Tráfego Inteligente ITR</h2>
                    <p className="text-slate-500 text-xs text-center mb-8">Digite o código do Sócio para acessar as métricas.</p>
                    <form onSubmit={handleAuth} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="*************"
                            value={passInput}
                            onChange={(e) => setPassInput(e.target.value)}
                            className="bg-[#030308]/50 border border-white/10 text-emerald-400 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 w-full text-center tracking-[0.3em] font-mono text-lg transition-colors placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-slate-700"
                        />
                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-[#030308] uppercase tracking-wider text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                            Destrancar Painel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030308] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                    <p className="text-emerald-500 font-medium tracking-widest uppercase text-xs animate-pulse">Buscando Leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030308] text-slate-300 p-4 md:p-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 print:bg-white print:text-black print:p-0">
            <style>{`
                @media print {
                    .print-hide { display: none !important; }
                    body { background: white !important; color: black !important; }
                    * { border-color: #ddd !important; }
                    .bg-[#0a0f18] { background: white !important; }
                    .text-white { color: black !important; }
                    .text-slate-400 { color: #444 !important; }
                    .recharts-text { fill: #000 !important; }
                }
            `}</style>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white print:text-black tracking-tight flex items-center gap-3 mb-2">
                            <Activity className="w-8 h-8 text-emerald-500 print:text-black" />
                            Tráfego Inteligente ITR
                        </h1>
                        <p className="text-slate-400 print:text-gray-600 text-sm max-w-2xl">
                            Acompanhe em tempo real quem são as pessoas na sua página de vendas, de qual canal estão vindo e como estão se comportando.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 print-hide w-full lg:w-auto">
                        
                        {/* Linha 1: Período e Fonte Básica */}
                        <div className="flex flex-wrap items-center justify-end gap-2 w-full">
                            <div className="flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-[10px] font-bold px-2 uppercase tracking-widest hidden sm:inline">Período</span>
                                <button onClick={() => setDateFilter('today')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${dateFilter === 'today' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Hoje</button>
                                <button onClick={() => setDateFilter('7d')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${dateFilter === '7d' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>7 Dias</button>
                                <button onClick={() => setDateFilter('30d')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${dateFilter === '30d' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>30 Dias</button>
                                <button onClick={() => setDateFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${dateFilter === 'all' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Tudo</button>
                            </div>

                            <div className="flex items-center bg-slate-800/40 p-1 rounded-xl border border-white/5">
                                <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
                                <select 
                                    value={sourceFilter}
                                    onChange={(e) => setSourceFilter(e.target.value)}
                                    className="bg-transparent border-none text-slate-300 text-xs font-semibold rounded-lg px-2 py-1.5 cursor-pointer outline-none transition-colors"
                                >
                                    <option value="all">Origem (Todas)</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="google">Google</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="orgânico">Orgânico / Direct</option>
                                </select>
                            </div>
                        </div>

                        {/* Linha 2: Filtros UTM Dinâmicos Avançados */}
                        <div className="flex flex-wrap items-center justify-end gap-2 w-full">
                            <select 
                                value={campaignFilter}
                                onChange={(e) => setCampaignFilter(e.target.value)}
                                className="bg-[#05080f] border border-emerald-500/20 text-slate-300 text-[11px] font-semibold rounded-lg px-2 py-2 cursor-pointer outline-none hover:border-emerald-500/50 transition-colors max-w-[140px] truncate"
                            >
                                <option value="all">🎯 Campanha (Tudo)</option>
                                {availableCampaigns.campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select 
                                value={termFilter}
                                onChange={(e) => setTermFilter(e.target.value)}
                                className="bg-[#05080f] border border-blue-500/20 text-slate-300 text-[11px] font-semibold rounded-lg px-2 py-2 cursor-pointer outline-none hover:border-blue-500/50 transition-colors max-w-[125px] truncate"
                            >
                                <option value="all">👥 Conjunto (Tudo)</option>
                                {availableCampaigns.terms.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>

                            <select 
                                value={contentFilter}
                                onChange={(e) => setContentFilter(e.target.value)}
                                className="bg-[#05080f] border border-purple-500/20 text-slate-300 text-[11px] font-semibold rounded-lg px-2 py-2 cursor-pointer outline-none hover:border-purple-500/50 transition-colors max-w-[125px] truncate"
                            >
                                <option value="all">📺 Anúncio (Tudo)</option>
                                {availableCampaigns.contents.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select 
                                value={mediumFilter}
                                onChange={(e) => setMediumFilter(e.target.value)}
                                className="bg-[#05080f] border border-slate-700/50 text-slate-400 text-[11px] font-semibold rounded-lg px-2 py-2 cursor-pointer outline-none hover:border-slate-500/50 transition-colors max-w-[120px] truncate"
                            >
                                <option value="all">📱 Posic./Meio (Tudo)</option>
                                {availableCampaigns.mediums.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        
                        {/* Linha 3: Botões de Ação */}
                        <div className="flex flex-wrap items-center justify-end gap-2 mt-1">
                            <button onClick={exportCSV} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-medium text-sm transition-colors border border-white/5">
                                <Download className="w-4 h-4" /> CSV
                            </button>
                            <button onClick={handlePrintPDF} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-medium text-sm transition-colors border border-white/5">
                                <Printer className="w-4 h-4" /> PDF
                            </button>
                            <button onClick={clearLeads} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl font-medium text-sm transition-colors border border-red-500/20">
                                <Trash2 className="w-4 h-4" /> Limpar
                            </button>
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors border border-white/5">
                                <LogOut className="w-4 h-4" /> Sair
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resumo Rápido */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-[#080c15]/80 p-5 rounded-2xl border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.02)]">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" /> Total Leads
                        </h3>
                        <p className="text-3xl font-black text-white">{processedLeads.length}</p>
                    </div>
                    <div className="bg-[#080c15]/80 p-5 rounded-2xl border border-white/5">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" /> Tempo Médio
                        </h3>
                        <p className="text-3xl font-black text-white">
                            {Math.round(processedLeads.reduce((acc, l) => acc + (l.timeOnPageSeconds || 0), 0) / (processedLeads.length || 1))}s
                        </p>
                    </div>
                    <div className="bg-[#080c15]/80 p-5 rounded-2xl border border-white/5">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" /> Scroll Médio
                        </h3>
                        <p className="text-3xl font-black text-white">
                            {Math.round(processedLeads.reduce((acc, l) => acc + (l.maxScrollDepth || 0), 0) / (processedLeads.length || 1))}%
                        </p>
                    </div>
                    <div className="bg-[#080c15]/80 p-5 rounded-2xl border border-white/5">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-emerald-400" /> Mobile
                        </h3>
                        <p className="text-3xl font-black text-white">
                            {processedLeads.length ? Math.round((processedLeads.filter(l => l.isMobile).length / processedLeads.length) * 100) : 0}%
                        </p>
                    </div>
                    <div className="bg-[#0a0f18]/90 p-5 rounded-2xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] col-span-2 md:col-span-1 lg:col-span-1">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" /> Rejeição (Turistas)
                        </h3>
                        <p className="text-3xl font-black text-red-400">
                            {processedLeads.length ? Math.round((processedLeads.filter(l => (l.timeOnPageSeconds || 0) < 10 && (l.maxScrollDepth || 0) < 25).length / processedLeads.length) * 100) : 0}%
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">&lt; 10s &amp; sem rolar a tela</p>
                    </div>
                </div>

                {/* GRÁFICOS VISUAIS - NOVA SEÇÃO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Gráfico de Linha (Últimos 10 Dias) */}
                    <div className="bg-[#0a0f18]/80 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-emerald-500" /> Volume de Acessos Recentes
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: 'white' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="Visitas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitas)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico Teia (Radar) de Origem */}
                    <div className="bg-[#0a0f18]/80 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Compass className="w-4 h-4 text-emerald-500" /> Fontes de Tráfego
                        </h3>
                        <div className="h-[250px] w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sourceData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                                    <Radar name="Acessos" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: 'white' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {/* Gráfico de Retenção de Leitura (Funil / Barras) */}
                    <div className="bg-[#0a0f18]/80 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-sky-400" /> Queda de Retenção na Página (Profundidade)
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sectionData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={100} />
                                    <RechartsTooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: 'white' }}
                                    />
                                    <Bar dataKey="visualizações" radius={[0, 8, 8, 0]} barSize={20}>
                                        {sectionData.map((entry, index) => (
                                            <cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Cliques Top */}
                    <div className="bg-[#0a0f18]/80 border border-white/5 rounded-3xl p-5 shadow-2xl backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-teal-400" /> Top Interações e Cliques
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={clickData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={100} />
                                    <RechartsTooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: 'white' }}
                                    />
                                    <Bar dataKey="cliques" radius={[0, 8, 8, 0]} barSize={20}>
                                        {clickData.map((entry, index) => (
                                            <cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tabela Interativa de Leads */}
                <div className="bg-[#0a0f18]/80 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-slate-400" />
                            <h2 className="text-white font-semibold">Feed de Acessos Recentes</h2>
                        </div>
                        <span className="text-xs text-slate-500">Listando últimos acessos 🟢</span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {processedLeads.map((lead, idx) => {
                            const isExpanded = expandedLead === lead.id;
                            const hasUTM = lead.utm_source || lead.utm_medium || lead.utm_campaign;
                            const sourceLabel = getSourceLabel(lead.utm_source);
                            const sourceBadgeStyle = getSourceStyle(lead.utm_source);

                            return (
                                <div key={lead.id} className="flex flex-col transition-colors hover:bg-white/[0.02]">
                                    {/* Linha Resumo */}
                                    <div 
                                        onClick={() => toggleExpand(lead.id)}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 cursor-pointer gap-4 md:gap-0"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 flex-1">
                                            {/* Hora de Chegada e Categoria */}
                                            <div className="w-32 text-sm flex flex-col gap-1">
                                                <span>
                                                    <span className="text-white font-medium">{formatDate(lead.startTime).split(' ')[1]}</span>
                                                    <span className="text-slate-500 text-xs ml-2">{formatDate(lead.startTime).split(' ')[0]}</span>
                                                </span>
                                                {lead.isReturningVisitor ? (
                                                    <span className="text-[10px] w-fit bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 rounded uppercase font-bold tracking-wider">RETORNOU</span>
                                                ) : (
                                                    <span className="text-[10px] w-fit bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 rounded uppercase font-bold tracking-wider">NOVO LEAD</span>
                                                )}
                                            </div>

                                            {/* Mini Badge Visuais da Origem */}
                                            <div className="flex flex-col gap-1.5 min-w-[160px]">
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-3 py-1 text-xs font-bold rounded-full ${sourceBadgeStyle}`}>{sourceLabel}</div>
                                                    {lead.isMobile ? <Smartphone className="w-4 h-4 text-slate-500" /> : <Monitor className="w-4 h-4 text-slate-500" />}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium truncate max-w-[150px]">
                                                    <MapPin className="w-3 h-3 text-emerald-500/70" /> {lead.location || 'Localizando...'}
                                                </div>
                                            </div>

                                            {/* Nome da Campanha Rápidinho ou Contato */}
                                            <div className="hidden md:flex flex-col flex-1 text-sm text-slate-400 space-y-1">
                                                <span className="truncate max-w-[200px] font-medium text-white">{lead.utm_campaign || lead.referrer || 'Acesso Orgânico'}</span>
                                                {(lead.contact_email || lead.contact_name) && (
                                                    <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 w-fit truncate max-w-[200px]">
                                                        📧 {lead.contact_email || lead.contact_name}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Resumo de Ações: Scroll e Cliques */}
                                            <div className="flex items-center gap-6 w-48 justify-end mr-4">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] text-slate-500 font-medium mb-1">Leu a Página</span>
                                                    <span className={`text-sm font-bold ${lead.maxScrollDepth > 80 ? 'text-emerald-400' : 'text-slate-300'}`}>{lead.maxScrollDepth}%</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] text-slate-500 font-medium mb-1">Ação de Compra</span>
                                                    {((lead.journey && lead.journey.some(e => e.type === 'click')) || (lead.clicks && lead.clicks.length > 0)) ? (
                                                        <span className="text-teal-400 font-bold text-sm">Sim 🔥</span>
                                                    ) : (
                                                        <span className="text-slate-600 font-medium text-sm">Não</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Setinha para expandir */}
                                        <div className="hidden md:flex items-center text-slate-500 pl-4 border-l border-slate-800">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>

                                    {/* Detalhes Marketing (Fácil de entender) */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden bg-[#0d1520] border-y border-emerald-500/10 shadow-inner"
                                            >
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    
                                                    {/* Coluna 1: Relatório do Anúncio (Tradução dos UTMs) */}
                                                    <div>
                                                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-emerald-500" /> Descoberta: Onde encontramos esse Lead?
                                                        </h3>
                                                        
                                                        <div className="bg-[#0a0f18] rounded-2xl border border-white/5 p-5">
                                                            {hasUTM ? (
                                                                <div className="flex flex-col gap-4">
                                                                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                                                        <span className="text-slate-500 text-sm">Qual Canal de Origem?</span>
                                                                        <span className="text-emerald-400 font-bold">{lead.utm_source || 'Não definido'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                                                        <span className="text-slate-500 text-sm">Formato (Stories, Feed, Ads)</span>
                                                                        <span className="text-white font-medium">{lead.utm_medium || 'Não definido'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                                                        <span className="text-slate-500 text-sm">Nome da Campanha</span>
                                                                        <span className="text-amber-400 font-bold">{lead.utm_campaign || 'Não definido'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                                                        <span className="text-slate-500 text-sm">Qual Criativo/Vídeo?</span>
                                                                        <span className="text-white font-medium">{lead.utm_content || 'Não definido'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-slate-500 text-sm">Palavra/Público Chave</span>
                                                                        <span className="text-slate-400 font-medium text-sm">{lead.utm_term || 'Não definido'}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                                                                    <Globe className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                                                    <p className="text-white font-medium mb-1">Tráfego Orgânico</p>
                                                                    <p className="text-sm text-slate-500">Este lead chegou diretamente pelo link ou por outro site sem parâmetros de anúncios (UTM).</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Coluna 2: Jornada Visual na LP */}
                                                    <div>
                                                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                            <Activity className="w-4 h-4 text-emerald-500" /> Raio-X da Rota do Lead
                                                        </h3>
                                                        
                                                        <div className="bg-[#0a0f18] border border-white/5 rounded-2xl p-6">
                                                            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                                                                {/* Renderização da Linha do Tempo Refinada */}
                                                                {lead.journey ? (
                                                                    lead.journey.map((event, i) => {
                                                                        let evtIconColor = 'bg-slate-600';
                                                                        let evtRingColor = 'border-[#0a0f18]';
                                                                        let textCss = 'text-slate-300';
                                                                        let labelValue = event.label;
                                                                        let extraStyle = '';

                                                                        if (event.type === 'page_enter') {
                                                                            evtIconColor = 'bg-emerald-500';
                                                                            textCss = 'text-white font-medium';
                                                                        }
                                                                        if (event.type === 'page_leave') {
                                                                            evtIconColor = 'bg-red-500/50';
                                                                            textCss = 'text-slate-500 font-medium italic';
                                                                        }
                                                                        if (event.type === 'page_return') {
                                                                            evtIconColor = 'bg-emerald-500/50';
                                                                            textCss = 'text-emerald-500/80 font-medium italic';
                                                                        }
                                                                        if (event.type === 'video_progress') {
                                                                            evtIconColor = 'bg-blue-500';
                                                                            textCss = 'text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded inline-block';
                                                                            labelValue = `⏱️ Retenção VSL: Assistiu ${event.label}`;
                                                                        }
                                                                        if (event.type === 'section_view') {
                                                                            evtIconColor = 'bg-slate-400';
                                                                            textCss = 'text-slate-400';
                                                                            extraStyle = 'text-xs uppercase font-bold tracking-wider';
                                                                        }
                                                                        if (event.type === 'click') {
                                                                            evtIconColor = 'bg-teal-500';
                                                                            evtRingColor = 'border-[#0a0f18] ring-2 ring-teal-500/30';
                                                                            textCss = 'text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded inline-block';
                                                                            if (labelValue.includes('cta-hero')) labelValue = '🔥 Clicou: Botão Verde do Topo';
                                                                            else if (labelValue.includes('cta-checkout')) labelValue = '💳 Clicou: Ir para Pagamento';
                                                                            else if (labelValue.includes('cta-decisao')) labelValue = '🚀 Clicou: Acelerar Inglês (Rodapé)';
                                                                            else if (labelValue.includes('cta-crenca')) labelValue = '💡 Clicou: Acelerar Inglês (Quebra de Crença)';
                                                                            else if (labelValue.includes('cta-paraquem')) labelValue = '🎯 Clicou: Acelerar Inglês (Para Quem É)';
                                                                            else if (labelValue.includes('cta-bonus')) labelValue = '🎁 Clicou: Resgatar Bônus (Final)';
                                                                            else if (labelValue.startsWith('play-depoimento-')) labelValue = `▶️ Assistiu Depoimento: Aluno ${labelValue.split('-').pop()}`;
                                                                            else if (labelValue === 'play-vsl') labelValue = '▶️ Deu Play: Vídeo Principal';
                                                                            else if (labelValue.startsWith('faq-')) labelValue = `📖 Curiosidade: Abriu Perguntas Frequentes (${labelValue.split('-').pop()})`;
                                                                            else labelValue = `🔥 Clicou: ${event.label.replace('Clicou no botão:', '')}`;
                                                                        }

                                                                        return (
                                                                            <div key={i} className="relative">
                                                                                <div className={`absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full border-[3px] ${evtIconColor} ${evtRingColor}`}></div>
                                                                                <p className={`text-sm ${textCss} ${extraStyle}`}>{labelValue}</p>
                                                                                <p className="text-xs text-slate-500 mt-1">{formatDate(event.time).split(' ')[1]}</p>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <>
                                                                        <div className="relative">
                                                                            <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#0a0f18]"></div>
                                                                            <p className="text-white font-medium text-sm">Entrou na Landing Page</p>
                                                                            <p className="text-xs text-slate-500 mt-1">Às {formatDate(lead.startTime).split(' ')[1]}</p>
                                                                        </div>
                                                                        {lead.clicks && lead.clicks.map((click, i) => (
                                                                            <div key={`old-${i}`} className="relative">
                                                                                <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 bg-teal-500 rounded-full border-[3px] border-[#0a0f18] ring-2 ring-teal-500/30"></div>
                                                                                <p className="text-teal-400 font-bold bg-teal-500/10 inline-block px-2 py-0.5 rounded-md text-sm">Clicou em Comprar</p>
                                                                                <p className="text-xs text-slate-500 mt-1">{formatDate(click.time).split(' ')[1]}</p>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                                {/* Evento Final */}
                                                                <div className="relative pt-2">
                                                                    <div className="absolute -left-[31px] top-2 w-3.5 h-3.5 bg-slate-700/80 rounded-full border-[3px] border-[#0a0f18] animate-pulse"></div>
                                                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest pl-1 mt-1">Sessão / Retenção</p>
                                                                    <div className="mt-2 text-xs text-slate-400 bg-black/20 p-3 rounded-xl border border-white/5">
                                                                        O Lead desceu até <strong className="text-emerald-400">{lead.maxScrollDepth}% da página</strong> <br/>e prestou atenção durante <strong className="text-emerald-400">{formatTimeDuration(lead.timeOnPageSeconds)}</strong>.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                
                                                <div className="px-6 pb-6 pt-2 border-t border-white/5 flex justify-end">
                                                    <button 
                                                        onClick={(e) => deleteLead(lead.id, e)}
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 text-xs font-semibold transition-colors border border-red-500/20"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Apagar Lead Específico
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}

                        {processedLeads.length === 0 && (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center mb-5">
                                    <Activity className="w-10 h-10 text-emerald-500/50" />
                                </div>
                                <h3 className="text-white text-xl font-bold mb-3 tracking-tight">Estamos Escutando...</h3>
                                <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                                    O seu novo painel de inteligência de rastreamento está online. Os perfis dos visitantes orgânicos e leads de anúncios aparecerão magicamente aqui, ao vivo.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
