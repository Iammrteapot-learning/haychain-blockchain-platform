// SPDX-License-Identifier: Non-License
pragma solidity 0.8.28;

import "./stock.sol";

enum StateType {
    Idle,
    Created,
    Accepted,
    InTransit,
    Completed,
    Rejected,
    Done
}

struct Order {
    bytes32 orderId;
    address customer;
    string productName;
    uint256 price;
    uint256 quantity;
    StateType orderState;
}

contract Customer is Ownable {
    HayChainStock hayChainStock;
    mapping(bytes32 => Order) public orders;
    bytes32[] public orderKeys;

    constructor(address _stockAddress) {
        hayChainStock = HayChainStock(_stockAddress);
    }

    modifier onlyCustomer(bytes32 orderId) {
        require(msg.sender == orders[orderId].customer, "Unauthorized");
        _;
    }

    modifier onlyCustomerOrAdmin(bytes32 orderId) {
        require(
            msg.sender == orders[orderId].customer || msg.sender == getOwner(),
            "Unauthorized"
        );
        _;
    }

    function makeOrder(
        uint256 _quantity,
        string memory _productName
    ) public payable returns (Order memory) {
        uint256 stockAmount = hayChainStock.getStockAmount(_productName);
        uint256 fee = hayChainStock.fee();

        (, uint256 buyingPrice) = hayChainStock.getStockPrices(_productName);
        uint256 orderPrice = _quantity * buyingPrice;
        uint256 totalPayment = fee + orderPrice;

        require(stockAmount >= _quantity, "Insufficient stock");
        require(msg.value == totalPayment, "Invalid payment");

        address customer = msg.sender;
        bytes32 orderId = keccak256(
            abi.encodePacked(customer, block.timestamp)
        );
        Order storage order = orders[orderId];
        orderKeys.push(orderId);

        order.orderId = orderId;
        order.customer = customer;
        order.price = orderPrice;
        order.quantity = _quantity;
        order.productName = _productName;
        order.orderState = StateType.Created;

        return order;
    }

    function acceptOrder(bytes32 orderId) public onlyAdmin {
        Order storage order = orders[orderId];

        require(order.orderState == StateType.Created, "Invalid orderState");

        hayChainStock.removeStockQuantity(order.productName, order.quantity);

        order.orderState = StateType.Accepted;
    }

    function deliver(bytes32 orderId) public onlyAdmin {
        Order storage order = orders[orderId];

        require(order.orderState == StateType.Accepted, "Invalid orderState");
        order.orderState = StateType.InTransit;
    }

    function customerReceiveOrder(bytes32 orderId) public onlyCustomer(orderId) {
        Order storage order = orders[orderId];

        require(order.orderState == StateType.InTransit, "Invalid orderState");

        pay(getOwner(), order.price);

        order.orderState = StateType.Completed;
    }

    function clear(bytes32 orderId) public onlyAdmin {
        Order storage order = orders[orderId];

        require(
            order.orderState == StateType.Completed ||
                order.orderState == StateType.Rejected,
            "Invalid orderState"
        );

        order.orderState = StateType.Done;
    }

    function cancelOrder(
        bytes32 orderId
    ) public onlyCustomerOrAdmin(orderId) {
        Order storage order = orders[orderId];

        require(order.orderState == StateType.Created, "Invalid orderState");

        pay(order.customer, order.price);

        order.orderState = StateType.Rejected;
    }

    function pay(address to, uint256 amount) private {
        (bool success, ) = to.call{value: amount}(new bytes(0));
        if (!success) {
            revert("transfer error");
        }
    }

    function getAllOrders() public view returns (Order[] memory) {
        Order[] memory allOrders = new Order[](orderKeys.length);

        for (uint256 i = 0; i < orderKeys.length; i++) {
            allOrders[i] = orders[orderKeys[i]];
        }

        return allOrders;
    }

    function getOrdersByCustomerId(
        address _customer
    ) public view returns (Order[] memory) {
        Order[] memory tempOrders = new Order[](orderKeys.length);
        uint256 count = 0;

        for (uint256 i = 0; i < orderKeys.length; i++) {
            if (orders[orderKeys[i]].customer == _customer) {
                tempOrders[count] = orders[orderKeys[i]];
                count++;
            }
        }

        Order[] memory customerOrders = new Order[](count);
        for (uint256 i = 0; i < count; i++) {
            customerOrders[i] = tempOrders[i];
        }

        return customerOrders;
    }
}
