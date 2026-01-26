import React from 'react';
import { CourseStatus, UserRole } from '../../types.js';

export const CourseCard = ({ course, role, onClick, actionButton }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case CourseStatus.APPROVED:
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
            Approved
          </span>
        );
      case CourseStatus.PENDING:
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
            Pending Review
          </span>
        );
      case CourseStatus.REJECTED:
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            Rejected
          </span>
        );
      case CourseStatus.DRAFT:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
            {course.category}
          </span>
        </div>

        {(role === UserRole.TEACHER || role === UserRole.ADMIN) && (
          <div className="absolute top-3 left-3">
            {getStatusBadge(course.status)}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
            {course.instructorName.charAt(0)}
          </div>
          <span className="text-xs text-gray-600 truncate">
            {course.instructorName}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <i className="fa-regular fa-clock"></i>
            <span>{course.lessons.length} Lessons</span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {actionButton}
          </div>
        </div>
      </div>
    </div>
  );
};
