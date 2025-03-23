interface TotalBalanceProps {
  totalBalance?: number | string;
}

const TotalBalance = ({ totalBalance }: TotalBalanceProps) => {
  return (
    <div className="flex-grow bg-white rounded-3xl p-6 shadow-md">
      <div className="flex flex-col gap-y-2">
        <p className="text-sm md:text-lg font-normal ">Total Balance</p>
        <p className="text-xl md:text-2xl font-bold ">
          ${totalBalance}
        </p>
      </div>
    </div>
  );
};

export default TotalBalance; 