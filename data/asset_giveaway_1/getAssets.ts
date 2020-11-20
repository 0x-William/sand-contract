import fs from 'fs';
import {BigNumber} from 'ethers';
import MerkleTree from '../../lib/merkleTree';
import {createDataArrayAssets, saltAssets} from '../../lib/merkleTreeHelper';
import * as assetData from './assets.json';

let errors = false;
function reportError(e: string) {
  errors = true;
  console.error(e);
}

function exitIfError() {
  if (errors) {
    process.exit(1);
  }
}

type Claim = {
  reservedAddress: string;
  assetIds: Array<string>;
  assetValues: Array<string>;
};

function generateAssetsForMerkleTree(assetData: Claim[]) {
  const assets = [];
  let numClaims = 0;
  let numAssets = 0;

  for (const claim of assetData) {
    const reserved = claim.reservedAddress;
    const ids = claim.assetIds;
    const values = claim.assetValues;
    assets.push({
      reserved,
      ids,
      values,
    });
    let i;
    for (i = 0; i < claim.assetIds.length; i++) {
      numAssets += parseInt(claim.assetValues[i]);
    }
    numClaims++;
  }

  exitIfError();
  return {assets};
}

export = {
  getAssets: (isDeploymentChainId: any, chainId: any) => {
    if (typeof chainId !== 'string') {
      throw new Error('chainId not a string');
    }

    let secretPath = './.asset_giveaway_1_secret';
    if (BigNumber.from(chainId).toString() === '1') {
      console.log('MAINNET secret');
      secretPath = './.asset_giveaway_1_secret.mainnet';
    }

    let expose = false;
    let secret;
    try {
      secret = fs.readFileSync(secretPath);
    } catch (e) {
      if (isDeploymentChainId) {
        throw e;
      }
      secret =
        '0x4467363716526536535425451427798982881775318563547751090997863683';
    }

    if (!isDeploymentChainId) {
      expose = true;
    }

    const {assets} = generateAssetsForMerkleTree(assetData);

    const saltedAssets = saltAssets(assets, secret);
    const tree = new MerkleTree(createDataArrayAssets(saltedAssets, null));
    const merkleRootHash = tree.getRoot().hash;

    return {
      assets: expose ? saltedAssets : assets,
      merkleRootHash,
      saltedAssets,
      tree,
    };
  },
};
