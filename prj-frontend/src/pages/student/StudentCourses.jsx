import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

export const StudentCourses = () => {
    return (
        <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BookOpen size={32} color="#3b82f6" />
                    My Courses
                </h2>
                <p style={{ color: '#4b5563', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                    View and manage the courses you are enrolled in.
                </p>
            </div>

            <div style={{
                marginTop: '4rem',
                backgroundColor: 'white',
                padding: '4rem 2rem',
                borderRadius: '1rem',
                border: '1px dashed #d1d5db',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <Clock size={48} color="#3b82f6" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                    Features Coming Soon
                </h3>
                <p style={{ color: '#6b7280', maxWidth: '500px', lineHeight: '1.5' }}>
                    We are currently building the learning dashboard. Soon you'll be able to browse all your enrolled courses, track your progress, and jump straight back into your lessons right from here!
                </p>
            </div>
        </div>
    );
};
