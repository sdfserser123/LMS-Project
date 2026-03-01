import AddCourseForm from "../../components/admin/addCourseForm";
import { courseService } from "../../service/courseService";

const AddCoursePage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <AddCourseForm />
    </div>
  );
};

export default AddCoursePage;