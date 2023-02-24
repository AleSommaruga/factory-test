//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./ERC721ACollection.sol";

contract ERC721AFactory is AccessControlUpgradeable {
    address private implementationContract;

    event ImplementationModified(address oldImplementation, address newImplementation);
    event CloneCollectionCreated(address indexed collection, address owner, address creator);

    constructor(address _implementation) {
        require(_implementation != address(0), "ERC721AProxyFactory: implementation cannot be null!");
        implementationContract = _implementation;

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setImplementation(address _implementation) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_implementation != address(0), "ERC721AProxyFactory: address cannot be null");
        address oldImplementation = implementationContract;
        implementationContract = _implementation;

        emit ImplementationModified(oldImplementation, _implementation);
    }

    function getImplementation() external view returns (address) {
        return implementationContract;
    }

    function createCollection(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address cloneCollectionInstance = Clones.clone(implementationContract);
        ERC721ACollection(cloneCollectionInstance).initialize(_admin);

        emit CloneCollectionCreated(cloneCollectionInstance, _admin, msg.sender);
    }
}
