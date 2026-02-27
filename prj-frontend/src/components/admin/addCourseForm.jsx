import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../service/courseService";
import { toast } from "sonner";

export default function AddCourseForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.createCourse(form);
      toast.success("Thêm khóa học mới thành công!");
      navigate("/admin/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo khóa học");
    }
  }; // Đóng hàm handleSubmit tại đây

  // Khối return này PHẢI nằm trong AddCourseForm
  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Tạo khóa học mới</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Tên khóa học</label>
          <input 
            name="title" 
            placeholder="Ví dụ: Lập trình ReactJS cơ bản" 
            onChange={handleChange} 
            required 
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Mô tả khóa học</label>
          <textarea 
            name="description" 
            placeholder="Nhập mô tả chi tiết nội dung khóa học..." 
            onChange={handleChange} 
            rows="5"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/courses')}
            style={{ ...btnStyle, backgroundColor: '#f3f4f6', color: '#1f2937' }}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            style={{ ...btnStyle, backgroundColor: 'black', color: 'white', flex: 1 }}
          >
            Lưu khóa học
          </button>
        </div>
      </form>
    </div>
  );
} // Đóng component AddCourseForm ở cuối cùng

const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' };
const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' };
const btnStyle = { padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' };