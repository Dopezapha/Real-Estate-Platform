import { CONTRACTS, FUNCTIONS, STACKS_TESTNET_API } from "./stacks-contracts"
import { cvToJSON, hexToCV } from "@stacks/transactions"

// Helper to call read-only contract functions
async function callReadOnly(contractAddress: string, contractName: string, functionName: string, functionArgs: any[]) {
  const [address, name] = contractAddress.split(".")

  const response = await fetch(`${STACKS_TESTNET_API}/v3/contracts/call-read/${address}/${name}/${functionName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: address,
      arguments: functionArgs,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to call ${functionName}: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.okay === false) {
    throw new Error(`Contract call failed: ${data.cause}`)
  }

  return cvToJSON(hexToCV(data.result))
}

// Get property details
export async function getProperty(propertyId: number) {
  const args = [`0x${propertyId.toString(16).padStart(32, "0")}`]
  return callReadOnly(CONTRACTS.PROPERTY_REGISTRY, "property-registry-v3", FUNCTIONS.GET_PROPERTY, args)
}

// Get funding information
export async function getFundingInfo(propertyId: number) {
  const args = [`0x${propertyId.toString(16).padStart(32, "0")}`]
  return callReadOnly(CONTRACTS.PROPERTY_REGISTRY, "property-registry-v3", FUNCTIONS.GET_FUNDING_INFO, args)
}

// Get user investment in a property
export async function getUserInvestment(propertyId: number, userAddress: string) {
  const args = [`0x${propertyId.toString(16).padStart(32, "0")}`, `0x${userAddress}`]
  return callReadOnly(CONTRACTS.DATA_STORE, "data-store-v3", FUNCTIONS.GET_USER_INVESTMENT, args)
}

// Get property investment totals
export async function getPropertyTotals(propertyId: number) {
  const args = [`0x${propertyId.toString(16).padStart(32, "0")}`]
  return callReadOnly(CONTRACTS.DATA_STORE, "data-store-v3", FUNCTIONS.GET_PROPERTY_TOTALS, args)
}

// Get user portfolio
export async function getUserPortfolio(userAddress: string) {
  const args = [`0x${userAddress}`]
  return callReadOnly(CONTRACTS.DATA_STORE, "data-store-v3", FUNCTIONS.GET_USER_PORTFOLIO, args)
}

// Get sBTC balance
export async function getSBTCBalance(userAddress: string) {
  const args = [`0x${userAddress}`]
  return callReadOnly(CONTRACTS.SBTC, "sbtc-token", "get-balance", args)
}
