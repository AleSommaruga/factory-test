// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./ERC721Collection.sol";
import "./NFTCollection.sol";

contract Factory is AccessControl {
    address public implementation;

    event ImplementationModified(address oldImplementation, address newImplementation);
    event CollectionCreated(address indexed collection, address owner, address creator);

    constructor(address _implementation) {
        require(_implementation != address(0), "NFTCollectionsFactory: implementation cannot be null");
        implementation = _implementation;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setImplementation(address _implementation) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_implementation != address(0), "NFTCollectionsFactory: address cannot be null");

        address oldImplementation = implementation;
        implementation = _implementation;

        emit ImplementationModified(oldImplementation, _implementation);
    }

    function createCollection(address _owner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address collection = Clones.clone(implementation);
        ERC721Collection(collection).initialize(_owner);

        emit CollectionCreated(collection, _owner, msg.sender);
    }

    function createCollectionStandard(address _owner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NFTCollection collection = new NFTCollection();

        emit CollectionCreated(address(collection), _owner, msg.sender);
    }
}
