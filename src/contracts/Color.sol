pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists;

    constructor() public ERC721Full("Color", "COLOR") {} //public

    function mint(string memory _color) public {
        //require unique color
        require(!_colorExists[_color]);
        uint256 _id = colors.push(_color);
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
        //color - add it
        // call mint func
        //color - track it
    }
}
