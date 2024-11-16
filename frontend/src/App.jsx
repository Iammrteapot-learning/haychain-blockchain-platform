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
  const STOCK_CONTRACT_ADDRESS = "0xEd28a934D16A6084f806DFb7eB92AAb0705A564d";
  const STOCK_ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "addAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_sellingPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_buyingPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
      ],
      name: "addStockProduct",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
      ],
      name: "addStockQuantity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "removeAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
      ],
      name: "removeStockProduct",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
      ],
      name: "removeStockQuantity",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "fee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAdmins",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllStocks",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "productId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "sellingPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "buyingPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
          ],
          internalType: "struct Stock[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
      ],
      name: "getStockAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
      ],
      name: "getStockPrices",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "productIds",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "stocks",
      outputs: [
        {
          internalType: "bytes32",
          name: "productId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "sellingPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "buyingPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const CUSTOMER_CONTRACT_ADDRESS =
    "0xd8161ca9A117c1912f6548f7F4966DB28C877660";
  const CUSTOMER_ABI = [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "orderId",
          type: "bytes32",
        },
      ],
      name: "acceptOrder",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "addAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "orderId",
          type: "bytes32",
        },
      ],
      name: "cancelOrder",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "orderId",
          type: "bytes32",
        },
      ],
      name: "clear",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "orderId",
          type: "bytes32",
        },
      ],
      name: "customerReceiveOrder",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "orderId",
          type: "bytes32",
        },
      ],
      name: "deliver",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_productName",
          type: "string",
        },
      ],
      name: "makeOrder",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "orderId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "customer",
              type: "address",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "enum StateType",
              name: "orderState",
              type: "uint8",
            },
          ],
          internalType: "struct Order",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "removeAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_stockAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "getAdmins",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllOrders",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "orderId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "customer",
              type: "address",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "enum StateType",
              name: "orderState",
              type: "uint8",
            },
          ],
          internalType: "struct Order[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_customer",
          type: "address",
        },
      ],
      name: "getOrdersByCustomerId",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "orderId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "customer",
              type: "address",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "enum StateType",
              name: "orderState",
              type: "uint8",
            },
          ],
          internalType: "struct Order[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "orderKeys",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "orders",
      outputs: [
        {
          internalType: "bytes32",
          name: "orderId",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "customer",
          type: "address",
        },
        {
          internalType: "string",
          name: "productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
        {
          internalType: "enum StateType",
          name: "orderState",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const FARMER_CONTRACT_ADDRESS = "0xA07539af15229B4ad4a3Ea23177e87d08c317689";
  const FARMER_ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "addAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "addBudget",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "offerId",
          type: "bytes32",
        },
      ],
      name: "approvedStockReceived",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "offerId",
          type: "bytes32",
        },
      ],
      name: "clear",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
      ],
      name: "payFeeAndMakeOffer",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "offerId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "farmOwner",
              type: "address",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "enum StateType",
              name: "state",
              type: "uint8",
            },
          ],
          internalType: "struct Offer",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "offerId",
          type: "bytes32",
        },
      ],
      name: "receiveMoney",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "offerId",
          type: "bytes32",
        },
      ],
      name: "rejectStock",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_admin",
          type: "address",
        },
      ],
      name: "removeAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_stockAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "budget",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAdmins",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllOffers",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "offerId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "farmOwner",
              type: "address",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "enum StateType",
              name: "state",
              type: "uint8",
            },
          ],
          internalType: "struct Offer[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "farmOwner",
          type: "address",
        },
      ],
      name: "getOffersByFarmOwner",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "offerId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "farmOwner",
              type: "address",
            },
            {
              internalType: "string",
              name: "productName",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
            {
              internalType: "enum StateType",
              name: "state",
              type: "uint8",
            },
          ],
          internalType: "struct Offer[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "offerKeys",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "offers",
      outputs: [
        {
          internalType: "bytes32",
          name: "offerId",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "farmOwner",
          type: "address",
        },
        {
          internalType: "string",
          name: "productName",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "enum StateType",
          name: "state",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [stockContract, setStockContract] = useState(null);
  const [customerContract, setCustomerContract] = useState(null);
  const [farmerContract, setFarmerContract] = useState(null);
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
    const initContract = (initSigner) => {
      const stockContract = new ethers.Contract(
        STOCK_CONTRACT_ADDRESS,
        STOCK_ABI,
        initSigner
      );
      setStockContract(stockContract);

      const customerContract = new ethers.Contract(
        CUSTOMER_CONTRACT_ADDRESS,
        CUSTOMER_ABI,
        initSigner
      );
      setCustomerContract(customerContract);

      const farmerContract = new ethers.Contract(
        FARMER_CONTRACT_ADDRESS,
        FARMER_ABI,
        initSigner
      );
      setFarmerContract(farmerContract);
    };

    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Listen for account changes in MetaMask
        window.ethereum.on("accountsChanged", async (accounts) => {
          setAccount(accounts[0]);
          const signer = provider.getSigner();
          setSigner(signer);
          initContract(signer);
        });

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = provider.getSigner();
        setSigner(signer);
        initContract(signer);
      }
    };
    init();
    console.log("stockContract", stockContract);
    console.log("customerContract", customerContract);
    console.log("farmerContract", farmerContract);
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
