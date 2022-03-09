//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Course.sol";

contract CourseFactory {
    address[] public allContracts;
    address owner;
    mapping(address => address[]) public allOwnersContracts;

    constructor() {
        owner = msg.sender;
    }

    event NewContractCreated(address _address);

    function createLesson(uint256 coursePrice, string memory url) public {
        Course newCourseCreated = new Course(msg.sender, coursePrice, url);
        // console.log(address(newCourseCreated));
        require(
            address(newCourseCreated) != address(0),
            "There was an issue while creating the course"
        );
        allContracts.push(address(newCourseCreated));
        allOwnersContracts[msg.sender].push(address(newCourseCreated));
        emit NewContractCreated(address(newCourseCreated));
    }

    function getContracts() public view returns (address[] memory) {
        return allContracts;
    }

    function getCourses(address _ownerAddress)
        public
        view
        returns (address[] memory)
    {
        require(
            allOwnersContracts[_ownerAddress].length > 0,
            "You don't have any contract"
        );
        return allOwnersContracts[_ownerAddress];
    }

    receive() external payable {}
}
