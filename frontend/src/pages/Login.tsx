/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import { toast } from "react-toastify";

import { useAuth } from "@/context/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin0011");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    try {
      setLoading(true);
      const res = await login(email, password);
      console.log(res);
      setLoading(false);
      toast.success("login successfull");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message);
      console.log(err);
    }

    console.log("Logging in with", email, password);
  };

  return (
    <div className=" flex items-center justify-center h-full">
      <div className="w-96 mx-auto px-8 py-12  bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700"
            />
          </div>

          {/* Submit Button */}
          <Button variant={"secondary"} size={"lg"} disabled={loading}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
