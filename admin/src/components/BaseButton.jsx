export function BaseButton({ text, color, handleClick }) {
  return (
    <button
      className={`font-lalezar font-bold ${
        "text-" + color
      } border-2 py-1 px-4 rounded-full hover:text-white ${
        "hover:bg-" + color
      } hover:shadow-md`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
