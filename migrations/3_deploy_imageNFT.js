const imageNFT = artifacts.require("ImageNFT");

module.exports = function(deployer) {
  deployer.deploy(imageNFT);
};
