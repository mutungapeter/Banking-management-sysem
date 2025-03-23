import Link from "next/link";
import { BsCreditCard } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { FiChevronRight, FiSmartphone } from "react-icons/fi";
import { RiSecurePaymentLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="flex flex-col max-w-c-800 mx-auto py-20 min-h-screen font-satoshi">
      <div className="flex flex-col items-center justify-center flex-wrap p-5 md:py-10 gap-7">
        <h2 className="text-3xl font-bold text-center md:text-5xl">
          <span className="text-primary">Welcome to the Bank&apos;s</span> Account
          Management System
        </h2>
        <p className="text-lg text-gray-500 ">
          A complete system for managing your accounts and transactions with
          ease and security.
        </p>
        <div className="flex w-full items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-x-6 w-full">
            <Link
              href="/register"
              className="bg-primary text-white font-medium px-4 py-2 rounded-md"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="bg-white border  font-medium border-primary text-primary px-4 py-2 rounded-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full mt-10 bg-[#F4F9FF] p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-md">
            <div className=" p-2 h-max bg-primary/10 rounded-lg text-center w-max ">
              <BsCreditCard size={40} className="text-primary " />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold">Multiple Accounts</h3>
              <p className="text-gray-500">
                Manage all your accounts in one place, easily transfer between
                them.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-md">
            <div className=" p-2 h-max bg-primary/10 rounded-lg text-center w-fit">
              <RiSecurePaymentLine size={40} className="text-primary " />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold">Secure Banking</h3>
              <p className="text-gray-500">
                Your data is secure with us, we use the latest encryption
                technology to protect your data.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-md">
            <div className=" p-2 h-max bg-primary/10 rounded-lg text-center w-fit">
              <FiSmartphone size={40} className="text-primary " />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold">Easy Access</h3>
              <p className="text-gray-500">
                Access your accounts from anywhere, anytime.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-md">
            <div className=" p-2 h-max bg-primary/10 rounded-lg text-center w-fit">
              <FaRegClock size={40} className="text-primary " />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold">24/7 Support</h3>
              <p className="text-gray-500">
                Our support team is here to help you with any questions or
                issues.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 flew-wrap items-center w-full mt-10 bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center">
          Ready to get started?
        </h2>
        <p className="text-gray-500 text-lg">
          Join thousands of users who trust our banking system for their
          financial needs..
        </p>
        <div className="flex w-full items-center justify-center ">
          <Link
            href="/register"
            className="bg-primary gap-4 inline-flex items-center text-white font-medium px-4 py-2 rounded-md"
          >
           <span>Get Started</span>
           <FiChevronRight size={20} className="text-white" />
          </Link>

          
        </div>
      </div>
    </div>
  );
}
