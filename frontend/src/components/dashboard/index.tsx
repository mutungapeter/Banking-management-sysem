"use client";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetTotalBalanceQuery,
  useGetTransactionsQuery
} from "@/redux/queries/accounts/accountsApi";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { PageLoadingSpinner } from "../commons/Spinner";
import AccountsList from "./AccountsList";
import QuickActions from "./QuickActions";
import RecentTransactions from "./RecentTransactions";
import TotalBalance from "./TotalBalance";

const Dashboard = () => {
  const { user, loading: isLoadingAuth } = useAppSelector((state: RootState) => state.auth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: balanceData,
    refetch: refetchTotalBalance,
  } = useGetTotalBalanceQuery({}, { refetchOnMountOrArgChange: true });


  const {
    data: transactionsData,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({}, { refetchOnMountOrArgChange: true });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchTotalBalance();
    
    refetchTransactions().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    });
  };

  if (isLoadingAuth) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="flex mx-auto max-w-c-500 py-30 mt-5">
      <div className="w-full flex flex-col gap-y-7">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Hello, {user?.first_name}!
            </h1>
            <p className="text-sm md:text-lg font-normal ">
              Here is your account summary
            </p>
          </div>
          <LuRefreshCw
            size={29}
            className={`text-gray-500 cursor-pointer ${
              isRefreshing ? "animate-spin" : ""
            }`}
            onClick={handleRefresh}
          />
        </div>
        
        <TotalBalance totalBalance={balanceData?.totalBalance} />
        <QuickActions />
        <AccountsList  />
        <RecentTransactions transactions={transactionsData || []} />
      </div>
    </div>
  );
};

export default Dashboard;
