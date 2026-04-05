import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import { 
    BookOpen, 
    Clock, 
    ArrowUpRight, 
    PlayCircle, 
    Loader2,
    Layout,
    ArrowRight,
    Trophy,
    Target
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuthStore } from "../../stores/userAuthStore";
import { StatCard } from "../../components/shared/StatCard";
import { MobileDashboard } from "../shared/MobileDashboard";
import { AnnouncementList } from "../../components/dashboard/AnnouncementList";

export const StudentDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const fetchAnnouncements = async () => {
        setLoadingAnnouncements(true);
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAnnouncements(false);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/dashboard/summary");
                setSummary(response.data);
                await fetchAnnouncements();
            } catch (error) {
                console.error("Dashboard sync error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--accent-primary)] opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] animate-pulse">{t('dashboard_syncing')}</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
             {/* Mobile View */}
             <div className="md:hidden">
                <MobileDashboard />
            </div>

            {/* Desktop View */}
            <main className="hidden md:block animate-fade-in-up" role="main">
                <header className="flex items-center gap-6 mb-12 md:mb-16">
                    <div className="h-12 w-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm shrink-0">
                        <Layout className="h-5 w-5 opacity-60" strokeWidth={1.5} />
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium text-lg md:text-xl italic opacity-80 leading-relaxed truncate">
                        {t('dash_welcome', { name: user?.fullname || 'Scholar' })}
                    </p>
                </header>

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10 mb-12 md:mb-20">
                    <StatCard 
                        label={t('dash_total_courses')} 
                        value={summary?.data?.courseCount || 0} 
                        icon={BookOpen}
                    />
                    <StatCard 
                        label={t('dash_progress')} 
                        value={`${summary?.data?.progress || 0}%`} 
                        icon={Clock}
                        color="accent"
                    />

                    {/* Next Class/Deadline Placeholder */}
                    <div className="animate-fade-in-up stagger-3 sm:col-span-2">
                        <div className="insta-card p-6 md:p-8 bg-[var(--text-primary)] text-[var(--bg-primary)] overflow-hidden relative group h-full border-none">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-6 text-[var(--bg-primary)] relative z-10 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {t('dash_next_deadline') || "UPCOMING PROTOCOL"}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-8 md:gap-12 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-2xl md:text-3xl font-black tracking-tight italic">
                                        {summary?.data?.nextDeadline?.title || "NO PENDING TASKS"}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase opacity-60 tracking-[0.2em] mt-1">
                                        {summary?.data?.nextDeadline?.course_title || "System Nominal"}
                                    </span>
                                </div>
                                <div className="hidden sm:block h-10 w-px bg-[var(--bg-primary)]/20" />
                                <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <ArrowUpRight className="h-5 w-5" />
                                     </div>
                                     <p className="text-[10px] font-black uppercase tracking-widest">{t('dash_view_assignment') || "EXECUTE"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
                    <div className="lg:col-span-2 space-y-12">
                        <AnnouncementList announcements={announcements} loading={loadingAnnouncements} />
                    </div>

                    <aside className="space-y-8">
                        <div className="insta-card p-8 md:p-10 border-dashed border-2 bg-white/5 flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                                <PlayCircle className="h-8 w-8 text-[var(--text-secondary)] opacity-10" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic opacity-60">Continue Research</h4>
                            <p className="text-[10px] font-medium italic opacity-40 mb-8 leading-relaxed">Resume your latest pedagogical session.</p>
                            <button 
                                onClick={() => navigate("/student/courses")}
                                className="w-full py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-black text-[9px] uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white transition-all active:scale-95 shadow-xl shadow-[var(--accent-primary)]/5"
                            >
                                Enter Simulation
                            </button>
                        </div>

                         <div className="insta-card p-10 bg-[var(--text-primary)] text-[var(--bg-primary)] relative overflow-hidden">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6 flex items-center gap-2">
                                <Trophy className="h-4 w-4" /> Scholastic Attainment
                            </h4>
                            <div className="space-y-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black italic">85%</span>
                                    <span className="text-[9px] font-black uppercase opacity-40">Goal Target</span>
                                </div>
                                <div className="h-1 bg-[var(--bg-primary)]/20 rounded-full overflow-hidden">
                                     <div className="h-full w-[85%] bg-[var(--bg-primary)] rounded-full" />
                                </div>
                            </div>
                         </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};
