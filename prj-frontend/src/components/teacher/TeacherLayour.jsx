import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/userAuthStore';
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut } from 'lucide-react';

export const TeacherLayout = () => {
    const [isHovered, setIsHovered] = useState(false);
    const { user, logOut } = useAuthStore((state) => state);
    const location = useLocation();
    const navigate = useNavigate();

    const showSidebar = isHovered;

    // Các mục điều hướng cho Giảng viên
    const navItems = [
        { path: '/teacher/dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
        { path: '/admin/courses', label: 'My Courses', icon: BookOpen },
        { path: '/admin/addcourse', label: 'Create Course', icon: PlusCircle },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: showSidebar ? '260px' : '80px',
                    backgroundColor: '#111827', // Màu đen đậm slate
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    transition: 'width 0.3s ease',
                    zIndex: 50,
                    overflow: 'hidden',
                    borderRight: '1px solid #1f2937'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    minHeight: '80px'
                }}>
                    {showSidebar ? (
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.05em', whiteSpace: 'nowrap', color: '#60a5fa' }}>TEACHER PANEL</h1>
                            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '4px' }}>{user?.fullname || 'Instructor'}</p>
                        </div>
                    ) : (
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#60a5fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            T
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : '#9ca3af',
                                    backgroundColor: isActive ? '#374151' : 'transparent',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: showSidebar ? 'flex-start' : 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <item.icon size={20} color={isActive ? '#60a5fa' : 'currentColor'} />
                                {showSidebar && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #1f2937' }}>
                    <div
                        onClick={() => {
                            logOut();
                            navigate('/login');
                        }}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: showSidebar ? 'flex-start' : 'center', 
                            gap: '0.75rem', 
                            color: '#f87171', 
                            cursor: 'pointer',
                            padding: '0.75rem',
                            borderRadius: '0.5rem'
                        }}
                        className="hover-bg-red"
                    >
                        <LogOut size={20} />
                        {showSidebar && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sign Out</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main style={{
                flex: 1,
                marginLeft: '80px', 
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                width: '100%',
                backgroundColor: '#000000'
            }}>
                <div style={{ padding: '20px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};