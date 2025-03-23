"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
import { FiRepeat } from "react-icons/fi";
import {
  useGetAccountsQuery,
  useTransferMutation,
} from "@/redux/queries/accounts/accountsApi";
import { Account } from "@/definitions";
import { FormEvent } from "react";
import { toast } from "react-toastify";

const Transfer = () => {
  const router = useRouter();
  const [transfer, { isLoading }] = useTransferMutation();
  const {
   
    data: accountsData,
  } = useGetAccountsQuery({}, { refetchOnMountOrArgChange: true });

  const handleTransfer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const senderAccountId = formData.get("senderAccount") as string;
    const recipientAccountId = formData.get("recipientAccount") as string;
    const amount = formData.get("amount") as string;
    const description = formData.get("description") as string;
    try {
      const response = await transfer({
        senderAccountId,
        recipientAccountId,
        amount,
        description,
      }).unwrap();
      const successMessage = response.message || "Transfer successful!";
      toast.success(successMessage);
      router.replace("/dashboard");
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
      }
    }
  };
  return (
    <div className="flex mx-auto max-w-c-400 py-30 mt-5">
      <div className="w-full bg-white rounded-xl shadow-md p-6 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiRepeat className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Transfer Funds
          </h2>
          <p className="text-sm text-gray-500">
            Transfer funds between your accounts
          </p>

          <form
            onSubmit={handleTransfer}
            className="w-full mt-6 flex flex-col gap-y-6"
          >
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="account"
                className="block text-sm
                         font-semibold  mb-2"
              >
                From Account
              </label>
              <select
                name="senderAccount"
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              >
                <option value="">Select Account</option>
                {accountsData?.accounts?.map((account: Account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountType} (
                    {account.accountNumber.slice(0, -4).replace(/./g, "*") +
                      account.accountNumber.slice(-4)}
                    ) - (${account.balance})
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
                To Account
              </label>
              <select
                name="recipientAccount"
                className="w-full 
                  text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              >
                <option value="">Select Account</option>
                {accountsData?.accounts?.map((account: Account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountType} (
                    {account.accountNumber.slice(0, -4).replace(/./g, "*") +
                      account.accountNumber.slice(-4)}
                    ) - (${account.balance})
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
                className="bg-slate-200  px-4 text-lg md:text-sm py-2 rounded-lg"
              >
                Cancel
              </Link>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-primary text-white px-4 text-lg md:text-sm py-2 rounded-lg"
              >
                {isLoading ? "Transferring..." : "Transfer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
