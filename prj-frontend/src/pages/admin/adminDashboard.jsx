import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CourseStatus, UserRole } from '../types';
import { CourseCard } from '../components/ui/courseCard';


export const AdminDashboard = ({ activeView }) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:3000/api/admin/courses');
    setCourses(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/api/admin/users');
    setUsers(res.data);
  };

  // ===== ACTIONS =====
  const handleApprove = async (id) => {
    await axios.patch(
      `http://localhost:3000/api/admin/courses/${id}/status`,
      { status: CourseStatus.APPROVED }
    );
    fetchCourses();
  };

  const handleReject = async (id) => {
    await axios.patch(
      `http://localhost:3000/api/admin/courses/${id}/status`,
      { status: CourseStatus.REJECTED }
    );
    fetchCourses();
  };

  // ===== USER MANAGEMENT =====
  if (activeView === 'admin-users') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={u.avatar || '/avatar.png'}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-gray-900">
                      {u.name}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        u.role === UserRole.ADMIN
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === UserRole.TEACHER
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500 text-sm">
                    {u.email}
                  </td>

                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ===== COURSE VERIFICATION =====
  const pendingCourses = courses.filter(
    (c) => c.status === CourseStatus.PENDING
  );
  const otherCourses = courses.filter(
    (c) => c.status !== CourseStatus.PENDING
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pending Approvals
        </h1>

        {pendingCourses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
            <i className="fa-solid fa-check-double text-4xl mb-3 text-green-500"></i>
            <p>All clear! No pending courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col"
              >
                <h3 className="font-bold text-lg">{course.title}</h3>

                <div className="flex gap-3 mt-auto pt-4">
                  <button
                    onClick={() => handleApprove(course.id)}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(course.id)}
                    className="flex-1 border py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">All Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              role={UserRole.ADMIN}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
