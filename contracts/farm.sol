// SPDX-License-Identifier: Non-License
pragma solidity 0.8.28;

import "./stock.sol";

enum StateType {
    Idle,
    Rejected,
    Created,
    Received,
    Completed,
    Done
}

struct Offer {
    bytes32 offerId;
    address farmOwner;
    string productName;
    uint256 quantity;
    uint256 price;
    StateType state;
}

contract FarmContract is Ownable {
    HayChainStock hayChainStock;
    uint256 public budget;
    mapping(bytes32 => Offer) public offers;
    bytes32[] public offerKeys;

    constructor(address _stockAddress) {
        hayChainStock = HayChainStock(_stockAddress);
    }

    modifier onlyFarmOwner(bytes32 offerId) {
        require(msg.sender == offers[offerId].farmOwner, "Unauthorized");
        _;
    }

    function payFeeAndMakeOffer(
        string memory productName,
        uint256 quantity
    ) public payable returns (Offer memory) {
        (uint256 sellingPrice, ) = hayChainStock.getStockPrices(productName);
        uint256 fee = hayChainStock.fee();

        require(msg.value == fee);

        pay(getOwner(), fee);

        address farmOwner = msg.sender;
        bytes32 offerId = keccak256(
            abi.encodePacked(farmOwner, block.timestamp)
        );

        Offer storage offer = offers[offerId];
        offerKeys.push(offerId);
        offer.offerId = offerId;
        offer.farmOwner = farmOwner;
        offer.quantity = quantity;
        offer.price = sellingPrice * quantity;
        offer.productName = productName;
        offer.state = StateType.Created;

        return offer;
    }

    function rejectStock(bytes32 offerId) public onlyAdmin {
        Offer storage offer = offers[offerId];
        require(offer.state == StateType.Created, "Invalid state");

        offer.state = StateType.Rejected;
    }

    function approvedStockReceived(bytes32 offerId) public payable onlyAdmin {
        Offer storage offer = offers[offerId];
        require(offer.state == StateType.Created, "Invalid state");
        require(checkBudgetAvailable(offerId), "Insufficient budget");

        hayChainStock.addStockQuantity(offer.productName, offer.quantity);
        pay(offer.farmOwner, offer.price);

        offer.state = StateType.Received;
    }

    function receiveMoney(bytes32 offerId) public onlyFarmOwner(offerId) {
        Offer storage offer = offers[offerId];
        require(offer.state == StateType.Received, "Invalid state");

        offer.state = StateType.Completed;
    }

    function clear(bytes32 offerId) public onlyAdmin {
        Offer storage offer = offers[offerId];
        require(
            offer.state == StateType.Completed ||
                offer.state == StateType.Rejected,
            "Invalid state"
        );

        offer.state = StateType.Idle;
    }

    function addBudget(uint256 amount) public onlyOwner {
        budget += amount;
    }

    function checkBudgetAvailable(bytes32 offetId) private view returns (bool) {
        return budget >= offers[offetId].price;
    }

    function pay(address to, uint256 amount) private {
        (bool success, ) = to.call{value: amount}(new bytes(0));
        if (!success) {
            revert("transfer error");
        }
    }

    function getAllOffers() public view returns (Offer[] memory) {
        Offer[] memory allOffers = new Offer[](offerKeys.length);

        for (uint256 i = 0; i < offerKeys.length; i++) {
            allOffers[i] = offers[offerKeys[i]];
        }

        return allOffers;
    }

    receive() external payable {
        revert("Not support sending Ethers to this contract directly.");
    }

    fallback() external payable {
        revert("Invalid function call");
    }
}
