const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  class: 'SmartLockerContract',
  proto: [
    './proto/common.proto',
    './proto/guardian.proto',
    './proto/smart_locker.proto',
  ],
  files: [
    './smart-locker-contract.ts',
    './constants.ts',
    './smart-locker/smart-locker.ts',
  ],
  sourceDir: './assembly',
  buildDir: './build',
  koinosProtoDir: '../../node_modules/koinos-precompiler-as/koinos-proto',
  networks: {
    harbinger: {
      rpcNodes: [
        'https://harbinger-api.koinos.io',
        'https://testnet.koinosblocks.com',
      ],
      accounts: {
        manaSharer: {
          privateKey: process.env.HARBINGER_MANA_SHARER_PRIVATE_KEY,
        },
        contract: {
          privateKey: process.env.HARBINGER_SMARTLOCKER_CONTRACT_PRIVATE_KEY,
          id: process.env.HARBINGER_SMARTLOCKER_CONTRACT_ID,
          name: 'Smart Locker One',
          image: 'https://koiner.app/projects/dapp/koiner.jpg',
          description: 'Fund me please',
          token: '19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ',
          target: '10000',
          beneficiaries: '["17pdEmrpmpxtes5voUUrL66a22d9gorMVN"]',
          expires_at: '1676583809000',
        },
        contractOwner: {
          privateKey: process.env.HARBINGER_SMARTLOCKER_OWNER_PRIVATE_KEY,
        },
      },
    },
    mainnet: {
      rpcNodes: ['https://api.koinosblocks.com', 'https://api.koinos.io'],
      accounts: {
        manaSharer: {
          privateKey: process.env.MAINNET_MANA_SHARER_PRIVATE_KEY,
        },
        contract: {
          privateKey: process.env.MAINNET_SMARTLOCKER_CONTRACT_PRIVATE_KEY,
          id: process.env.MAINNET_SMARTLOCKER_CONTRACT_ID,
          name: process.env.MAINNET_SMARTLOCKER_CONTRACT_NAME,
          image: process.env.MAINNET_SMARTLOCKER_CONTRACT_IMAGE,
          paymentPeriod:
            process.env.MAINNET_SMARTLOCKER_CONTRACT_PAYMENT_PERIOD,
          description: process.env.MAINNET_SMARTLOCKER_CONTRACT_DESCRIPTION,
          beneficiaries: process.env.MAINNET_SMARTLOCKER_CONTRACT_BENEFICIARIES,
        },
        contractOwner: {
          privateKey: process.env.MAINNET_SMARTLOCKER_OWNER_PRIVATE_KEY,
        },
      },
    },
  },
};
