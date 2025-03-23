import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { Transaction } from "@/definitions";
import { formatTransaction } from "@/utils/formatTransaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className="flex flex-col w-full gap-y-2">
      <h2 className="text-lg font-semibold font-satoshi">
        Recent Transactions
      </h2>
      <div className="flex flex-col gap-y-2 md:p-3 p-2 w-full bg-white rounded-xl shadow-md ">
        <h2 className=" font-medium text-lg mt-3 mb-3 p-4">
          Recent Activity
        </h2>
        <div className="flex flex-col gap-y-5 p-4 ">
          {transactions.length > 0 ? (
            transactions.map((transaction: Transaction) => {
              const { id, title, details, formattedDate, formattedTime, isOutgoing, amount } = formatTransaction(transaction);
              
              return (
                <div key={id} className="flex items-center gap-x-3">
                  <div className={`p-2 rounded-full ${isOutgoing ? "bg-red-100" : "bg-green/10"}`}>
                    {isOutgoing ? (
                      <GoArrowUpRight size={17} className="text-red-500" />
                    ) : (
                      <GoArrowDownLeft size={17} className="text-green" />
                    )}
                  </div>
                  <div className="flex md:items-center md:flex-row flex-col flex-grow md:gap-x-3 gap-x-1">
                    <div className="flex flex-col gap-y-1 flex-grow">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs font-normal">
                        {formattedDate} • {formattedTime}
                      </p>
                      <p className="text-sm text-primary font-normal">{details}</p>
                    </div>
                    <p className={`text-sm ${isOutgoing ? "text-red-500" : "text-green"} font-normal ml-auto`}>
                      {isOutgoing ? "-" : "+"}${amount}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">
              No recent transactions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions; 