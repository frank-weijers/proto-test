import fs from 'fs';
import path from 'path';
import { Signer, Contract, Provider } from 'koilib';
import { TransactionJson } from 'koilib/lib/interface';
import * as dotenv from 'dotenv';
import abi from '../build/smartlockercontract-abi.json';
import koinosConfig from '../koinos.config.js';
import { contractDetails } from '../../utils';

dotenv.config();

const [inputNetworkName] = process.argv.slice(2);

async function main() {
  const networkName = inputNetworkName || 'harbinger';
  const network = koinosConfig.networks[networkName];
  if (!network) throw new Error(`network ${networkName} not found`);
  const provider = new Provider(network.rpcNodes);
  const accountWithFunds = Signer.fromWif(
    network.accounts.manaSharer.privateKey
  );
  const contractOwner = Signer.fromWif(
    network.accounts.contractOwner.privateKey
  );
  const contractAccount = Signer.fromWif(network.accounts.contract.privateKey);
  accountWithFunds.provider = provider;
  contractAccount.provider = provider;
  contractOwner.provider = provider;

  const wasmFile = path.join(
    __dirname,
    networkName === 'harbinger'
      ? '../build/release/smart-locker-harbinger.wasm'
      : '../build/release/smart-locker.wasm'
  );

  const contract = new Contract({
    id: contractAccount.address,
    abi,
    signer: contractAccount,
    provider,
    bytecode: fs.readFileSync(wasmFile),
    options: {
      payer: accountWithFunds.address,
      beforeSend: async (tx: TransactionJson) => {
        await accountWithFunds.signTransaction(tx);
        await contractOwner.signTransaction(tx);
      },
    },
  });

  contract.options.onlyOperation = true;
  const { operation: takeOwnership } = await contract.functions.set_owner({
    account: contractOwner.address,
  });

  console.log(network.accounts.contract);
  console.log({
    name: network.accounts.contract.name,
    image: network.accounts.contract.image,
    description: network.accounts.contract.description,
    beneficiaries: JSON.parse(network.accounts.contract.beneficiaries),
    token: network.accounts.contract.token,
    target: network.accounts.contract.target,
    expires_at: network.accounts.contract.expires_at,
  });
  const { operation: setProjectParams } =
    await contract.functions.set_project_settings({
      name: network.accounts.contract.name,
      image: network.accounts.contract.image,
      description: network.accounts.contract.description,
      beneficiaries: JSON.parse(network.accounts.contract.beneficiaries),
      token: network.accounts.contract.token,
      target: network.accounts.contract.target,
      expires_at: network.accounts.contract.expires_at,
    });

  contract.options.onlyOperation = false;
  const { receipt, transaction } = await contract.deploy({
    abi: JSON.stringify(abi),
    authorizesCallContract: true,
    authorizesTransactionApplication: true,
    authorizesUploadContract: true,
    nextOperations: [takeOwnership, setProjectParams],
  });
  console.log('Transaction submitted. Receipt: ');
  console.log(receipt);
  const { blockNumber } = await transaction.wait('byBlock', 60000);
  console.log({
    contract: 'smart-locker',
    address: contractAccount.address,
    file: wasmFile,
    ...contractDetails(contract.bytecode),
  });
  console.log(
    `Contract uploaded in block number ${blockNumber} (${networkName})`
  );
}

main()
  .then(() => {
    //
  })
  .catch((error) => console.error(error));
