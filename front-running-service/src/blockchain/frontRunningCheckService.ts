import { ethers,parseUnits, ContractTransactionReceipt,toBigInt } from 'ethers';
import {
  PROVIDER_URL,
  MONITOR_CONTRACT_ADDRESS,
  TRUSTED_SENDER_PRIVATE_KEY,
} from '../config/constants';
import { FrontRunningAttackPattern } from '../interfaces/attackPattern';

import { abi } from '../data';

const privateKey = TRUSTED_SENDER_PRIVATE_KEY as string;
const providerUrl = PROVIDER_URL as string;
const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);


// Track all pending transactions 
const pendingTransaction: Map<string, FrontRunningAttackPattern> = new Map();

// Function to fetch the suggested priority fee from the network
async function getMaxPriorityFeePerGas(): Promise<BigInt> {
  try {
    // Call eth_maxPriorityFeePerGas to get the suggested priority fee
    const response = await provider.send("eth_maxPriorityFeePerGas", []);
    return BigInt(response);
  } catch (error) {
    console.error("Error fetching maxPriorityFeePerGas:", error);
    // Fallback to a default value if the RPC call fails
    return ethers.parseUnits("2.0", "gwei"); // Ensure this returns a BigNumber
  }
}

// Function to trigger pause with dynamic gas pricing
const triggerPause = async () => {
  try {
    // Create contract instance
    const monitorContract = new ethers.Contract(MONITOR_CONTRACT_ADDRESS, abi, wallet);
    // Estimate gas required for the pause transaction
    const estimatedGas = await monitorContract.pause.estimateGas();
     // Fetch the current base fee per gas and suggested priority fee
     const latestBlock = await provider.getBlock("latest");
     if (!latestBlock) {
      throw new Error("Failed to fetch the latest block");
    } 
    const baseFeePerGas = latestBlock.baseFeePerGas ?? BigInt("0").valueOf();
    const currenytMaxPriorityFeePerGas = await getMaxPriorityFeePerGas();

    // Add a premium to the priority fee to ensure the transaction is prioritized
    const priorityFeePremium = parseUnits("10.0", "gwei");
    const maxPriorityFeePerGas = currenytMaxPriorityFeePerGas.valueOf() +priorityFeePremium;

    // Define the max fee per gas
    const maxFeePerGas = BigInt((baseFeePerGas + maxPriorityFeePerGas).toString()).valueOf();

    // Define transaction details
    const tx = {
      gasLimit: estimatedGas+ BigInt("20000").valueOf(), 
      maxPriorityFeePerGas:maxPriorityFeePerGas,
      maxFeePerGas: maxFeePerGas,
    };
    // Trigger pause
    const txn = await monitorContract.pause(tx);
    const receipt = await txn.wait();
    const block = await receipt.getBlock();
    const transaction = await receipt.getTransaction();
    const resultPuase = { timestamp: block.timestamp, transactionHash: txn.hash, signature: transaction?.signature };
    console.log("contractPaused",resultPuase)
    return { timestamp: block.timestamp, transactionHash: txn.hash, signature: transaction?.signature };
  } catch (error) {
    console.error("Error triggering pause:", error);
    return null;
  }
};

const frontRunningCheckService = async() => {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  provider.on('pending', async (txHash) => {
    const tx = await provider.getTransaction(txHash);
    if (tx && tx.to && tx.to.toLowerCase() === MONITOR_CONTRACT_ADDRESS.toLowerCase()) {
      const userAddress = tx.from.toLowerCase();
            
      try {
        if (tx.gasPrice && tx.maxPriorityFeePerGas && tx.maxFeePerGas) {
          const frontRunningAttackPattern: FrontRunningAttackPattern = {
            gasLimit: toBigInt(tx.gasLimit).valueOf(),
            gasPrice: toBigInt(tx.gasPrice).valueOf(),
            maxPriorityFeePerGas: toBigInt(tx.maxPriorityFeePerGas).valueOf(),
            maxFeePerGas: toBigInt(tx.maxFeePerGas).valueOf(),
            msgSignature: tx.data.slice(0, 10), // Extract the function signature
         };
          
         for (const [pendingTxHash, lastPattern] of pendingTransaction) {
          if (lastPattern.msgSignature === frontRunningAttackPattern.msgSignature) {
            const gasPriceDifference = (lastPattern.gasPrice > frontRunningAttackPattern.gasPrice ? lastPattern.gasPrice - frontRunningAttackPattern.gasPrice : frontRunningAttackPattern.gasPrice - lastPattern.gasPrice) * 100n / (lastPattern.gasPrice < frontRunningAttackPattern.gasPrice ? lastPattern.gasPrice : frontRunningAttackPattern.gasPrice);
            const maxPriorityFeeDifference = (lastPattern.maxPriorityFeePerGas > frontRunningAttackPattern.maxPriorityFeePerGas ? lastPattern.maxPriorityFeePerGas - frontRunningAttackPattern.maxPriorityFeePerGas : frontRunningAttackPattern.maxPriorityFeePerGas - lastPattern.maxPriorityFeePerGas) * 100n / (lastPattern.maxPriorityFeePerGas < frontRunningAttackPattern.maxPriorityFeePerGas ? lastPattern.maxPriorityFeePerGas : frontRunningAttackPattern.maxPriorityFeePerGas);
            const maxFeeDifference = (lastPattern.maxFeePerGas > frontRunningAttackPattern.maxFeePerGas ? lastPattern.maxFeePerGas - frontRunningAttackPattern.maxFeePerGas : frontRunningAttackPattern.maxFeePerGas - lastPattern.maxFeePerGas) * 100n / (lastPattern.maxFeePerGas < frontRunningAttackPattern.maxFeePerGas ? lastPattern.maxFeePerGas : frontRunningAttackPattern.maxFeePerGas);

            if (gasPriceDifference > 10n || maxPriorityFeeDifference > 10n || maxFeeDifference > 10n) {
              const message = `Potential front-running attack detected on ${txHash} from address ${userAddress}, Front Running Pattern Detected`;
              console.log(message);
              // Front-running attack detected, pause the contract
              await triggerPause();
            }
          }
        }
          pendingTransaction.set(txHash, frontRunningAttackPattern);
        }
      } catch (error: any) {
        if (error.message.includes('429')) {
          console.log('Rate limit exceeded, sleeping for 10 seconds, Upgrade the Alchemy Plan, don\'t use free Plan');
          await sleep(10000);
        } else {
          console.error('Error fetching transaction receipt:', error);
        }
      }
    }
  });
};

export default {
  frontRunningCheckService
};
