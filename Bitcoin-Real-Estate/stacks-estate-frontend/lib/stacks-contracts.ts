// Contract addresses on Stacks testnet
export const CONTRACTS = {
  DATA_STORE: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.data-store-v3",
  GOVERNANCE: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.governance-v3",
  PROPERTY_REGISTRY: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.property-registry-v3",
  INVESTMENT_MANAGER: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.investment-manager-v3",
  RENTAL_DISTRIBUTOR: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.rental-distributor-v3",
  SBTC: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token",
}

// Contract function names
export const FUNCTIONS = {
  // Property Registry
  GET_PROPERTY: "get-property",
  GET_FUNDING_INFO: "get-funding-info",

  // Investment Manager
  INVEST_IN_PROPERTY: "invest-in-property",
  CLAIM_REFUND: "claim-refund-for-failed-property",

  // Rental Distributor
  CLAIM_RENTAL_EARNINGS: "claim-rental-earnings",

  // Data Store
  GET_USER_INVESTMENT: "get-user-investment",
  GET_PROPERTY_TOTALS: "get-property-investment-totals",
  GET_USER_PORTFOLIO: "get-user-portfolio",

  // Admin functions
  SUBMIT_PROPERTY: "submit-property",
  VERIFY_PROPERTY: "verify-property",
  DEACTIVATE_PROPERTY: "deactivate-property",
  DEPOSIT_RENTAL_INCOME: "deposit-rental-income",
  DISTRIBUTE_RENTAL_INCOME: "distribute-rental-income",
  CHECK_FUNDING_DEADLINE: "check-funding-deadline",

  // sBTC
  TRANSFER: "transfer",
}

// Network configuration
export const NETWORK = "testnet"
export const STACKS_TESTNET_API = "https://api.testnet.hiro.so"
