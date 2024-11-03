// SPDX-License-Identifier: Non-License
pragma solidity 0.8.28;

contract Ownable {
    address private owner;
    address[] private admins;

    constructor() {
        owner = msg.sender;
        admins.push(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    modifier onlyAdmin() {
        bool isAdmin = false;
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == msg.sender) {
                isAdmin = true;
                break;
            }
        }

        require(isAdmin, "Unauthorized");
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        owner = _newOwner;
        admins.push(_newOwner);
    }

    function addAdmin(address _admin) public onlyAdmin {
        admins.push(_admin);
    }

    function removeAdmin(address _admin) public onlyAdmin {
        require(msg.sender != _admin, "You can't remove yourself");
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == _admin) {
                admins[i] = admins[admins.length - 1];
                admins.pop();
                break;
            }
        }
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getAdmins() public view returns (address[] memory) {
        return admins;
    }
}