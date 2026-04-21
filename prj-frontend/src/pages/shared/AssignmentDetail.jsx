import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../stores/userAuthStore';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, FileText, Upload, Clock, GraduationCap, X, ChevronRight, File, Loader2, User, Mail, Star } from 'lucide-react';
import { DataCard } from "../../components/shared/DataCard";
import MobileListItem from "../../components/shared/MobileListItem";
import { useTranslation } from '../../hooks/useTranslation';

export const AssignmentDetail = () => {
    const { t } = useTranslation();
    const { assignment_id } = useParams();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    // STUDENT STATE
    const [mySubmission, setMySubmission] = useState(null);
    const [submitContent, setSubmitContent] = useState("");
    const [submitFile, setSubmitFile] = useState(null);

    // INSTRUCTOR STATE
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [gradingTarget, setGradingTarget] = useState(null);
    const [gradeScore, setGradeScore] = useState("");
    const [gradeFeedback, setGradeFeedback] = useState("");

    const isStudent = user?.role === 'student';

    useEffect(() => {
        fetchAssignmentData();
    }, [assignment_id]);

    const fetchAssignmentData = async () => {
        try {
            // Fetch Assignment Metadata (Title, Description, etc.)
            const assignRes = await api.get(`/assignments/${assignment_id}`);
            setAssignment(assignRes.data);

            if (isStudent) {
                const subRes = await api.get(`/assignments/${assignment_id}/my-submission`);
                setMySubmission(subRes.data);
                if (subRes.data) {
                    setSubmitContent(subRes.data.content || "");
                }
            } else {
                const subsRes = await api.get(`/assignments/${assignment_id}/submissions`);
                setAllSubmissions(subsRes.data);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                toast.error(t('alert_load_assignment_error'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSubmit = async () => {
        if (!submitContent && !submitFile) {
            toast.error(t('alert_content_required'));
            return;
        }
        try {
            const formData = new FormData();
            formData.append('content', submitContent);
            if (submitFile) formData.append('file', submitFile);

            await api.post(`/assignments/${assignment_id}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(t('alert_submit_success'));
            fetchAssignmentData();
        } catch (e) {
            toast.error(t('alert_submit_error'));
        }
    };

    const handleInstructorGrade = async () => {
        if (!gradeScore) {
            toast.error(t('alert_score_required'));
            return;
        }
        const numericGrade = Number(gradeScore);
        if (numericGrade < 0 || numericGrade > 100) {
            toast.error(t('alert_invalid_grade_range'));
            return;
        }
        try {
            await api.patch(`/assignments/submissions/${gradingTarget.id}/grade`, {
                grade: gradeScore,
                feedback: gradeFeedback
            });
            toast.success(t('alert_grade_success'));
            setGradingTarget(null);
            setGradeScore("");
            setGradeFeedback("");
            fetchAssignmentData();
        } catch (e) {
            toast.error(t('alert_grade_error'));
        }
    };

    const getGradeColor = (score) => {
        const s = Number(score);
        if (s < 30) return 'text-red-500';
        if (s < 50) return 'text-orange-500';
        if (s < 80) return 'text-blue-500';
        return 'text-emerald-500'; // Xanh lá (emerald) cho 80-100
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in">
            <div className="relative h-20 w-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-primary)] opacity-10 blur-sm" />
                <Loader2 className="h-20 w-20 animate-spin text-[var(--accent-primary)] relative z-10" />
            </div>
            <p className="text-[var(--text-secondary)] font-black uppercase tracking-[0.3em] text-xs animate-pulse">{t('assign_sync_records')}</p>
        </div>
    );

    if (!assignment) return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8 text-center animate-fade-in-up">
            <div className="h-24 w-24 rounded-[2.5rem] bg-[var(--surface-high)] flex items-center justify-center text-[var(--accent-primary)] opacity-20 mb-8">
                <X className="h-10 w-10" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
                Assignment Not Found
            </h1>
            <p className="text-[var(--text-secondary)] font-medium mb-10 opacity-60 max-w-md mx-auto">
                This academic mission briefing may have been archived or removed by the department.
            </p>
            <button 
                onClick={() => navigate(-1)}
                className="btn-secondary !px-12 !py-4 active:scale-95"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen animate-fade-in-up pb-32">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-extrabold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-12 transition-all group"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                {t('assign_ret_modules')}
            </button>

            <section className="animate-fade-in-up stagger-1 mb-16">
                <div className="insta-card p-10 md:p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.03] rounded-full -mr-48 -mt-48 transition-transform duration-[2000ms] group-hover:scale-125" />
                    
                    <div className="relative z-10 space-y-12">
                        {/* Header Part */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center text-white shadow-lg">
                                    <FileText className="h-7 w-7" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[var(--accent-primary)] opacity-70">
                                        {assignment?.course_title || t('assign_intelligence')}
                                    </p>
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
                                        {assignment?.title || t('assign_intelligence')}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Description Part */}
                        <div className="max-w-4xl">
                            <p className="text-[var(--text-primary)] font-medium text-lg leading-relaxed border-l-4 border-[var(--accent-primary)] pl-10 opacity-90 italic">
                                {assignment?.description || t('assign_no_desc')}
                            </p>
                        </div>
                        
                        {/* Attachments Part */}
                        {assignment?.file_url && (
                            <div className="pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-[var(--surface-low)] flex items-center justify-center text-[var(--accent-primary)]">
                                        <File className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-secondary)] opacity-50">{t('assign_label_ressource') || "Reference Asset"}</p>
                                        <p className="font-bold text-[var(--text-primary)]">{t('assign_appendix_provided') || "Standard Documentation Attached"}</p>
                                    </div>
                                </div>
                                <a 
                                    href={assignment.file_url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="btn-primary !px-10 !py-5"
                                >
                                    <Upload className="h-4 w-4 mr-2 rotate-180" /> 
                                    {t('assign_down_appendix')} (DOCX)
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {isStudent && (
                /* STUDENT VIEW */
                <div className="space-y-16">
                    <section className="animate-fade-in-up stagger-1">
                        <div className="flex items-center gap-4 mb-10">
                            <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">{t('assign_sub_status')}</h3>
                            <div className="h-[2px] flex-1 bg-[var(--surface-highest)]"></div>
                        </div>

                        {mySubmission?.status === 'graded' ? (
                            <div className="insta-card p-10 bg-[var(--accent-primary)] border-none relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center text-white">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 w-fit text-[10px] font-extrabold tracking-widest uppercase">
                                            <CheckCircle className="h-3 w-3" /> {t('assign_eval_complete')}
                                        </div>
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-8xl font-extrabold tracking-tighter italic">
                                                {mySubmission.grade}
                                            </span>
                                            <span className="text-2xl font-bold opacity-40">/ 100</span>
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">{t('label_feedback')}</span>
                                            <p className="text-lg font-medium italic leading-relaxed border-l-2 border-white/30 pl-6">
                                                "{mySubmission.feedback || t('assign_def_feedback')}"
                                            </p>
                                        </div>
                                    </div>
                                    {mySubmission.file_url && (
                                        <a 
                                            href={mySubmission.file_url} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="px-10 py-5 rounded-2xl bg-white text-[var(--accent-primary)] font-extrabold text-[10px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center gap-3 hover:translate-y-[-4px]"
                                        >
                                            <File className="h-4 w-4" /> {t('assign_down_appendix')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : mySubmission?.status === 'submitted' ? (
                            <div className="insta-card p-10 bg-[var(--surface-low)] border-l-4 border-l-amber-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Clock className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-amber-600 font-extrabold uppercase tracking-[0.2em] text-[10px] mb-2">{t('assign_stat_sub_pending')}</h3>
                                        <p className="text-[var(--text-secondary)] font-medium">
                                            {t('assign_sub_pending_sub')}
                                        </p>
                                    </div>
                                </div>
                                {mySubmission.file_url && (
                                    <a 
                                        href={mySubmission.file_url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="btn-secondary !bg-amber-500 !text-white active:scale-95"
                                    >
                                        <File className="h-4 w-4 mr-2" /> {t('assign_down_appendix')}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="insta-card p-10 bg-[var(--surface-low)] flex items-center gap-8 group opacity-70">
                                <div className="h-16 w-16 rounded-2xl bg-[var(--surface-high)] flex items-center justify-center text-[var(--text-secondary)]">
                                    <FileText className="h-8 w-8 opacity-40" />
                                </div>
                                <div>
                                    <h3 className="text-[var(--text-secondary)] font-extrabold uppercase tracking-[0.2em] text-[10px] mb-2 opacity-60">{t('assign_stat_no_sub')}</h3>
                                    <p className="text-[var(--text-secondary)] font-medium leading-relaxed italic">
                                        {t('assign_no_sub_sub')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    {!mySubmission || mySubmission.status === 'submitted' ? (
                        <section className="animate-fade-in-up stagger-2">
                            <div className="flex items-center gap-4 mb-10">
                                <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                                    {mySubmission ? t('assign_refine_sub') : t('assign_initial_sub')}
                                </h3>
                                <div className="h-[2px] flex-1 bg-[var(--surface-highest)]"></div>
                            </div>
                            
                            <div className="insta-card p-10 md:p-14 space-y-10 group shadow-lg">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50 ml-1">
                                        <FileText className="h-3 w-3" />
                                        {t('assign_label_abstract')}
                                    </label>
                                    <textarea
                                        value={submitContent}
                                        onChange={(e) => setSubmitContent(e.target.value)}
                                        placeholder={t('assign_place_abstract')}
                                        className="w-full h-64 px-8 py-8 rounded-[2rem] border border-[var(--surface-high)] bg-[var(--surface-low)]/50 focus:bg-[var(--surface-lowest)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 outline-none transition-all text-[var(--text-primary)] font-medium text-lg leading-[1.8] resize-none custom-scrollbar"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50 ml-1">
                                        <Upload className="h-3 w-3" />
                                        {t('assign_label_portfolio')}
                                    </label>
                                    <div className="relative group/upload overflow-hidden rounded-[2rem] bg-[var(--surface-low)] transition-all border-2 border-dashed border-[var(--surface-high)] hover:border-[var(--accent-primary)]">
                                        <input
                                            type="file"
                                            onChange={(e) => setSubmitFile(e.target.files[0])}
                                            className="w-full px-8 py-20 cursor-pointer text-transparent file:hidden z-20 relative"
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 group-hover/upload:scale-105">
                                            <div className="h-12 w-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] mb-4">
                                                <Upload className="h-6 w-6" />
                                            </div>
                                            <span className="text-sm font-extrabold tracking-widest uppercase text-[var(--text-primary)]">
                                                {submitFile ? submitFile.name : t('assign_place_portfolio')}
                                            </span>
                                            <span className="text-[10px] mt-2 font-medium text-[var(--text-secondary)] opacity-50">{t('assign_port_hint')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button
                                        onClick={handleStudentSubmit}
                                        className="btn-primary !px-20 !py-5"
                                    >
                                        <Upload className="h-4 w-4 mr-3" />
                                        {mySubmission ? t('assign_action_resubmit') : t('assign_action_final_submit')}
                                    </button>
                                </div>
                            </div>
                        </section>
                    ) : null}
                </div>
            )}
            {!isStudent && (
                /* INSTRUCTOR VIEW */
                <section className="animate-fade-in-up stagger-1">
                    <div className="insta-card overflow-hidden shadow-2xl border-none">
                        <div className="p-10 border-b border-[var(--surface-high)] bg-[var(--surface-low)]/50 backdrop-blur-md flex flex-wrap justify-between items-center gap-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                                        <GraduationCap className="h-6 w-6" />
                                    </div>
                                    {t('assign_ledger')}
                                </h2>
                                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.25em] opacity-50 pl-14">{t('assign_ledger_sub')}</p>
                            </div>
                            <div className="px-6 py-2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-extrabold tracking-widest uppercase">
                                {t('assign_reg_records', { count: allSubmissions.length })}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {/* Desktop View: Table */}
                            <table className="hidden md:table w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--surface-low)]/30 border-b border-[var(--surface-high)]">
                                        <th className="px-10 py-6 text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest opacity-40">{t('label_scholar_id')}</th>
                                        <th className="px-10 py-6 text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest opacity-40 text-center">{t('table_status')}</th>
                                        <th className="px-10 py-6 text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest opacity-40 text-center">{t('label_evaluation')}</th>
                                        <th className="px-10 py-6 text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest opacity-40 text-right">{t('label_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--surface-high)] bg-white/5">
                                    {allSubmissions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-10 py-32 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-20 w-20 rounded-[2rem] bg-[var(--surface-low)] flex items-center justify-center text-[var(--text-secondary)] opacity-10 mb-6">
                                                        <FileText className="h-10 w-10" />
                                                    </div>
                                                    <p className="text-[var(--text-secondary)] font-extrabold uppercase tracking-widest text-[10px] opacity-30 italic">{t('assign_nulla_records')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        allSubmissions.map((sub, idx) => (
                                            <tr key={sub.id} className="hover:bg-[var(--surface-low)] transition-all group animate-fade-in-up">
                                                <td className="px-10 py-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-14 w-14 rounded-2xl bg-[var(--text-primary)] text-white flex items-center justify-center font-extrabold text-xl group-hover:bg-[var(--accent-primary)] transition-all duration-500 shadow-md">
                                                            {sub.fullname.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-[var(--text-primary)] text-lg tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">{sub.fullname}</div>
                                                            <div className="text-[10px] text-[var(--text-secondary)] font-extrabold tracking-widest uppercase opacity-40">{sub.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-10 text-center">
                                                    <span className={`
                                                        px-5 py-2 rounded-full text-[10px] font-extrabold tracking-widest uppercase inline-flex items-center gap-2
                                                        ${sub.status === 'graded' 
                                                            ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                                                            : 'bg-amber-100 text-amber-700 shadow-sm'}
                                                    `}>
                                                        {sub.status === 'graded' ? t('assign_stat_evaluated') : t('assign_stat_pending_rev')}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-10 text-center font-black">
                                                    {sub.grade !== null ? (
                                                        <div className="flex items-center justify-center gap-1 italic">
                                                            <span className="text-4xl text-[var(--accent-primary)] tracking-tighter">{sub.grade}</span>
                                                            <span className="text-[10px] text-[var(--text-secondary)] opacity-30">/ 100</span>
                                                        </div>
                                                    ) : <span className="text-[var(--text-secondary)] opacity-30 italic font-medium">{t('assign_stat_unprocessed')}</span>}
                                                </td>
                                                <td className="px-10 py-10 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setGradingTarget(sub);
                                                            setGradeScore(sub.grade || "");
                                                            setGradeFeedback(sub.feedback || "");
                                                        }}
                                                        className="btn-secondary !bg-[var(--surface-high)] !px-8 hover:!bg-[var(--text-primary)] hover:!text-white"
                                                    >
                                                        {t('assign_action_review')}
                                                        <ChevronRight className="h-4 w-4 ml-2" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Mobile View remains similar but styled */}
                            <div className="md:hidden">
                                {allSubmissions.length === 0 ? (
                                    <div className="flex flex-col items-center py-20 px-8 text-center bg-[var(--bg-secondary)]/10 rounded-[2rem] mx-4 my-8">
                                        <div className="h-16 w-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] opacity-10 mb-6">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <p className="text-[var(--text-secondary)] font-black uppercase tracking-widest text-[10px] opacity-30 italic">{t('assign_nulla_records')}</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[var(--border-color)]/30">
                                        {allSubmissions.map((sub) => (
                                            <MobileListItem
                                                key={sub.id}
                                                title={sub.fullname}
                                                subtitle={sub.status === 'graded' ? `${t('assign_stat_evaluated')} • ${sub.grade}/100` : t('assign_stat_pending_rev')}
                                                avatar={sub.fullname.charAt(0).toUpperCase()}
                                                isExpanded={gradingTarget?.id === sub.id}
                                                onToggle={() => {
                                                    if (gradingTarget?.id === sub.id) {
                                                        setGradingTarget(null);
                                                    } else {
                                                        setGradingTarget(sub);
                                                        setGradeScore(sub.grade || "");
                                                        setGradeFeedback(sub.feedback || "");
                                                    }
                                                }}
                                                actions={[
                                                    {
                                                        label: t('assign_action_process'),
                                                        icon: GraduationCap,
                                                        onClick: () => {
                                                            setGradingTarget(sub);
                                                            setGradeScore(sub.grade || "");
                                                            setGradeFeedback(sub.feedback || "");
                                                        },
                                                        variant: 'primary'
                                                    }
                                                ]}
                                            >
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
                                                            <Mail className="h-3 w-3 text-[var(--text-secondary)]" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-40">{t('assign_label_email')}</p>
                                                            <p className="font-bold text-[var(--text-primary)] truncate">{sub.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </MobileListItem>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Evaluation Modal */}
            {gradingTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="insta-card p-0 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
                        
                        <div className="p-10 pb-6 flex justify-between items-start">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                                    Digital <span className="text-[var(--accent-primary)]">Evaluation</span>
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[var(--text-secondary)] font-medium italic">{t('assign_scholar_label')} <span className="text-[var(--text-primary)] font-bold not-italic ml-2">{gradingTarget.fullname}</span></p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setGradingTarget(null)}
                                className="h-12 w-12 rounded-[1.25rem] bg-[var(--surface-low)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-white transition-all group"
                            >
                                <X className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 pt-6 space-y-12 custom-scrollbar">
                            <section className="space-y-6">
                                <label className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50">
                                    <FileText className="h-3 w-3" />
                                    {t('assign_artifact')}
                                </label>
                                <div className="bg-[var(--surface-low)]/50 p-10 rounded-[2rem] border border-[var(--surface-high)] relative group/artifact">
                                    <p className="text-[var(--text-primary)] font-medium text-lg leading-[1.8] whitespace-pre-wrap italic">
                                        {gradingTarget.content || t('assign_no_art_content')}
                                    </p>
                                    {gradingTarget.file_url && (
                                        <div className="mt-10 pt-10 border-t border-[var(--surface-high)]">
                                            <a 
                                                href={gradingTarget.file_url} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="btn-primary"
                                            >
                                                <Upload className="h-4 w-4 mr-3" /> {t('assign_down_artifact')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-4 space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50">{t('label_grade')}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={gradeScore}
                                            onChange={(e) => setGradeScore(e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            className="w-full h-32 px-8 rounded-[1.5rem] border border-[var(--surface-high)] bg-[var(--surface-low)]/50 focus:bg-[var(--surface-lowest)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 outline-none transition-all text-6xl font-extrabold text-[var(--text-primary)] text-center tracking-tighter"
                                        />
                                        <div className="absolute bottom-6 right-8 text-[10px] font-extrabold text-[var(--text-secondary)] opacity-30">/ 100</div>
                                    </div>
                                </div>
                                <div className="md:col-span-8 space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-50">{t('assign_label_eval_note')}</label>
                                    <textarea
                                        value={gradeFeedback}
                                        onChange={(e) => setGradeFeedback(e.target.value)}
                                        placeholder={t('assign_place_eval_note')}
                                        className="w-full h-32 px-8 py-8 rounded-[1.5rem] border border-[var(--surface-high)] bg-[var(--surface-low)]/50 focus:bg-[var(--surface-lowest)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 outline-none transition-all text-base font-medium text-[var(--text-primary)] italic resize-none custom-scrollbar"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-10 pt-6 flex flex-wrap gap-6 border-t border-[var(--surface-high)] bg-[var(--surface-low)]/30">
                            <button 
                                onClick={() => setGradingTarget(null)} 
                                className="flex-1 btn-secondary !bg-transparent !border-2 !border-[var(--surface-high)] active:scale-95"
                            >
                                {t('assign_action_abandon_rev')}
                            </button>
                            <button 
                                onClick={handleInstructorGrade} 
                                className="flex-[2] btn-primary active:scale-95 flex items-center justify-center gap-3"
                            >
                                <CheckCircle className="h-5 w-5" />
                                {t('assign_action_commemorate')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

