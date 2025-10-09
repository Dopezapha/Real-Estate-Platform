import { openContractCall } from "@stacks/connect"
import { uintCV, stringAsciiCV, PostConditionMode } from "@stacks/transactions"
import { CONTRACTS, FUNCTIONS, NETWORK } from "./stacks-contracts"
import { toMicroUnits } from "./stacks-transactions"

// Submit a new property (admin only)
export async function submitProperty(
propertyName: string, location: string, propertyType: string, p0: string, totalValue: number, fundingGoal: number, fundingDeadline: number, p1: string, expectedAnnualReturn: number, p2: number,
) {
  const functionArgs = [
    stringAsciiCV(propertyName),
    stringAsciiCV(location),
    stringAsciiCV(propertyType),
    uintCV(toMicroUnits(totalValue)),
    uintCV(toMicroUnits(fundingGoal)),
    uintCV(fundingDeadline),
    uintCV(expectedAnnualReturn),
  ]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.PROPERTY_REGISTRY.split(".")[0],
    contractName: CONTRACTS.PROPERTY_REGISTRY.split(".")[1],
    functionName: FUNCTIONS.SUBMIT_PROPERTY,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Property submission transaction:", data.txId)
    },
    onCancel: () => {
      console.log(" Property submission canceled")
    },
  })
}

// Verify a property (admin only)
export async function verifyProperty(propertyId: number, verificationScore: number) {
  const functionArgs = [uintCV(propertyId), uintCV(verificationScore)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.PROPERTY_REGISTRY.split(".")[0],
    contractName: CONTRACTS.PROPERTY_REGISTRY.split(".")[1],
    functionName: FUNCTIONS.VERIFY_PROPERTY,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Property verification transaction:", data.txId)
    },
    onCancel: () => {
      console.log(" Property verification canceled")
    },
  })
}

// Deactivate a property (admin only)
export async function deactivateProperty(propertyId: number) {
  const functionArgs = [uintCV(propertyId)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.PROPERTY_REGISTRY.split(".")[0],
    contractName: CONTRACTS.PROPERTY_REGISTRY.split(".")[1],
    functionName: FUNCTIONS.DEACTIVATE_PROPERTY,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Property deactivation transaction:", data.txId)
    },
    onCancel: () => {
      console.log(" Property deactivation canceled")
    },
  })
}

// Deposit rental income (admin only)
export async function depositRentalIncome(propertyId: number, amount: number) {
  const functionArgs = [uintCV(propertyId), uintCV(toMicroUnits(amount))]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.RENTAL_DISTRIBUTOR.split(".")[0],
    contractName: CONTRACTS.RENTAL_DISTRIBUTOR.split(".")[1],
    functionName: FUNCTIONS.DEPOSIT_RENTAL_INCOME,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Rental deposit transaction:", data.txId)
    },
    onCancel: () => {
      console.log(" Rental deposit canceled")
    },
  })
}

// Distribute rental income (admin only)
export async function distributeRentalIncome(propertyId: number) {
  const functionArgs = [uintCV(propertyId)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.RENTAL_DISTRIBUTOR.split(".")[0],
    contractName: CONTRACTS.RENTAL_DISTRIBUTOR.split(".")[1],
    functionName: FUNCTIONS.DISTRIBUTE_RENTAL_INCOME,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Rental distribution transaction:", data.txId)
    },
    onCancel: () => {
      console.log(" Rental distribution canceled")
    },
  })
}

// Check funding deadline (admin only)
export async function checkFundingDeadline(propertyId: number) {
  const functionArgs = [uintCV(propertyId)]

  await openContractCall({
    network: NETWORK,
    contractAddress: CONTRACTS.INVESTMENT_MANAGER.split(".")[0],
    contractName: CONTRACTS.INVESTMENT_MANAGER.split(".")[1],
    functionName: FUNCTIONS.CHECK_FUNDING_DEADLINE,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log(" Funding deadline check transaction:", data.txId)
    },
    onCancel: () => {
      console.log(" Funding deadline check canceled")
    },
  })
}
