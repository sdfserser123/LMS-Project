import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserRole } from '../types';
import { CourseCard } from '../components/ui/courseCard';

export const StudentDashboard = ({ user, activeView }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
  }, [user.id]);

  const fetchAllCourses = async () => {
    const res = await axios.get('http://localhost:3000/api/courses');
    setAllCourses(res.data);
  };

  const fetchEnrolledCourses = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/students/${user.id}/courses`
    );
    setEnrolledCourses(res.data);
  };

  // ===== ENROLL =====
  const handleEnroll = async (courseId) => {
    await axios.post(
      `http://localhost:3000/api/courses/${courseId}/enroll`,
      { studentId: user.id }
    );

    alert('Enrolled successfully!');
    fetchEnrolledCourses();
  };

  const isMyLearning = activeView === 'student-enrolled';

  const availableCourses = allCourses.filter(
    (c) =>
      c.status === 'APPROVED' &&
      !enrolledCourses.some((ec) => ec.id === c.id)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isMyLearning ? 'My Learning' : 'Explore Courses'}
        </h1>
        <p className="text-gray-500">
          {isMyLearning
            ? 'Your enrolled courses'
            : 'Find your next skill to master'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isMyLearning ? (
          enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                role={UserRole.STUDENT}
                onClick={() => {}}
                actionButton={
                  <span className="text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-full">
                    Enrolled
                  </span>
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500">
                You haven't enrolled in any courses yet.
              </p>
            </div>
          )
        ) : (
          availableCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role={UserRole.STUDENT}
              onClick={() => {}}
              actionButton={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(course.id);
                  }}
                  className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Enroll Now
                </button>
              }
            />
          ))
        )}
      </div>
    </div>
  );
};
