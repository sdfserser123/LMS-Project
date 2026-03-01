import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../service/courseService";
import { toast } from "sonner";
import { useAuthStore } from "../../stores/userAuthStore";

export const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await courseService.getAllCourses();
                setCourses(data);
            } catch (error) {
                toast.error("Không thể tải danh sách khóa học");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Teacher Dashboard</h1>
                    <p style={{ color: '#6b7280' }}>Chào mừng trở lại, {user?.fullname || 'Giảng viên'}!</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/addcourse")}
                    style={primaryBtnStyle}
                >
                    + Tạo khóa học mới
                </button>
            </header>

            {/* Stats Overview (Optional) */}
            <div style={statsGridStyle}>
                <div style={statCardStyle}>
                    <span style={statLabelStyle}>Tổng số khóa học</span>
                    <span style={statValueStyle}>{courses.length}</span>
                </div>
                <div style={statCardStyle}>
                    <span style={statLabelStyle}>Trạng thái hoạt động</span>
                    <span style={{...statValueStyle, color: '#059669'}}>Đang chạy</span>
                </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <p>Đang tải danh sách...</p>
            ) : (
                <div style={courseGridStyle}>
                    {courses.map((course) => (
                        <div key={course.courseid} style={courseCardStyle}>
                            <div style={cardHeaderStyle}>
                                <span style={badgeStyle(course.status)}>
                                    {course.status}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {course.courseid}</span>
                            </div>
                            
                            <h3 style={courseTitleStyle}>{course.title}</h3>
                            <p style={courseDescStyle}>
                                {course.description || "Chưa có mô tả chi tiết cho khóa học này..."}
                            </p>

                            <div style={cardFooterStyle}>
                                <button 
                                    onClick={() => navigate(`/instructor/lessons/${course.courseid}`)}
                                    style={secondaryBtnStyle}
                                >
                                    Manage Lessons
                                </button>
                                <button 
                                    onClick={() => navigate(`/course/view/${course.courseid}`)}
                                    style={viewBtnStyle}
                                >
                                    View
                                </button>
                            </div>
                        </div>  
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const statsGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' };
const statCardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' };
const statLabelStyle = { fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' };
const statValueStyle = { fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' };

const courseGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' };
const courseCardStyle = { backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e5e7eb', padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' };
const courseTitleStyle = { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' };
const courseDescStyle = { fontSize: '0.875rem', color: '#4b5563', marginBottom: '1.5rem', flex: 1, lineClamp: 3, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 };

const cardFooterStyle = { display: 'flex', gap: '0.75rem' };
const primaryBtnStyle = { backgroundColor: '#000', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer' };
const secondaryBtnStyle = { flex: 2, backgroundColor: '#f3f4f6', color: '#1f2937', padding: '0.6rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer' };
const viewBtnStyle = { flex: 1, backgroundColor: '#fff', color: '#1f2937', padding: '0.6rem', borderRadius: '0.5rem', fontWeight: '600', border: '1px solid #d1d5db', cursor: 'pointer' };

const badgeStyle = (status) => ({
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: status === 'approved' ? '#dcfce7' : '#fef9c3',
    color: status === 'approved' ? '#166534' : '#854d0e'
});