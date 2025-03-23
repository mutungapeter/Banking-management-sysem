"use client";


import { GoSearch } from "react-icons/go";
import { SlSocialDropbox } from "react-icons/sl";

import { Customer } from "@/definitions";
import { useGetCustomersQuery } from "@/redux/queries/accounts/accountsApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
const Customers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
 

  const initialFilters = useMemo(
    () => ({
      first_name: searchParams.get("first_name") || "",   
    }),
    [searchParams]
  );

  
  const [filters, setFilters] = useState(initialFilters);
 
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.first_name)
      params.set("first_name", filters.first_name);

    router.push(`?${params.toString()}`);
  }, [filters, router]);


  const { isLoading, data, error,  } = useGetCustomersQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
        setFilters((prev) => ({ ...prev, first_name: value }));
  }, 100);
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "first_name") {
      handleSearch(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
 


 console.log("data", data)

   return (
    <>
      <div className="bg-white w-full  p-2 md:p-4 shadow-md w-fulll md:max-w-c-1235 rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">
            All Customers
          </h2>
 </div>

        <div className="flex flex-col gap-3 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
          <div className="flex flex-col gap-3 px-2 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <div className=" relative w-full md:w-auto flex items-center gap-2  text-gray-500 focus-within:text-blue-600 rounded-full  ring-[1.5px] ring-gray-300 px-2 focus-within:ring-1 focus-within:ring-blue-600">
              <GoSearch size={20} className="" />
              <input
                type="text"
                placeholder="search by customer name"
                name="first_name"
                value={filters.first_name || ""}
                onChange={handleFilterChange}
                className=" w-full md:w-auto  text-gray-900 lg:w-[200px] text-sm px-2 py-2 bg-transparent outline-none  "
              />
            </div>
     
          </div>
        </div>
        <div className="relative  overflow-x-auto bg-white rounded-lg border">
          <table className="w-full table-auto">
            <thead>
              <tr
                className="bg-white text-gray-600 uppercase border-b text-xs font-semibold border-gray-200  
               leading-normal"
              >
                <th scope="col" className="px-4 py-3 text-xs  text-left">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-xs text-left">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-xs  text-left">
                  Phone
                </th>
              
              
                <th
                  scope="col"
                  className="px-4 py-3 text-xs md:text-sm  text-center"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    {/* <DashboardContentSpinner /> */}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="flex flex-col gap-4 items-center min-h-[40vh] justify-center space-x-6 text-#1F4772">
                      <SlSocialDropbox className="text-gray-500" size={50} />
                      <span>
                        {"data" in error && error.data
                          ? (error.data as { error?: string })?.error ||
                            "Internal Server Error"
                          : "Something went wrong. Please try again."}
                      </span>
                    </div>
                  </td>
                </tr>
              ): data?.customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="flex flex-col gap-4 items-center flex-wrap text-center mx-auto min-h-[30vh] justify-center col-span-full text-gray-500">
                      <SlSocialDropbox size={50} />
                      <span className=" font-semibold text-lg">
                        No customer found with the name {filters.first_name}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.customers?.map((customer: Customer) => (
                  <tr
                    key={customer._id}
                    className="border-b text-md font-thin border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-3 py-2  text-left text-sm  font-normal whitespace-nowrap">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="px-3 py-2 text-left text-sm font-normal whitespace-nowrap">
                      {customer.email}
                    </td>
                    <td className="px-3 py-2 text-left font-normal text-sm whitespace-nowrap">
                      {customer.phone}
                    </td>
                 

                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center space-x-4">
                    
                       
                        <Link
                          href={`/customers/${customer._id}`}
                          className="px-2 py-1 bg-white text-blue-600 hover:bg-opacity-90 cursor-pointer hover:bg-blue-600 hover:text-white border-blue-600 border rounded-md"
                        >
                          <span className="font-medium">Details</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      
      </div>
    </>
  );
};
export default Customers;
