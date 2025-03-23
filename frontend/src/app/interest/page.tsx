'use client'
import { Account } from "@/definitions";
import { useApplyInterestMutation, useCalculateInterestMutation, useGetAccountsQuery } from "@/redux/queries/accounts/accountsApi";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { LuCalculator, LuPercent } from "react-icons/lu";
import { toast } from "react-toastify";

const CalculateInterest = () => {
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [calculateInterest, {isLoading: isLoadingCalculateInterest, }] = useCalculateInterestMutation();
  const [applyInterest, {isLoading: isLoadingApplyInterest}] = useApplyInterestMutation();
  const router = useRouter();
  const {  data: accountsData, } = useGetAccountsQuery({},{ refetchOnMountOrArgChange: true });
 const [interestResult, setInterestResult] = useState<{

  currentBalance: string;
  interestRate: string;
  termYears: number;
  interestEarned: string;
  projectedBalance: string;
} | null>(null);
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = e.target.value;
    const account = accountsData?.accounts?.find((account: Account) => account.id === accountId);
    setSelectedAccount(account || null);
  };

  const handleCalculateInterest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const accountId = formData.get("account") as string;
    const interestRate = formData.get("interestRate") as string;    
    const termYears = formData.get("termYears") as string;
    try {
      const result = await calculateInterest({accountId, interestRate, termYears}).unwrap();
      console.log("result", result);
      setInterestResult({
  
        currentBalance: result.currentBalance,
        interestRate: result.interestRate,
        termYears: result.termYears,
        interestEarned: result.interestEarned,
        projectedBalance: result.projectedBalance
      });

      const successMsg = result.message || "Interest calculated successfully!";
      toast.success(successMsg);
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
      } else {
        toast.error("Failed to calculate interest. Please try again.");
      }
    }
  };
  

  const handleApplyInterest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const accountId = formData.get("account") as string;
    const interestRate = formData.get("interestRate") as string;    
    const termYears = formData.get("termYears") as string;
    try {
      const result = await applyInterest({accountId, interestRate, termYears}).unwrap();
      console.log("result", result);
      const successMsg = result.message || "Interest applied successfully!";
      toast.success(successMsg);
      setInterestResult(null);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = (error as { data: { error: string } }).data;
        toast.error(errorData.error);
      } else {
        toast.error("Failed to apply interest. Please try again.");
      }
    }
  };
  return (
    <div className="flex mx-auto max-w-c-400 py-30 mt-5">
      <div className="w-full bg-white rounded-xl shadow-md p-6 mx-auto">
        <div className="flex w-full flex-col items-center ">
            <div className="w-full flex items-center gap-x-4">         
            <LuCalculator  className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">
            Interest Calculator
          </h2>
            </div>
          <p className="text-sm text-gray-500">
          Calculate and apply interest to your accounts
          </p>
          
        

          <form onSubmit={handleCalculateInterest} className="w-full mt-6 flex flex-col gap-y-6">
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
                required
                onChange={handleAccountChange}
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
              <div className="w-full py-3 px-4 font-normal rounded-xl border border-1 bg-gray-100 text-sm">
                {selectedAccount ? `$${selectedAccount.balance}` : 'Select an account to see balance'}
              </div>
              <input type="hidden" name="amount" value={selectedAccount?.balance || ""} />
            </div>
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="interestRate"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Interest Rate
              </label>
              <input
                type="text"
                required
                name="interestRate"
                placeholder="Interest Rate"
                className="w-full 
                text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              />
               <LuPercent className="absolute top-[70%] right-4 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative w-full md:w-auto ">
              <label
                htmlFor="termYears"
                className="block text-sm
                         font-semibold  mb-2"
              >
                Term (Years)
              </label>
              <input
                type="text"
                name="termYears"
                required
                placeholder="Term (Years)"
                className="w-full 
                text-sm appearance-none py-3 shadow-sm px-4 font-normal rounded-xl border border-1  focus:outline-primary focus:border-primary  focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            />
           
            </div>
            
             
              <button 
              disabled={isLoadingCalculateInterest}
              type="submit"
              className="bg-primary w-full text-white px-4 text-lg md:text-sm py-2 rounded-lg">
                {isLoadingCalculateInterest ? "Calculating..." : "Calculate Interest"}
              </button>
          
          </form>
          
   
          {interestResult && (
            <div className="mt-4 w-full p-4 bg-green/10 rounded-xl border border-green">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Interest Calculation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
               
               
                <div>
                  <p className="text-sm font-normal text-gray-600">Interest Earned</p>
                  <p className="text-sm font-semibold text-green">${interestResult.interestEarned}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Projected Balance</p>
                  <p className="text-sm font-semibold">${interestResult.projectedBalance}</p>
                </div>
              </div>
              
              {/* Add Apply Interest button */}
              <form onSubmit={handleApplyInterest} className="mt-4">
                <input type="hidden" name="account" value={selectedAccount?.id || ""} />
                <input type="hidden" name="interestRate" value={interestResult.interestRate.replace('%', '')} />
                <input type="hidden" name="termYears" value={interestResult.termYears.toString()} />
                <button 
                  type="submit"
                  disabled={isLoadingApplyInterest}
                  className="w-full bg-green text-white px-4 py-2 rounded-lg">
                  {isLoadingApplyInterest ? "Applying..." : "Apply This Interest"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateInterest;
