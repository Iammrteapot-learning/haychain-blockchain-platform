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
  const CUSTOMER_STATE_MAPPER = {
    0: "Idle",
    1: "Created",
    2: "Accepted",
    3: "InTransit",
    4: "Completed",
    5: "Rejected",
    6: "Done",
  };

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
  const FARMER_STATE_MAPPER = {
    0: "Idle",
    1: "Rejected",
    2: "Created",
    3: "Received",
    4: "Completed",
    5: "Done",
  };

  const FEE = 1;

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");

  const [stockContract, setStockContract] = useState(null);
  const [customerContract, setCustomerContract] = useState(null);
  const [farmerContract, setFarmerContract] = useState(null);

  const [productList, setProductList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
  const [isSelectedProduct, setIsSelectedProduct] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await customerContract.getAllOrders();
      console.log("orders are ", orders);
      const orderList = orders.map((order) => {
        return {
          orderId: order.orderId,
          productName: order.productName,
          quantity: order.quantity.toNumber(),
          price: order.price.toNumber(),
          orderState: CUSTOMER_STATE_MAPPER[order.orderState],
        };
      });
      setOrderList(orderList);
    };
    fetchOrders();
  }, [customerContract]);

  useEffect(() => {
    const fetchOffers = async () => {
      const offers = await farmerContract.getAllOffers();
      const offerList = offers.map((offer) => {
        return {
          offerId: offer.offerId,
          productName: offer.productName,
          quantity: offer.quantity.toNumber(),
          price: offer.price.toNumber(),
          state: FARMER_STATE_MAPPER[offer.state],
        };
      });
      setOfferList(offerList);
    };
    fetchOffers();
  }, [farmerContract]);

  useEffect(() => {
    const fetchStocks = async () => {
      const stocks = await stockContract.getAllStocks();
      console.log(stocks);
      const productList = stocks.map((stock) => {
        return {
          product: stock.productName,
          selling: stock.sellingPrice.toNumber(),
          buying: stock.buyingPrice.toNumber(),
          amount: stock.quantity.toNumber(),
        };
      });
      setProductList(productList);
    };
    fetchStocks();
  }, [stockContract]);

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

  async function handleSellBuyButton(updatedProduct) {
    console.log(updatedProduct);
    if (updatedProduct.type === Transaction.Sell) {
      //sell
      try {
        await farmerContract.payFeeAndMakeOffer(
          updatedProduct.productName,
          updatedProduct.quantity,
          {
            value: FEE,
          }
        );
      } catch (error) {
        alert("Something went wrong, cannot pay fee");
        console.log(error);
      }
    } else if (updatedProduct.type === Transaction.Buy) {
      //buy
      try {
        await customerContract.makeOrder(
          updatedProduct.quantity,
          updatedProduct.productName,
          {
            value: updatedProduct.price * updatedProduct.quantity + FEE,
          }
        );
      } catch (error) {
        alert("Something went wrong, cannot make order");
        console.log(error);
      }
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
          <OfferList offerList={offerList} farmerContract={farmerContract} />
          <OrderList
            orderList={orderList}
            customerContract={customerContract}
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
