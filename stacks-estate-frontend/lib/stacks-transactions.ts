import { openContractCall } from "@stacks/connect"
import { uintCV, PostConditionMode } from "@stacks/transactions"
import { CONTRACTS, FUNCTIONS, NETWORK } from "./stacks-contracts"

// Helper to convert sBTC amount to micro-units (1 sBTC = 100,000,000 micro-units)
export function toMicroUnits(amount: number): bigint {
  return BigInt(Math.floor(amount * 100_000_000))
}

// Invest in a property
export async function investInProperty(propertyId: number, amount: number, userAddress: string) {
  const amountInMicroUnits = toMicroUnits(amount)

  const functionArgs = [uintCV(propertyId), uintCV(amountInMicroUnits)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.INVESTMENT_MANAGER.split(".")[0],
    contractName: CONTRACTS.INVESTMENT_MANAGER.split(".")[1],
    functionName: FUNCTIONS.INVEST_IN_PROPERTY,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish: (data) => {
      console.log(" Investment transaction submitted:", data.txId)
    },
    onCancel: () => {
      console.log(" Investment transaction canceled")
    },
  })
}

// Claim rental earnings
export async function claimRentalEarnings(propertyId: number, month: number, year: number, userAddress: string) {
  const functionArgs = [uintCV(propertyId)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.RENTAL_DISTRIBUTOR.split(".")[0],
    contractName: CONTRACTS.RENTAL_DISTRIBUTOR.split(".")[1],
    functionName: FUNCTIONS.CLAIM_RENTAL_EARNINGS,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Claim earnings transaction submitted:", data.txId)
    },
    onCancel: () => {
      console.log(" Claim earnings transaction canceled")
    },
  })
}

// Claim refund for failed property
export async function claimRefund(propertyId: number, userAddress: string) {
  const functionArgs = [uintCV(propertyId)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.INVESTMENT_MANAGER.split(".")[0],
    contractName: CONTRACTS.INVESTMENT_MANAGER.split(".")[1],
    functionName: FUNCTIONS.CLAIM_REFUND,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Refund claim transaction submitted:", data.txId)
    },
    onCancel: () => {
      console.log(" Refund claim transaction canceled")
    },
  })
}
