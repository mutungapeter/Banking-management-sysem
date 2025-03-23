"use client";
import DeleteConfirmationModal from "@/components/commons/deleteModal";
import { PageLoadingSpinner } from "@/components/commons/Spinner";
import { Account } from "@/definitions";
import { useAppSelector } from "@/redux/hooks";
import {
  useDeleteAccountMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/queries/accounts/accountsApi";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { LuTrash, LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

// Add interface for profile data structure
interface ProfileData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  accounts: Account[];
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

const Profile = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [updateProfile, { isLoading}] =
    useUpdateProfileMutation();
  const {
    data: profileData,
    refetch,
  } = useGetProfileQuery<{ data: ProfileData }>({});
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  console.log("profileData", profileData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");


  const [deleteAccount, {isLoading: isDeleteLoading}] = useDeleteAccountMutation();
  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    try {
      await updateProfile({
        first_name,
        last_name,
        email,
        phone,
      }).unwrap();
      toast.success("Profile updated successfully!");
      
      router.push("/profile");
      router.refresh();
      setIsEditing(false);
      refetch();
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
   const handleDeleteAccount = async () => {
    try {
      await deleteAccount(selectedAccountId).unwrap();
      toast.success("Bank Account deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { message: string } }).data;
        console.log("errorData", errorData);
        toast.error(errorData.message);
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    }
  };
  const openDeleteModal = (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAccountId("");
  };
  console.log("profileData",profileData)
  return (
    <Suspense fallback={<PageLoadingSpinner />}>

    <div className="flex flex-col gap-6 mx-auto max-w-c-500 py-30 mt-5 font-nunito">
      <div className="w-full bg-white rounded-xl shadow-md p-6 mx-auto">
        <div className=" w-full flex flex-col ">
          <div className="w-full flex flex-col gap-4 md:flex-row items-center md:justify-between">
            <div className="flex flex-col items-center md:flex-row gap-y-2 md:gap-y-0 gap-x-2 md:justify-normal w-full">
              <div className="w-10 h-10 p-2 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                <LuUser className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex flex-col gap-y-1 items-center md:items-start">
                <p className="text-lg font-semibold text-center md:text-left">
                  {profileData?.user.first_name || user?.first_name} {profileData?.user.last_name || user?.last_name}
                </p>
                <p className="text-lg font-mediums text-center md:text-left">{profileData?.user.email || user?.email} </p>
              </div>
            </div>
            {!isEditing && (
              <button
                className="bg-primary flex items-center justify-center text-white px-4 text-sm py-2 rounded-lg whitespace-nowrap"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing && (
            <form
              className="w-full mt-6 flex flex-col gap-y-6"
              onSubmit={handleUpdateProfile}
            >
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
                    defaultValue={
                      profileData?.user.first_name || user?.first_name || ""
                    }
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
                    defaultValue={
                      profileData?.user.last_name || user?.last_name || ""
                    }
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
                  defaultValue={profileData?.user.email || user?.email || ""}
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
                  defaultValue={profileData?.user.phone || user?.phone || ""}
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
                  type="button"
                  className="bg-red-500 text-white px-4 text-lg md:text-sm py-2 rounded-lg"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary  text-white px-4 text-lg md:text-sm py-2 rounded-lg"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {!isEditing && (
            <div className="w-full mt-6 flex flex-col gap-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="relative w-full md:w-auto">
                  <label className="block text-sm font-semibold mb-2">
                    First Name
                  </label>
                  <p className="w-full text-sm py-3 px-4 font-normal rounded-xl border border-1 bg-gray-50">
                    {profileData?.user.first_name || user?.first_name || ""}
                  </p>
                </div>
                <div className="relative w-full md:w-auto">
                  <label className="block text-sm font-semibold mb-2">
                    Last Name
                  </label>
                  <p className="w-full text-sm py-3 px-4 font-normal rounded-xl border border-1 bg-gray-50">
                    {profileData?.user.last_name || user?.last_name || ""}
                  </p>
                </div>
              </div>
              <div className="relative w-full md:w-auto">
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <p className="w-full text-sm py-3 px-4 font-normal rounded-xl border border-1 bg-gray-50">
                  {profileData?.user.email || user?.email || ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <p className="w-full text-sm py-3 px-4 font-normal rounded-xl border border-1 bg-gray-50">
                  {profileData?.phone || user?.phone || ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-[#F6FAFF] rounded-xl shadow-md p-6 mx-auto">
        <h2 className="text-lg font-bold">Your Accounts</h2>
        <div className="flex flex-col gap-y-4">
          {profileData?.accounts.map((account: Account) => (
            <div 
            key={account.id}
            className="flex flex-col gap-y-2 bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-1">
                  <p className="text-lg font-semibold">{account.accountType}</p>
                  <p className="text-sm">
                    Account Number: {account.accountNumber}
                  </p>
                  <p className="text-lg font-semibold">$ {account.balance}</p>
                </div>
                <div 
                onClick={() => openDeleteModal(account.id)}
                className="w-10 h-10 p-2 bg-red-100 rounded-full cursor-pointer flex items-center justify-center mb-4">
                  <LuTrash className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteAccount}
        confirmationMessage="Are you sure you want to delete this account?"
        deleteMessage="This action cannot be undone."
        isLoading={isDeleteLoading}
      />    
    </div>
    </Suspense>
  );
};

export default Profile;
