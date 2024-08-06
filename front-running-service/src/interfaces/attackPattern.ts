 // Define the attack pattern interface
 export interface FrontRunningAttackPattern {
    gasLimit: bigint;
    gasPrice: bigint;
    maxPriorityFeePerGas: bigint;
    maxFeePerGas: bigint;
    msgSignature: string;
  }