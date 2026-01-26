import { api } from "../lib/axios";

export const authService = {
  logIn: async (username, password) => {
    console.log("LOGIN REQUEST:", { username, password });
    const res = await api.post(
      "auth/login",
      { username, password },
      { withCredentials: true }
    );

    return res.data;
  },
};
