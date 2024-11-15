import { useState, useEffect } from "react";
import { ethers } from "ethers";

//components
import { Navbar } from "./components/Navbar";
import HayChainIcon from "./assets/haychain-icon.svg";
import Line from "./assets/line.svg";
import { Marketplace } from "./components/Marketplace";
import { BuySellModal } from "./components/BuySellModal";
import { Transaction } from "./constant/transaction";
import OfferList from "./components/OfferList";
import OrderList from "./components/OrderList";

const defaultProduct = {
  productName: "",
  price: 0,
  type: "",
  quantity: 0,
};

function App() {
  const CONTRACT_ADDRESS = "";
  const ABI = [];

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
  const [isSelectedProduct, setIsSelectedProduct] = useState(false);

  const productList = [
    { product: "Hay", buying: 20, selling: 18, amount: 100 },
    { product: "Carrot", buying: 24, selling: 20, amount: 50 },
  ];

  const offerList = [
    {
      offerId: "0x1",
      productName: "Hay",
      quantity: 10,
      price: 20,
      state: "Created",
    },
    {
      offerId: "0x2",
      productName: "Carrot",
      quantity: 10,
      price: 30,
      state: "Received",
    },
  ];

  const orderList = [
    {
      orderId: "0x1",
      productName: "Hay",
      quantity: 10,
      price: 20,
      orderState: "Created",
    },
    {
      orderId: "0x2",
      productName: "Carrot",
      quantity: 10,
      price: 30,
      orderState: "InTransit",
    },
    {
      orderId: "0x3",
      productName: "Hay",
      quantity: 10,
      price: 20,
      orderState: "Accepted",
    },
  ];

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Listen for account changes in MetaMask
        window.ethereum.on("accountsChanged", async (accounts) => {
          setAccount(accounts[0]);
          const signer = provider.getSigner();
          setSigner(signer);
          // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          // setContract(contract);
        });

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = provider.getSigner();
        setSigner(signer);

        // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        // setContract(contract);
      }
    };
    init();
  }, []);

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
      <div className="bg-cream h-full w-screen">
        <Navbar
          connected={true}
          walletAddress={account}
          connectWallet={() => {}}
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
          <OfferList offerList={offerList} />
          <OrderList orderList={orderList} />
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
