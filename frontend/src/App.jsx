import { useState } from "react";
import { ethers } from "ethers";

//components
import { Navbar } from "./components/Navbar";
import HayChainIcon from "./assets/haychain-icon.svg";
import Line from "./assets/line.svg";
import { Marketplace } from "./components/Marketplace";
import { BuySellModal } from "./components/BuySellModal";
import { Transaction } from "./constant/transaction";

const defaultProduct = {
  productName: "",
  price: 0,
  type: "",
  quantity: 0,
};

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
  const [isSelectedProduct, setIsSelectedProduct] = useState(false);

  // Mock Product list
  const productList = [
    { product: "Carrot", buying: 20, selling: 18 },
    { product: "Tomato", buying: 24, selling: 20 },
    { product: "Potato", buying: 32, selling: 29 },
    { product: "Onion", buying: 15, selling: 13 },
    { product: "Cucumber", buying: 22, selling: 19 },
    { product: "Lettuce", buying: 12, selling: 10 },
    { product: "Spinach", buying: 18, selling: 16 },
    { product: "Broccoli", buying: 28, selling: 25 },
    { product: "Garlic", buying: 35, selling: 30 },
    { product: "Pepper", buying: 27, selling: 22 },
  ];

  async function connectWallet() {
    if (!connected) {
      try {
        // Connect the wallet
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();
        setConnected(true);
        setWalletAddress(_walletAddress);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      // Disconnect the wallet
      setConnected(false);
      setWalletAddress("");
    }
  }

  function handleQuantityChange(quantity) {
    setSelectedProduct((prev) => {
      const updatedProduct = {
        ...prev,
        quantity: quantity,
      };
      handleSellBuyButton(updatedProduct);
      return updatedProduct;
    });
  }

  function handleSellBuyButton(updatedProduct) {
    console.log(updatedProduct);
    if (updatedProduct.type === Transaction.Sell) {
      //sell
    } else if (updatedProduct.type === Transaction.Buy) {
      //buy
    }
    clearSelectedProduct();
  }

  function clearSelectedProduct() {
    setIsSelectedProduct(false);
    setSelectedProduct(defaultProduct);
  }

  return (
    <>
      <div className="bg-cream h-screen w-screen">
        <Navbar
          connected={connected}
          walletAddress={walletAddress}
          connectWallet={connectWallet}
        />
        <div className="w-full flex flex-col items-center justify-center -translate-y-16">
          <img
            src={HayChainIcon}
            alt="HayChain Icon"
            className="w-[15%] translate-y-6"
          />
          <img src={Line} alt="Line" className="w-1/3" />
          <p className="font-laomn text-xl text-darkblue my-2">
            Agricultural Products Marketplace
          </p>
          <Marketplace
            productList={productList}
            setSelectedProduct={setSelectedProduct}
            setIsSelectedProduct={setIsSelectedProduct}
          />
        </div>
      </div>
      {isSelectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={clearSelectedProduct}
        />
      )}
      {isSelectedProduct && (
        <div className="absolute z-50 top-1/2 left-1/2 w-[40%] h-[40%] -translate-x-1/2 -translate-y-1/2">
          <BuySellModal
            selectedProduct={selectedProduct}
            clearSelectedProduct={clearSelectedProduct}
            handleQuantityChange={handleQuantityChange}
          />
        </div>
      )}
    </>
  );
}

export default App;
