import Link from "next/link";
import { FiRepeat } from "react-icons/fi";
import { LuCirclePlus, LuCircleMinus, LuPercent } from "react-icons/lu";

const QuickActions = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-lg font-semibold font-satoshi">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/transfer"
          className="flex flex-col items-center justify-center 
            bg-white rounded-xl px-7 py-5 shadow-md gap-y-3 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-primary">
            <FiRepeat size={25} className="text-white" />
          </div>
          <p className="text-lg font-medium font-satoshi">Transfer</p>
        </Link>
        <Link
          href="/deposit"
          className="flex flex-col items-center justify-center 
                bg-white rounded-xl p-5 shadow-md gap-y-3 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-green">
            <LuCirclePlus size={25} className="text-white" />
          </div>
          <p className="text-sm font-medium font-satoshi">Deposit</p>
        </Link>
        <Link
          href="/withdraw"
          className="flex flex-col items-center justify-center 
             bg-white rounded-xl p-5 shadow-md gap-y-3 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-red-500">
            <LuCircleMinus size={25} className="text-white" />
          </div>
          <p className="text-sm font-medium font-satoshi">Withdraw</p>
        </Link>
        <Link
          href="/interest"
          className="flex flex-col items-center justify-center 
             bg-white rounded-xl p-5 shadow-md gap-y-3 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-orange">
            <LuPercent size={25} className="text-white" />
          </div>
          <p className="text-sm font-medium font-satoshi">Interest</p>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions; 