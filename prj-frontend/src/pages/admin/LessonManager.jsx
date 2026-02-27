import React, { useState } from 'react';
import { courseService } from '../../service/courseService';
import { toast } from 'sonner';

const LessonManager = ({ courseId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [docFiles, setDocFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Dùng FormData để gửi file qua API
    const formData = new FormData();
    formData.append('course_id', courseId);
    formData.append('title', title);
    formData.append('content', content);
    if (videoFile) formData.append('video', videoFile);
    
    // Upload nhiều tài liệu
    for (let i = 0; i < docFiles.length; i++) {
      formData.append('docs', docFiles[i]);
    }

    try {
      await courseService.upsertLesson(formData);
      toast.success("Tải lên bài giảng thành công!");
      // Reset form
      setTitle(''); setContent(''); setVideoFile(null); setDocFiles([]);
    } catch (error) {
      toast.error("Lỗi khi tải lên bài giảng");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-bold mb-4">Thêm bài giảng mới</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="text" placeholder="Tiêu đề bài học" className="w-full p-2"
          onChange={(e) => setTitle(e.target.value)} required 
        />
        
        <textarea 
          placeholder="Nội dung bài học (Text)" className="w-full p-2"
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium">Video bài giảng:</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm font-medium">Tài liệu đính kèm (Nhiều file):</label>
          <input type="file" multiple onChange={(e) => setDocFiles(e.target.files)} />
        </div>

        <button 
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {uploading ? "Đang tải lên... (Vui lòng đợi)" : "Lưu bài giảng"}
        </button>
      </form>
    </div>
  );
};