const {guard} = require("../lib");

module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();
  const sandContract = await deployments.get("Sand");
  const signers = await ethers.getSigners();
  const fakeTrustedForwarder = await signers[11].getAddress();

  const metaTx = await deploy("MetaTxWrapper", {
    from: deployer,
    args: [fakeTrustedForwarder, sandContract.address],
    log: true,
  });

  const sandWrapper = {...metaTx, abi: sandContract.abi};

  await deployments.save("SandWrapper", sandWrapper);
};

module.exports.skip = guard(["1", "4", "314159"]);
module.exports.dependencies = ["Sand"];
module.exports.tags = ["MetaTxWrapper"];
