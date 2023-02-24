// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./NFTCollection.sol";

contract StandardFactory is AccessControl {
    event CollectionCreated(address indexed collection, address owner, address creator);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createCollection(address _owner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NFTCollection collection = new NFTCollection();
        collection.transferOwnership(_owner);
        emit CollectionCreated(address(collection), _owner, msg.sender);
    }
}
