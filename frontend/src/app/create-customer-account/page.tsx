"use client";
import { Customer } from "@/definitions";
import { useCreateCustomerAccountMutation, useGetCustomersQuery } from "@/redux/queries/accounts/accountsApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { LuCirclePlus } from "react-icons/lu";
import { toast } from "react-toastify";

const CreateCustomerAccount = () => {
  const [createCustomerAccount, { isLoading }] =
    useCreateCustomerAccountMutation();
  const [accountType, setAccountType] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const { data: customers } = useGetCustomersQuery({}, {
    refetchOnMountOrArgChange: true,
  });

  const handleCreateAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCustomerAccount({
        userId: userId,
        accountType,
        initialDeposit: Number(amount),
      }).unwrap();
      toast.success("Account created successfully!");
      router.replace("/employee-dashboard");
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.error);
      } else {
        toast.error("Failed to delete listing. Please try again.");
      }
    }
  };
  return (
    <div className="flex mx-auto max-w-c-400 py-30 mt-5">
      <div className="w-full bg-white rounded-xl shadow-md p-6 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mb-4">
            <LuCirclePlus className="h-8 w-8 text-green" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Customer Account
          </h2>
          <p className="text-sm text-gray-500">
            Set up a bank account for a new customer
          </p>

          <form
            onSubmit={handleCreateAccount}
            className="w-full mt-6 flex flex-col gap-y-6"
          >
              <div className="relative w-full md:w-auto ">
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Customer
              </label>
              <select
                name="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              >
                <option value="">Select Customer</option>
                {customers?.customers?.map((customer: Customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.first_name} {customer.last_name}
                  </option>
                ))}
              </select>
              <BsChevronDown
                size={15}
                className="absolute top-[70%] right-4 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Account Type
              </label>
              <select
                name="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              >
                <option value="">Select Account</option>
                <option value="Savings">Savings</option>
                <option value="Checking">Checking</option>
              </select>
              <BsChevronDown
                size={15}
                className="absolute top-[70%] right-4 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            <div>
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Amount
              </label>
              <input
                type="number"
                placeholder="Amount"
                name="initialDeposit"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full 
                text-sm appearance-none py-3 
                shadow-sm px-4 font-normal rounded-xl border border-1
                  focus:outline-primary focus:border-primary 
                   focus:bg-white placeholder:text-sm md:placeholder:text-sm 
                   lg:placeholder:text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="bg-slate-200  px-4 text-lg md:text-sm py-2 rounded-lg"
              >
                Cancel
              </Link>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-green text-white px-4 text-lg md:text-sm py-2 rounded-lg"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerAccount;
