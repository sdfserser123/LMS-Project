import { useState, useEffect } from 'react';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { 
    Shield, 
    CheckCircle, 
    XCircle, 
    Loader2, 
    User, 
    Calendar, 
    AlertTriangle,
    ArrowLeft,
    Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export const AnnouncementApproval = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchPending = async () => {
        try {
            const res = await api.get('/announcements/pending');
            setPending(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load pending announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/announcements/${id}/approve`);
            toast.success("Announcement broadcasted successfully");
            setPending(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Approval failed");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.delete(`/announcements/${id}`);
            toast.success("Announcement discarded");
            setPending(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Dejection failed");
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto min-h-screen animate-fade-in-up">
            <header className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="h-12 w-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--accent-primary)] hover:text-white transition-all active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black italic text-[var(--text-primary)] tracking-tight">Broadcast <span className="text-[var(--accent-primary)]">Control</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-40 italic">Verifying Academic Protocols</p>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-32">
                    <Loader2 className="h-12 w-12 animate-spin text-[var(--accent-primary)] mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic animate-pulse">Scanning Neural Feed...</p>
                </div>
            ) : pending.length === 0 ? (
                <div className="insta-card p-24 text-center border-dashed border-2 bg-white/5 opacity-50 flex flex-col items-center">
                    <CheckCircle className="h-16 w-16 mb-8 opacity-20" />
                    <h3 className="text-2xl font-black italic mb-4">Neural Feed Synchronized</h3>
                    <p className="text-xs font-medium italic opacity-60">No pending announcements require attention at this time.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {pending.map((ann, idx) => (
                        <div key={ann.id} className={`insta-card p-10 md:p-12 border-l-4 border-amber-500 animate-fade-in-up stagger-${(idx % 5) + 1}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black italic tracking-tighter text-[var(--text-primary)] leading-tight">{ann.title}</h3>
                                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60 mt-1">
                                                <span className="flex items-center gap-1.5"><User className="h-2.5 w-2.5" /> {ann.author_name}</span>
                                                <span className="opacity-20">•</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="h-2.5 w-2.5" /> {new Date(ann.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-base font-medium italic opacity-80 leading-relaxed bg-white/5 p-6 rounded-2xl border border-[var(--border-color)]">
                                        {ann.content}
                                    </p>
                                </div>
                                
                                <div className="flex md:flex-col gap-3 shrink-0">
                                    <button 
                                        onClick={() => handleApprove(ann.id)}
                                        className="flex-1 md:w-48 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                                    >
                                        <CheckCircle className="h-4 w-4" /> Broadcast
                                    </button>
                                    <button 
                                        onClick={() => handleReject(ann.id)}
                                        className="flex-1 md:w-48 py-4 rounded-xl bg-[var(--bg-secondary)] text-rose-500 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-rose-500 hover:text-white flex items-center justify-center gap-3 active:scale-95 border border-rose-500/20"
                                    >
                                        <XCircle className="h-4 w-4" /> Discard
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
