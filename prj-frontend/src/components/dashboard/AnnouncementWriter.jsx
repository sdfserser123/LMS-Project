import { useState } from 'react';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/userAuthStore';
import { useTranslation } from '../../hooks/useTranslation';

export const AnnouncementWriter = ({ onPublished }) => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin';

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await api.post('/announcements', { title, content });
            toast.success(res.data.message);
            setTitle('');
            setContent('');
            if (onPublished) onPublished();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to publish announcement");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="insta-card p-8 md:p-12 relative overflow-hidden group border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-[var(--bg-secondary)]/50 backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="h-20 w-20 text-[var(--accent-primary)]" />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-primary)] mb-8 flex items-center gap-3">
                    <Send className="h-4 w-4" /> 
                    {isAdmin ? "Publish Global Directive" : "Propose Academic Announcement"}
                </h3>

                <form onSubmit={handlePublish} className="space-y-6">
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            placeholder="Announcement Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-b border-[var(--border-color)] py-4 text-2xl font-black italic outline-none focus:border-[var(--accent-primary)] transition-all placeholder:opacity-20"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <textarea 
                            placeholder="Compose your message here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            className="w-full bg-white/5 border border-[var(--border-color)] rounded-2xl p-6 text-sm font-medium outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/5 transition-all placeholder:opacity-20 resize-none"
                            required
                        />
                    </div>

                    {!isAdmin && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <AlertCircle className="h-4 w-4" />
                            Note: Your announcement will require administrative verification before broadcast.
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`
                                flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl
                                ${isAdmin 
                                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)] hover:text-white shadow-[var(--accent-primary)]/20' 
                                    : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'}
                            `}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {isAdmin ? "Execute Broadcast" : "Submit for Protocol"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
