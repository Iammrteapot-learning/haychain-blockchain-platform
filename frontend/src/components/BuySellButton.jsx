import { Transaction } from "../constant/transaction";

export function BuySellButton({ type, onClickButton }) {
  const textColor = type === Transaction.Sell ? "text-green" : "text-red";
  const hoverColor =
    type === Transaction.Sell ? "hover:bg-green" : "hover:bg-red";

  return (
    <button
      className={`font-lalezar font-bold ${textColor} border-2 py-1 px-4 rounded-full hover:text-white ${hoverColor} hover:shadow-md`}
      onClick={onClickButton}
    >
      {type}
    </button>
  );
}
