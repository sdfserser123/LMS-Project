import React from 'react';
import { useAuthStore } from '../../stores/userAuthStore';
import { AdminLayout } from '../admin/AdminLayout';
import { TeacherLayout } from '../teacher/TeacherLayout';
import { StudentLayout } from '../student/StudentLayout';
import { Outlet } from 'react-router-dom';

/**
 * DynamicPortalLayout
 * Automatically wraps the children in the appropriate sidebar/header layout
 * based on the current user's role. Correctly handles shared routes like the Lesson Builder.
 */
export const DynamicPortalLayout = () => {
    const { user } = useAuthStore();

    if (user?.role === 'admin') {
        return <AdminLayout />;
    }

    if (user?.role === 'instructor') {
        return <TeacherLayout />;
    }

    if (user?.role === 'student') {
        return <StudentLayout />;
    }

    // Default fallback to just the content if no role matches
    return <Outlet />;
};
