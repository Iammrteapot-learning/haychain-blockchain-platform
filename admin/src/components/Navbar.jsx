import HayChainIcon from "../assets/haychain-icon.svg";
import NavBar from "../assets/navbar.svg";

export function Navbar({ connected, walletAddress, connectWallet }) {
  return (
    <div className="relative w-full -top-5">
      <img src={NavBar} alt="Navbar" className="w-full" />
      <div className="absolute w-full -top-[20%] flex justify-between items-center">
        <img src={HayChainIcon} alt="HayChain Icon" className="w-1/6" />
        <button
          className="mr-14 my-20 px-3 text-xl min-h-16 text-red font-semibold font-lalezar bg-cream bg-opacity-60 rounded-md border-red border-2 hover:shadow-lg hover:scale-[1.02] duration-200"
          onClick={connectWallet}
        >
          {walletAddress !== ""
            ? `Connected : ${walletAddress.substring(
                0,
                7
              )}...${walletAddress.slice(-5)}`
            : "Wallet is not connected"}
        </button>
      </div>
    </div>
  );
}
