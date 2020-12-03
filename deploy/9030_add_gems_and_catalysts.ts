import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import gems from '../data/gems';
import catalysts from '../data/catalysts';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {log, execute, read} = deployments;
  const {deployer} = await getNamedAccounts();

  const catalystsToAdd = [];
  const gemsToAdd = [];

  for (const catalyst of catalysts) {
    const isCatalystExists = await read(
      `GemsCatalystsRegistry`,
      'isCatalystExists',
      catalyst.catalystId
    );
    if (!isCatalystExists) {
      const {address} = await deployments.get(`Catalyst_${catalyst.name}`);
      catalystsToAdd.push(address);
    }
  }

  for (const gem of gems) {
    const isGemExists = await read(
      `GemsCatalystsRegistry`,
      'isGemExists',
      gem.gemId
    );
    if (!isGemExists) {
      const {address} = await deployments.get(`Gem_${gem.name}`);
      gemsToAdd.push(address);
    }
  }
  const currentAdmin = await read('GemsCatalystsRegistry', 'getAdmin');
  log(currentAdmin);
  await execute(
    'GemsCatalystsRegistry',
    {from: deployer, log: true},
    'addGemsAndCatalysts',
    gemsToAdd,
    catalystsToAdd
  );
};
export default func;
func.tags = ['GemsCatalystsRegistry', 'GemsCatalystsRegistry_setup'];
func.dependencies = ['GemsCatalystsRegistry_deploy'];
