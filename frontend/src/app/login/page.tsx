'use client'
import { useLoginMutation } from "@/redux/queries/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
   
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      await login({ email, password }).unwrap();
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { message: string } }).data;
        toast.error(errorData.message || "Login failed");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex mx-auto max-w-c-300 py-30 mt-5">
      <div className="w-full bg-white rounded-xl shadow-md p-6 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LuUser className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Login</h2>
          <p className="text-sm text-gray-500">Login to your account</p>

          <form className="w-full mt-6 flex flex-col gap-y-6" onSubmit={handleSubmit}>
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                className="w-full 
                text-sm appearance-none py-3 
                shadow-sm px-4 font-normal rounded-xl border border-1
                  focus:outline-primary focus:border-primary 
                   focus:bg-white placeholder:text-sm md:placeholder:text-sm 
                   lg:placeholder:text-sm"
              />
            </div>

            <div className="flex items-center w-full justify-between">
              <button 
              disabled={isLoading}
              type="submit"
              className="bg-primary w-full text-white  px-4 text-lg md:text-sm py-2 rounded-lg">
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="flex items-center gap-x-2">
              <span>Don&apos;t have an account?</span>
              <Link
                href="/register"
                className="text-sm text-primary font-medium"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
