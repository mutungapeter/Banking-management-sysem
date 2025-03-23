"use client";
import { useRegisterFirstEmployeeMutation } from "@/redux/queries/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

const FirstEmployeeRegister = () => {
  const [register, { isLoading }] = useRegisterFirstEmployeeMutation();
  const router = useRouter();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await register({ first_name, last_name, email, phone, password }).unwrap();
      toast.success(response.message || "Registration successful");
      router.push("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);
      
      // Define a proper type for the error object
      interface ApiError {
        data?: {
          error?: string;
          message?: string;
        };
      }
      
      if (error && typeof error === "object" && "data" in error) {
        const errorData = (error as ApiError).data;
        
        // Check for duplicate key error
        if (errorData?.error && typeof errorData.error === 'string' && errorData.error.includes('duplicate key error')) {
          if (errorData.error.includes('phone_1 dup key')) {
            toast.error("Phone number is already registered");
          } else if (errorData.error.includes('email_1 dup key')) {
            toast.error("Email is already registered");
          } else {
            toast.error("A user with this information already exists");
          }
        } else {
          toast.error(errorData?.message || "Registration failed");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex mx-auto max-w-c-400 py-30 mt-5">
      <div className="w-full bg-white rounded-xl shadow-md p-6 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LuUser className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">First Employee Register</h2>
          <p className="text-sm text-gray-500">Create an employee account</p>

          <form className="w-full mt-6 flex flex-col gap-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
               First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                name="first_name"
                required
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              />
            </div>
            <div className="relative w-full md:w-auto ">
                <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                name="last_name"
                required
                className="w-full 
                text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
           
              />

            </div>
            </div>
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
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                required
                className="w-full 
                text-sm appearance-none py-3 
                shadow-sm px-4 font-normal rounded-xl border border-1
                  focus:outline-primary focus:border-primary 
                   focus:bg-white placeholder:text-sm md:placeholder:text-sm 
                   lg:placeholder:text-sm"
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
            <div>
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
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
                type="submit"
                disabled={isLoading}
                className="bg-primary w-full text-white px-4 text-lg md:text-sm py-2 rounded-lg">
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
            <div className="flex items-center gap-x-2">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="text-sm text-primary font-medium"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FirstEmployeeRegister;
