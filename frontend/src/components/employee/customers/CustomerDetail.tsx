"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";


import { PageLoadingSpinner } from "@/components/commons/Spinner";
import { useGetCustomerDetailsQuery, useUpdateCustomerProfileMutation } from "@/redux/queries/accounts/accountsApi";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";
import { toast } from "react-toastify";
import AccountsList from "./customerAccounts";
import CustomerTransactions from "./customerTransactions";

interface CustomerDetailsInterface {
  customer_id: string;
}

const CustomerDetails = ({ customer_id }: CustomerDetailsInterface) => {

  const { data, isLoading, error, refetch } = useGetCustomerDetailsQuery(customer_id);
  const [updateCustomerProfile, { isLoading: isUpdating }] = useUpdateCustomerProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });

  // Initialize form data when customer data is loaded
  useEffect(() => {
    if (data?.customer ) {
      setFormData({
        first_name: data.customer.first_name || "",
        last_name: data.customer.last_name || "",
        email: data.customer.email || "",
        phone: data.customer.phone || ""
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const id = data?.customer?.id;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (!id) {
            toast.error("Customer ID is missing");
            return;
          }
          const updateData = {
            id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone
          };
          
          console.log("Sending update data:", updateData); 
    
    await updateCustomerProfile(updateData).unwrap();
      toast.success("Customer profile updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update customer profile");
    }finally{
        refetch()
    }
  };

  console.log("data", data);

  return (
    <>
      {isLoading ? (
        <PageLoadingSpinner />
      ) : error || !data ? (
        <section className="py-20 bg-white text-center">
          <h2 className="text-xl md:text-3xl font-bold text-red-500">
            Failed to load customer details.
          </h2>
        </section>
      ) : (
        <>
          <Link
            href="/customers"
            className="flex items-center w-max gap-x-3 mt-4 mb-4 cursor-pointer font-nunito"
          >
            <BsArrowLeftShort size={30} className="text-darkBlue " />
            <h2 className="text-lg  text-darkBlue font-nunito md:text-lg lg:text-lg font-bold">
              Back
            </h2>
          </Link>
          <div className=" flex gap-4 flex-col p-3 md:flex-row">
            <div className="w-full lg:w-3/5 flex flex-col gap-5">
              <div className="bg-white p-6 rounded-md shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {data?.customer?.first_name ? (
                      <span className="text-3xl font-bold text-gray-600">
                        {data.customer.first_name.charAt(0)}
                        {data.customer.last_name?.charAt(0)}
                      </span>
                    ) : (
                      <Image
                        src="/avatar.png"
                        alt="Customer"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {data.customer.first_name} {data.customer.last_name} 
                      </h2>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FiEdit /> {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>
                    <p className="text-gray-500">
                      Customer ID: {data.customer.id}
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="border rounded-md p-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="border rounded-md p-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border rounded-md p-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border rounded-md p-2"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isUpdating ? "Updating..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="font-medium">{data.customer.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="font-medium">{data.customer.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#F4F9FF] p-6 rounded-md shadow-sm">
            
                <AccountsList customer_id={customer_id} />
                
              </div>
            </div>
            <div className="w-full lg:w-2/5  flex flex-col gap-8 bg-white p-2 rounded-md">
              <CustomerTransactions transactions={data?.transactions} />
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CustomerDetails;
