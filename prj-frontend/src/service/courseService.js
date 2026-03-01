import { api } from "../lib/axios";

export const courseService = {
  getCourseById: async (courseid) => {
    const res = await api.get(`/courses/detail/${courseid}`);
    return res.data;
  },

  getCourseContent: async (courseid) => {
    const res = await api.get(`/courses/content/${courseid}`);
    return res.data; // Trả về mảng các bài học
  },

  // Instructor tạo khóa học
  createCourse: async (data) => {
    const res = await api.post("/courses/create", data);
    return res.data;
  },

  // Instructor/Admin thêm bài giảng (Có file nên dùng FormData)
  upsertLesson: async (formData) => {
    const res = await api.post("/courses/lessons", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Admin duyệt khóa học
  approveCourse: async (courseid, status) => {
    const res = await api.patch(`/courses/approve/${courseid}`, { status });
    return res.data;
  },

  // Lấy danh sách khóa học (tùy API backend bạn viết)
  getAllCourses: async () => {
    const res = await api.get("/courses");
    return res.data;
  }
};