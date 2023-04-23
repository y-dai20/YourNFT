// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract YourNFT is ERC721URIStorage, Ownable {

    struct Exchange {
        uint256 sendTokenId;
        address sender;
        uint256 receiveTokenId;
        address receiver;
        string text;
        uint256 timestamp;
        bool isDone;
    }
    Exchange[] exchanges;

    struct NFTAttribute {
        string name;
        string description;
        string imageURL;
    }
    NFTAttribute[] public NFTAttributes;

    uint256 public maxMintNFT = 10;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event maxMintNFTChanged(uint256 prev, uint256 next);
    event newExchange(
        uint256 sendTokenId,
        uint256 receiveTokenId,
        string text,
        uint timestamp,
        bool isDone
    );
    event exchangeDone(uint256 index, address receiver);

    constructor() ERC721("YourNFT", "YNFT") {
        console.log("Hello! I'm YourNFT Contract.");
    }

    function mintIpfsNFT(string memory _name, string memory _description, string memory _imageURL) public {
        uint256 newTokenId = _tokenIds.current();
        require(newTokenId < maxMintNFT);
        _safeMint(msg.sender, newTokenId);
        NFTAttributes.push(
            NFTAttribute({
                name:_name,
                description:_description,
                imageURL:_imageURL
            })
        );
        console.log("An NFT ID %s has been minted to %s", newTokenId, msg.sender);
        _tokenIds.increment();
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return string (
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        string(
                            abi.encodePacked(
                                '{"name": "',
                                NFTAttributes[_tokenId].name,
                                ' -- NFT #:',
                                Strings.toString(_tokenId),
                                '", "description": "',
                                NFTAttributes[_tokenId].description,
                                ' -- YourNFT", "image": "ipfs://',
                                NFTAttributes[_tokenId].imageURL,
                                '"}'
                            )
                        )
                    )
                )
            )
        );
    }

    function getTotalTokens() public view returns(uint256) {
        return _tokenIds.current();
    }

    function changeMaxMintNFT(uint256 _maxMinNFT) external onlyOwner {
        uint256 prev = maxMintNFT;
        maxMintNFT = _maxMinNFT;
        emit maxMintNFTChanged(prev, maxMintNFT);
    }

    function requestExchange(uint256 _sendTokenId, uint256 _receiveTokenId, string memory _text) public {
        require(ownerOf(_sendTokenId) == msg.sender);
        require(ownerOf(_receiveTokenId) != msg.sender);
        exchanges.push(
            Exchange({
                sender:msg.sender,
                sendTokenId:_sendTokenId,
                receiver:ownerOf(_receiveTokenId),
                receiveTokenId:_receiveTokenId,
                text: _text,
                timestamp:block.timestamp,
                isDone:false
            })
        );

        approve(address(this), _sendTokenId);

        emit newExchange(
            _sendTokenId,
            _receiveTokenId,
            _text,
            block.timestamp,
            false
        );
    }

    function accept(uint256 _index) public {
        Exchange storage exchange = checkExchange(_index);

        transferFrom(msg.sender, ownerOf(exchange.sendTokenId), exchange.receiveTokenId);
        _transfer(ownerOf(exchange.sendTokenId), msg.sender, exchange.sendTokenId);
        exchange.isDone = true;
        emit exchangeDone(_index, msg.sender);
    }

    function deny(uint256 _index) public {
        Exchange storage exchange = checkExchange(_index);
        exchange.isDone = true;
        emit exchangeDone(_index, msg.sender);
    }

    function checkExchange(uint256 _index) internal view returns(Exchange storage) {
        Exchange storage exchange = exchanges[_index];
        require(exchange.isDone == false);
        require(exchange.receiver == msg.sender);
        require(ownerOf(exchange.receiveTokenId) == msg.sender);
        require(ownerOf(exchange.sendTokenId) == exchange.sender);

        return exchange;
    }

    function getExchanges() public view returns(Exchange[] memory) {
        return exchanges;
    }
}