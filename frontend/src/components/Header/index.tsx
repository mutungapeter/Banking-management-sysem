"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userLoggedOut } from "@/redux/queries/auth/authSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsCreditCard } from "react-icons/bs";
import {
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { menuItems } from "./menuData";

// Define role-based menu items
const adminMenuItems = [
  { path: "/employee-dashboard", label: "Dashboard", icon: FiHome },
  { path: "/new-employee", label: "New Employee", icon: FiUserPlus },
  { path: "/customers", label: "Customers", icon: GoPeople },
  { path: "/create-customer-account", label: "New Customer Bank Account", icon: BsCreditCard },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };
  const {
    user,
    // loading,
    // error
  } = useAppSelector((state: RootState) => state.auth);
  console.log(user);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push("/");
  };
  return (
    <header className="bg-white w-full shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center  ">
            <Link href="/" className="flex items-center gap-x-3">
              <BsCreditCard className="text-2xl text-primary" />
              <h1 className="text-2xl font-bold text-primary">BMS</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <FiHome className="mr-2 h-5 w-5" />
              <span>Home</span>
            </Link>
            {user && user.role === "customer" &&
              menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "text-white bg-primary"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`mr-2 h-5 w-5 ${isActive ? "text-white" : ""}`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
            {/* Admin-only menu items */}
            {user && user.role === "employee" && 
              adminMenuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "text-white bg-primary"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`mr-2 h-5 w-5 ${isActive ? "text-white" : ""}`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <FiLogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <FiLogIn className="mr-2 h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <FiUserPlus className="mr-2 h-5 w-5" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}

      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {user && user.role === "customer" && menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMenu}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "text-primary bg-gray-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : ""}`}
                />
                <span>{item.label}</span>
              </Link>
            );
            })}
            
          {/* Admin-only mobile menu items */}
          {user && user.role === "employee" && 
            adminMenuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeMenu}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-primary bg-gray-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : ""}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 w-full"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <FiLogIn className="mr-3 h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <FiUserPlus className="mr-3 h-5 w-5" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
