import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { api } from '../lib/axios';

const StudentCourseView = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    // Gọi API lấy toàn bộ bài giảng của khóa học
    api.get(`/courses/content/${courseId}`).then(res => {
      setLessons(res.data);
      if (res.data.length > 0) setCurrentLesson(res.data[0]);
    });
  }, [courseId]);

  if (!currentLesson) return <div>Đang tải bài học...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar danh sách bài học */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <h2 className="p-4 font-bold border-b">Nội dung khóa học</h2>
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            onClick={() => setCurrentLesson(lesson)}
            className={`p-4 cursor-pointer hover:bg-blue-50 ${currentLesson.id === lesson.id ? 'bg-blue-100 border-l-4 border-blue-600' : ''}`}
          >
            {index + 1}. {lesson.title}
          </div>
        ))}
      </div>

      {/* Nội dung bài học */}
      <div className="w-3/4 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
        
        {/* Video Player */}
        {currentLesson.video_url && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            <ReactPlayer 
              url={`http://localhost:5001${currentLesson.video_url}`} 
              controls 
              width="100%" 
              height="100%"
              config={{ file: { attributes: { controlsList: 'nodownload' } } }} // Hạn chế chuột phải tải video
            />
          </div>
        )}

        {/* Text nội dung */}
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow mb-6">
          <p>{currentLesson.content}</p>
        </div>

        {/* Tài liệu đính kèm */}
        {currentLesson.attachments && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Tài liệu học tập:</h3>
            <ul className="list-disc pl-5">
              {JSON.parse(currentLesson.attachments).map((file, i) => (
                <li key={i}>
                  <a 
                    href={`http://localhost:5001${file.url}`} 
                    download 
                    className="text-blue-600 hover:underline"
                  >
                    {file.name} (Bấm để tải về)
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};