import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/userAuthStore";


const logInSchema = z.object({
    username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const LoginForm = () => {
  const logIn = useAuthStore((state) => state.logIn);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(logInSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { username, password} = data;
      await logIn(username, password);
      navigate('/home')
    } catch (err) {
        
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Lumina LMS</h1>
          <p className="text-indigo-100">Login to your account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="w-full border rounded-lg p-3"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full border rounded-lg p-3"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};