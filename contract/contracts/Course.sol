//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Course is ERC1155 {
    address owner;
    string public meta_url;
    uint256 public amount;
    uint256 public constant OWNERSHIP_TOKEN = 0;
    uint256 public constant ACCESS_TOKEN = 1;
    using Counters for Counters.Counter;
    Counters.Counter public _coursesMinted;

    modifier onlyOwner() {
        require(msg.sender == owner, "You must be the owner to withdraw.");
        _;
    }

    constructor(
        address deployer,
        uint256 coursePrice,
        string memory url
    ) ERC1155(url) {
        owner = deployer;
        amount = coursePrice;
        meta_url = url;
        _mint(owner, 0, 1, "");
    }

    function takeClass() public payable {
        require(
            msg.value >= amount,
            "You must provide eth in order to access the class!"
        );
        _coursesMinted.increment();
        _mint(msg.sender, 1, 1, "");
    }

    function withDrawMoney(uint256 amountToWithdraw) public onlyOwner {
        bool sent = payable(msg.sender).send(amountToWithdraw);
        require(sent, "Failed to send Ether");
    }

    function changeAmount(uint256 newPrice) public onlyOwner {
        amount = newPrice;
    }

    function getAmount() public view returns (uint256) {
        return amount;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function contractURI() public view returns (string memory) {
        return meta_url;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function getNumberOfTokenMinted() public view returns (uint256) {
        return _coursesMinted._value;
    }

    function getMoney() public view returns (uint256) {
        return address(this).balance;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amountToTransfer,
        bytes memory data
    ) public override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()) || from == owner,
            "ERC1155: caller is not owner nor approved"
        );
        require (id == 0, "Only the ownership NFT is transferable.");
        ERC1155.safeTransferFrom(from, to, id, amountToTransfer, data);
        owner = to;
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        return;
    }

    receive() external payable {}
}
