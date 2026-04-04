import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { 
  ClipboardList, 
  Search, 
  Loader2, 
  FileText, 
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import AssignmentCard from '../../components/student/AssignmentCard';
import AssignmentTable from '../../components/student/AssignmentTable';
import { assignmentListSchema } from '../../type/assignmentSchema';
import { toast } from 'sonner';

export const StudentAssignments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Fetching from a generic student assignments endpoint
        const res = await api.get('/assignments/student/my-all');
        const validatedData = assignmentListSchema.parse(res.data);
        setAssignments(validatedData);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        // Fallback or error toast
        if (error.name === 'ZodError') {
          console.error("Schema validation failed:", error.errors);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignmentClick = (id) => {
    navigate(`/student/assignment/${id}`);
  };

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 animate-fade-in-up pb-32">
      {/* Header Section */}
      {/* Minimalist Portal Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 md:mb-16">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm shrink-0">
            <ClipboardList className="h-5 w-5 opacity-60" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[var(--text-secondary)] font-medium text-lg md:text-xl italic opacity-80 leading-relaxed truncate">
              {t('assign_title')}
            </p>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-30 italic">
              Scholar Identity
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="flex items-center gap-4 bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] px-6 py-4 rounded-2xl w-full md:w-80 group focus-within:ring-4 focus-within:ring-[var(--accent-primary)]/10 focus-within:border-[var(--accent-primary)] transition-all">
              <Search className="h-5 w-5 text-[var(--text-secondary)] opacity-40 group-focus-within:text-[var(--accent-primary)] group-focus-within:opacity-100 transition-all shrink-0" />
              <input 
                type="text"
                placeholder={t('search_projects')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[var(--text-primary)] font-medium placeholder:text-[var(--text-secondary)]/40"
              />
           </div>
           <div className="hidden sm:flex bg-[var(--bg-secondary)]/50 p-1.5 rounded-2xl border border-[var(--border-color)]">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'}`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'}`}
              >
                <List className="h-5 w-5" />
              </button>
           </div>
        </div>
      </header>


      {/* Content Section */}
      <section className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <Loader2 className="h-16 w-16 animate-spin text-[var(--accent-primary)] mb-6 opacity-20" />
            <p className="text-[var(--text-secondary)] font-black uppercase tracking-[0.3em] text-xs opacity-40 italic">
              {t('assign_sync_assets')}
            </p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="glass-card p-20 md:p-32 text-center flex flex-col items-center border-dashed border-2 bg-white/5 group hover:bg-white/10 transition-all duration-700">
            <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700">
              <FileText className="h-12 w-12 text-[var(--text-secondary)] opacity-10" />
            </div>
            <h3 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tighter italic">
              {t('assign_empty')}
            </h3>
            <p className="text-[var(--text-secondary)] text-lg max-w-sm font-medium italic opacity-60 leading-relaxed">
              {t('assign_empty_sub')}
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
             {viewMode === 'grid' || window.innerWidth < 768 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredAssignments.map((assignment, idx) => (
                   <div key={assignment.id} className={`animate-fade-in-up stagger-${(idx % 5) + 1}`}>
                     <AssignmentCard 
                       assignment={assignment} 
                       onClick={handleAssignmentClick} 
                     />
                   </div>
                 ))}
               </div>
             ) : (
               <AssignmentTable 
                 assignments={filteredAssignments} 
                 onRowClick={handleAssignmentClick} 
               />
             )}
          </div>
        )}
      </section>
    </main>
  );
};
