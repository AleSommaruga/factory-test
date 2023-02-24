//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC721ACollection is ERC721AUpgradeable, AccessControlUpgradeable {
    using Strings for uint256;

    event Mint(address _from, uint256 quantity);

    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin) public initializerERC721A initializer {
        require(_admin != address(0), "ERC721ACustom: owner address not valid");

        __ERC721A_init("Token", "TKN");
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function mint(uint256 _quantity, address _to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(_to, _quantity);
        emit Mint(_msgSender(), _quantity);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControlUpgradeable, ERC721AUpgradeable) returns (bool) {
        return interfaceId == type(IERC721AUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }
}
