"use client";
import { Account } from "@/definitions";
import {
    useGetCustomerAccountsByIdQuery
} from "@/redux/queries/accounts/accountsApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsCreditCard } from "react-icons/bs";
import { GoArrowUpRight } from "react-icons/go";

const AccountsList = ({ customer_id }: { customer_id: string }) => {
  console.log("customer_id", customer_id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => ({
      accountType: searchParams.get("accountType") || "",
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.accountType) params.set("accountType", filters.accountType);

    router.push(`?${params.toString()}`);
  }, [filters, router]);

  const { data: accountsData } = useGetCustomerAccountsByIdQuery(
    { id: customer_id, accountType: filters.accountType },
    { refetchOnMountOrArgChange: true }
  );
  console.log("accountsData", accountsData);
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const accounts = accountsData?.accounts || [];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center md:flex-row flex-col gap-2 md:gap-0 md:justify-between">
        <h2 className="text-lg font-semibold font-satoshi">Accounts</h2>
        {accounts.length > 0 && (
          <div className="relative w-full md:w-auto min-w-[150px] ">
            <select
              name="accountType"
              onChange={handleFilterChange}
              value={filters.accountType}
              className="w-full 
                text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">All accounts</option>
              <option value="Savings">Savings</option>
              <option value="Checking">Checking</option>
            </select>
            <BsChevronDown
              size={15}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        )}
      </div>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts.map((account: Account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg cursor-pointer
              flex flex-col gap-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <BsCreditCard size={25} className="text-primary" />
                  <p className="text-sm font-normal">{account.accountType}</p>
                </div>
                <GoArrowUpRight
                  size={18}
                  className="text-primary cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-x-3">
                <p className="text-sm font-normal">Account Number</p>
                <p className="text-sm font-normal">
                  {account.accountNumber.slice(0, -4).replace(/./g, "*") +
                    account.accountNumber.slice(-4)}
                </p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm font-normal">Available Balance</p>
                <p className="text-sm md:text-lg font-bold">
                  ${account.balance}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-10 bg-white rounded-xl shadow-md">
          <Link
            href="/create-account"
            className="bg-green text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccountsList;
