pragma solidity ^0.5.0;

import "./ERC721Full.sol";
import "./MinterRole.sol";
import "./Ownable.sol";

contract ImageNFT is Ownable, MinterRole, ERC721Full {
    using SafeMath for uint256;
    string[] public imagesList;

    constructor() public ERC721Full("Token", "TKN") {}

    function mint(address _to, string memory _tokenURI)
        public
        onlyMinter
        returns (bool)
    {
        _mintWithTokenURI(_to, _tokenURI);
        return true;
    }

    function _mintWithTokenURI(address _to, string memory _tokenURI) internal {
        uint256 _tokenId = totalSupply().add(1);
        imagesList.push(_tokenURI);
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }

    // function set(string memory _imageHash) public {
    //     imageHash = _imageHash;
    // }

    // function get() public view returns (string memory) {
    //     return imageHash;
    // }
}
