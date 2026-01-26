import userService from "../../service/userService";
import AddUserForm from "../../components/admin/AddUserForm";

const AddUserPage = () => {
  const handleSubmit = async (form) => {
    await userService.addUser(form);
    alert("Thêm user thành công");
  };

  return <AddUserForm onSubmit={handleSubmit} />;
};

export default AddUserPage;