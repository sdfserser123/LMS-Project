import { api } from "../lib/axios";

const userService = {
  addUser: (data) => api.post("/users/adduser", data),
};

export default userService;