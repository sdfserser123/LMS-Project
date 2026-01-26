import { useState } from "react"
import { toast } from "sonner";
import userService from "../../service/userService";

export default function AddUserForm() {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "student"
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await userService.addUser(form)
    toast.success('Thêm user thành công!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullname" placeholder="Họ tên" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <select name="role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Thêm</button>
    </form>
  )
}
