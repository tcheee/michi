// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseReward is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MICHI Rewards test", "MCH") {}

    function safeMint(address to, string memory uri) public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 newCount = _tokenIdCounter.current();
        _safeMint(to, newCount);
        _setTokenURI(newCount, uri);
        return newCount;
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require (to == from, "You can not transfer this NFT.");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require (to == from, "You can not transfer this NFT.");
    }


}
