"use client";
import { PageLoadingSpinner } from "@/components/commons/Spinner";
import { useAppSelector } from "@/redux/hooks";
import { useGetCustomersQuery } from "@/redux/queries/accounts/accountsApi";
import { RootState } from "@/redux/store";
import { LuUsers } from "react-icons/lu";

const EmployeeDashboard = () => {
    const { user, loading: isLoadingAuth } = useAppSelector((state: RootState) => state.auth);
    const { isLoading, data, error,  } = useGetCustomersQuery({}, {
        refetchOnMountOrArgChange: true,
      });
  if (isLoadingAuth) {
    return <PageLoadingSpinner />;
  }



  return (
    <div className="flex mx-auto max-w-c-500 py-30 mt-5">
      <div className="w-full flex flex-col gap-y-7">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome to your dashboard ({user?.first_name})
            </h1>
           
          </div>
          
        </div>
        
        {/* Customer Count Card */}
        <div className="mx-auto max-w-c-300"> 

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <LuUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Customers</h3>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : error ? (
                    <span className="text-red-500">Error</span>
                  ) : (
                    data?.customers?.length || 0
                  )}
                </p>
              </div>
            </div>
           
          </div>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default EmployeeDashboard;

