import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/userAuthStore';
import { api } from '../../lib/axios';
import { toast } from 'sonner';

export const Settings = () => {
    const { user, refresh } = useAuthStore((state) => state);
    const [loading, setLoading] = useState(false);

    // User cannot edit their username or role.
    const [form, setForm] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Populate initial form data
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                fullname: user.fullname || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password && form.password !== form.confirmPassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }

        setLoading(true);
        try {
            const dataToUpdate = {
                fullname: form.fullname,
                email: form.email,
            };
            if (form.password) {
                dataToUpdate.password = form.password;
            }

            await api.put('/users/profile/edit', dataToUpdate);
            toast.success("Cập nhật hồ sơ thành công!");

            // Refresh user state in Auth Store to update the name displayed in the layout!
            await refresh();

            // Clear password fields
            setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi cập nhật hồ sơ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Settings</h2>
                <p style={{ color: '#4b5563' }}>Manage your account settings and personal information.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Read-only Username Field */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Username (Cannot be changed)</label>
                        <input
                            type="text"
                            value={user?.username || ''}
                            disabled
                            style={{
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #d1d5db',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280',
                                cursor: 'not-allowed'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Full Name *</label>
                        <input
                            name="fullname"
                            value={form.fullname}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <hr style={{ borderTop: '1px solid #e5e7eb', margin: '1rem 0' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Change Password</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '-1rem' }}>Leave blank to keep your current password.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.375rem',
                                fontWeight: '500',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
