import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/userAuthStore';
import { api } from '../../lib/axios';

export const StudentDashboard = () => {
    const user = useAuthStore((s) => s.user);
    const [myCoursesCount, setMyCoursesCount] = useState(0);

    useEffect(() => {
        api.get("/courses/my-enrolled")
           .then(res => setMyCoursesCount(res.data.length))
           .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>My Learning</h2>
            <p style={{ color: '#4b5563', marginBottom: '2rem' }}>Chào mừng bạn trở lại, {user?.fullname}.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={cardStyle}>
                    <h3 style={labelStyle}>Khóa học của tôi</h3>
                    <p style={numberStyle}>{myCoursesCount}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={labelStyle}>Bài giảng hoàn thành</h3>
                    <p style={numberStyle}>--</p>
                </div>
            </div>
        </div>
    );
};

// Tái sử dụng style từ Admin của bạn
const cardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' };
const labelStyle = { fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' };
const numberStyle = { fontSize: '2rem', fontWeight: 'bold', color: '#111827' };