import React, { useEffect, useState } from "react";
import { CourseCard } from "../components/ui/courseCard";

export const TeacherDashboard = ({ user, activeView }) => {
  const [courses, setCourses] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [lessons, setLessons] = useState([]);

  /* =======================
     FETCH COURSES (API)
  ======================= */
  useEffect(() => {
    fetch(`/api/teacher/${user.id}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));
  }, [user.id]);

  /* =======================
     CREATE COURSE
  ======================= */
  const handleCreateCourse = async () => {
    if (!title || lessons.length === 0) return;

    const payload = {
      title,
      description,
      category,
      lessons,
    };

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newCourse = await res.json();
      setCourses([...courses, newCourse]);
      resetForm();
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setTitle("");
    setDescription("");
    setCategory("General");
    setLessons([]);
  };

  /* =======================
     CREATE VIEW
  ======================= */
  if (activeView === "teacher-create" || isCreating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Create Course</h1>
          <button onClick={resetForm} className="text-gray-500">
            Cancel
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl space-y-6 border">
          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-3 rounded-lg h-28"
            placeholder="Course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-3 rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>General</option>
            <option>Programming</option>
            <option>Design</option>
            <option>Business</option>
          </select>

          <div>
            <h3 className="font-semibold mb-2">Lessons</h3>

            {lessons.map((l, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border p-2 rounded"
                  placeholder="Lesson title"
                  value={l.title}
                  onChange={(e) => {
                    const copy = [...lessons];
                    copy[i].title = e.target.value;
                    setLessons(copy);
                  }}
                />
                <button
                  onClick={() =>
                    setLessons(lessons.filter((_, idx) => idx !== i))
                  }
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setLessons([...lessons, { title: "" }])
              }
              className="text-indigo-600 text-sm"
            >
              + Add lesson
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateCourse}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     LIST VIEW
  ======================= */
  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-gray-500">
            Courses you have created
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-xl">
          <p className="text-gray-500">No courses yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role="teacher"
              onClick={() => {}}
              actionButton={
                <button className="text-indigo-600 text-sm">
                  Edit
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
