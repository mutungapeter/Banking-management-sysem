'use client'
import { Account } from "@/definitions";
import { useDepositMutation, useGetAccountsQuery } from "@/redux/queries/accounts/accountsApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { BsChevronDown } from "react-icons/bs";
import { LuCirclePlus } from "react-icons/lu";
import { toast } from "react-toastify";

const Deposit = () => {
  const [deposit, {isLoading}] = useDepositMutation();

  const router = useRouter();
  const { data: accountsData } = useGetAccountsQuery({},{ refetchOnMountOrArgChange: true });
 


  const handleDeposit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const accountId = formData.get("account") as string;
    const amount = formData.get("amount") as string;
    const description = formData.get("description") as string;
    try {
      await deposit({accountId, amount, description}).unwrap();
      toast.success("Deposit successful!");
      router.replace("/dashboard");
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
      } else {
        toast.error("Failed to deposit funds. Please try again.");
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
            Deposit Funds
          </h2>
          <p className="text-sm text-gray-500">
            Deposit funds into your account
          </p>

          <form onSubmit={handleDeposit} className="w-full mt-6 flex flex-col gap-y-6">
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Account
              </label>
              <select
                name="account"
                
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              >
                <option value="">Select Account</option>
                {accountsData?.accounts?.map((account: Account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountType} ({account.accountNumber.slice(0, -4).replace(/./g, '*') + account.accountNumber.slice(-4)}) - (${account.balance})
                  </option>
                ))}
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
                name="amount"
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
                htmlFor="message"
                className="block  md:text-sm text-sm   font-semibold  mb-2"
              >
                Description(optional)
              </label>
              <textarea
                id="message"
                name="description"
                placeholder="Whats the transfer for?"
                className="w-full resize-y h-20
                          py-2 px-4 rounded-md border border-1 
                           focus:outline-primary focus:border-primary focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link 
              href="/dashboard"
              className="bg-slate-200  px-4 text-lg md:text-sm py-2 rounded-lg">
                Cancel
              </Link>
              <button 
              disabled={isLoading}
              type="submit"
              className="bg-green text-white px-4 text-lg md:text-sm py-2 rounded-lg">
                {isLoading ? "Depositing..." : "Deposit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
