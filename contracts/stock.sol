// SPDX-License-Identifier: Non-License
pragma solidity 0.8.28;
pragma experimental ABIEncoderV2;

import "./ownable.sol";

struct Stock {
    bytes32 productId;
    string productName;
    uint256 sellingPrice;
    uint256 buyingPrice;
    uint256 quantity;
}

contract HayChainStock is Ownable {
    mapping(bytes32 => Stock) public stocks;
    bytes32[] public productIds;
    uint256 public fee = 1 wei;

    constructor() {}

    function addStockQuantity(
        string memory _productName,
        uint256 _quantity
    ) public {
        require(_quantity > 0, "Invalid quantity");

        bytes32 _productId = keccak256(abi.encodePacked(_productName));
        Stock storage stock = stocks[_productId];

        require(stock.buyingPrice != 0 && stock.sellingPrice != 0, "Product is not exist.");

        stock.quantity += _quantity;
        updateStockPrice(_productName);
    }

    function removeStockQuantity(
        string memory _productName,
        uint256 _quantity
    ) public {
        require(_quantity > 0, "Invalid quantity");

        bytes32 _productId = keccak256(abi.encodePacked(_productName));
        Stock storage stock = stocks[_productId];

        require(stock.buyingPrice != 0 && stock.sellingPrice != 0, "Product is not exist.");
        require(stock.quantity >= _quantity, "Insufficient stock");

        stock.quantity -= _quantity;
        updateStockPrice(_productName);
    }

    function getAllStocks() public view returns (Stock[] memory) {
        Stock[] memory allStocks = new Stock[](productIds.length);
        
        for (uint256 i = 0; i < productIds.length; i++) {
            allStocks[i] = stocks[productIds[i]];
        }

        return allStocks;
    }

    function getStockAmount(string memory _productName)
        public
        view
        returns (uint256)
    {
        bytes32 _productId = keccak256(abi.encodePacked(_productName));
        Stock storage stock = stocks[_productId];

        require(stock.buyingPrice != 0 && stock.sellingPrice != 0, "Product is not exist.");

        return stock.quantity;
    }

    function getStockPrices(string memory _productName)
        public
        view
        returns (uint256, uint256)
    {
        bytes32 _productId = keccak256(abi.encodePacked(_productName));
        Stock storage stock = stocks[_productId];

        require(stock.buyingPrice != 0 && stock.sellingPrice != 0, "Product is not exist.");

        return (stock.sellingPrice, stock.buyingPrice);
    }

    function addStockProduct(
        string memory _productName,
        uint256 _sellingPrice,
        uint256 _buyingPrice,
        uint256 _quantity
    ) public onlyAdmin {
        require(_sellingPrice > 0, "Invalid selling price");
        require(_buyingPrice > 0, "Invalid buying price");
        require(_quantity > 0, "Invalid quantity");

        bytes32 _productId = keccak256(abi.encodePacked(_productName));
        Stock storage stock = stocks[_productId];

        require(stock.buyingPrice == 0 && stock.sellingPrice == 0, "Product is already exist.");

        stock.productId = _productId;
        stock.productName = _productName;
        stock.sellingPrice = _sellingPrice;
        stock.buyingPrice = _buyingPrice;
        stock.quantity = _quantity;

        productIds.push(_productId);
    }

    function removeStockProduct(string memory _productName) public onlyAdmin {
        bytes32 _productId = keccak256(abi.encodePacked(_productName));
        Stock storage stock = stocks[_productId];

        require(stock.buyingPrice != 0 && stock.sellingPrice != 0, "Product is not exist.");

        delete stocks[_productId];
        for (uint256 i = 0; i < productIds.length; i++) {
            if (productIds[i] == _productId) {
                productIds[i] = productIds[productIds.length - 1];
                productIds.pop();
                break;
            }
        }
    }

    function updateStockPrice(string memory _productName) private {
        // Update stock price with the economical logic
    }
}