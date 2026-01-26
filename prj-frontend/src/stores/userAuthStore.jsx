import { create } from "zustand"
import { toast } from "sonner"
import { authService } from "../service/authService"

/**
 * @type {import('../type/store').AuthState}
 */
export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({accessToken: null, user: null, loading: false})
  },

  logIn: async (username, password) => {
    try {
      set({ loading: true })
      console.log('Đang truy cập')
      const { accessToken, user } = await authService.logIn(username, password)

      set({
        accessToken,
        user,
        loading: false,
      })

      toast.success("Đăng nhập thành công 🎉!")
    } catch (error) {
      set({ loading: false })

      toast.error(
        error?.response?.data?.message || "Đăng nhập thất bại"
      )

      throw error
    }
  },

  logOut: () => {
    try {
      get().clearState();
      authService.logOut();
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi Đăng xuất, hãy thử lại")
    }
  },
}))

