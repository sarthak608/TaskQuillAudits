import { ethers } from 'ethers';
import {
  PROVIDER_URL,
  MONITOR_CONTRACT_ADDRESS,
  ALERT_EMAIL_RECIPIENT,
  TRUSTED_SENDER_PRIVATE_KEY
} from '../config/constants';
import {
  notification,
} from '../notification';
import { abi } from '../data';

const privateKey = TRUSTED_SENDER_PRIVATE_KEY as string;
const providerUrl = PROVIDER_URL as string;
const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const EMAIL_RECIPIENT = ALERT_EMAIL_RECIPIENT ? [ALERT_EMAIL_RECIPIENT] : [];


const reentrancyCheckService = async () => {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  // Monitor Pending Transactions
  provider.on('pending', async (txHash) => {
    const tx = await provider.getTransaction(txHash);
    if (tx && tx.to && tx.to.toLowerCase() === MONITOR_CONTRACT_ADDRESS.toLowerCase()) {
      try {
        const pendingTransaction =`Pending Transaction on Monitor Contract Address ${MONITOR_CONTRACT_ADDRESS}`;
        console.log(pendingTransaction,tx);
        const userAddress = tx.from.toLowerCase();
        // Create contract instance
        const monitorContract = new ethers.Contract(MONITOR_CONTRACT_ADDRESS, abi, wallet);
        // Estimate gas required for the pause transaction
        const estimatedGas = await monitorContract.withdraw.estimateGas();
        const threshold = ((estimatedGas) * 3n);
        if (tx.gasLimit > threshold) {
          const message = `Potential reentrancy attack detected on ${txHash} from address ${userAddress}. High gas usage transactions detected and taking more time than average execution time`;
          console.log(message,tx);
          await notification.sendEmailAlert("[Dapp Alert] Potential Reentrancy Attack", message, EMAIL_RECIPIENT);
        }
      }
      catch (error: any) {
        if (error.message.includes('429')) {
          console.log('Rate limit exceeded, sleeping for 10 seconds, Upgrade the Alchemy Plan, dont use free Plan');
          await sleep(10000);
        } else {
          console.error('Error fetching transaction receipt:', error);
        }
      }
    }
  });
}



export default {
  reentrancyCheckService
};
