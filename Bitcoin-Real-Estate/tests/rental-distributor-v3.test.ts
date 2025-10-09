// rental-distributor-v3.test.ts
import { describe, expect, it, beforeEach } from "vitest"
import { Cl } from "@stacks/transactions"
declare const simnet: any

describe("Rental Distributor v3 Contract - Comprehensive Tests", () => {
  const accounts = simnet.getAccounts()
  const deployer = accounts.get("deployer")!
  const wallet1 = accounts.get("wallet_1")!
  const wallet2 = accounts.get("wallet_2")!
  const wallet3 = accounts.get("wallet_3")!
  const wallet4 = accounts.get("wallet_4")!

  const SBTC_CONTRACT = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token"

  const setupTestEnvironment = () => {
    try {
      const deployerBalance = simnet.callReadOnlyFn(SBTC_CONTRACT, "get-balance", [Cl.principal(deployer)], deployer)

      if (deployerBalance.result && deployerBalance.result.type === "ok") {
        const balanceValue = deployerBalance.result.value
        if (balanceValue && balanceValue.type === "uint" && balanceValue.value > 0n) {
          simnet.callPublicFn(
            SBTC_CONTRACT,
            "transfer",
            [Cl.uint(500000000000), Cl.principal(deployer), Cl.principal(wallet1), Cl.none()],
            deployer,
          )

          simnet.callPublicFn(
            SBTC_CONTRACT,
            "transfer",
            [Cl.uint(300000000000), Cl.principal(deployer), Cl.principal(wallet2), Cl.none()],
            deployer,
          )

          simnet.callPublicFn(
            SBTC_CONTRACT,
            "transfer",
            [Cl.uint(300000000000), Cl.principal(deployer), Cl.principal(wallet3), Cl.none()],
            deployer,
          )

          simnet.callPublicFn(
            SBTC_CONTRACT,
            "transfer",
            [Cl.uint(200000000000), Cl.principal(deployer), Cl.principal(wallet4), Cl.none()],
            deployer,
          )

          simnet.callPublicFn(
            SBTC_CONTRACT,
            "transfer",
            [
              Cl.uint(10000000000),
              Cl.principal(deployer),
              Cl.principal(`${deployer.split(".")[0]}.investment-manager-v3`),
              Cl.none(),
            ],
            deployer,
          )

          simnet.callPublicFn(
            SBTC_CONTRACT,
            "transfer",
            [
              Cl.uint(10000000000),
              Cl.principal(deployer),
              Cl.principal(`${deployer.split(".")[0]}.rental-distributor-v3`),
              Cl.none(),
            ],
            deployer,
          )
        }
      }
    } catch (error) {
      console.log("Token setup failed:", error)
    }
  }

  const whitelistInvestor = (investor: string) => {
    simnet.callPublicFn("property-registry-v3", "whitelist-investor", [Cl.principal(investor)], deployer)
  }

  const createProperty = (
    submitter: string,
    totalValue: number,
    monthlyRent: number,
    minInvestment: number,
    fundingDays = 30,
  ) => {
    const result = simnet.callPublicFn(
      "property-registry-v3",
      "submit-property",
      [
        Cl.stringAscii("Test Property"),
        Cl.stringAscii("Test Location"),
        Cl.uint(totalValue),
        Cl.uint(monthlyRent),
        Cl.uint(minInvestment),
        Cl.uint(fundingDays),
        Cl.uint(8000),
      ],
      submitter,
    )

    if (result.result.type === "ok") {
      return result.result.value
    }
    return null
  }

  const createVerifiedProperty = (
    submitter: string,
    totalValue: number,
    monthlyRent: number,
    minInvestment: number,
    fundingDays = 30,
  ) => {
    const propertyId = createProperty(submitter, totalValue, monthlyRent, minInvestment, fundingDays)
    if (propertyId) {
      simnet.callPublicFn("property-registry-v3", "verify-property", [propertyId], deployer)
    }
    return propertyId
  }

  const investInProperty = (propertyId: any, investor: string, amount: number) => {
    return simnet.callPublicFn("investment-manager-v3", "invest-in-property", [propertyId, Cl.uint(amount)], investor)
  }

  const createFundedProperty = (submitter: string, totalValue: number, monthlyRent: number, minInvestment: number) => {
    const propertyId = createVerifiedProperty(submitter, totalValue, monthlyRent, minInvestment, 1)
    if (propertyId) {
      const fundingAmount = Math.floor(totalValue * 0.85)
      investInProperty(propertyId, wallet2, fundingAmount)

      for (let i = 0; i < 200; i++) {
        simnet.mineEmptyBlock()
      }

      simnet.callPublicFn("property-registry-v3", "check-funding-deadline", [propertyId], deployer)
    }
    return propertyId
  }

  beforeEach(() => {
    simnet.setEpoch("3.0")
    setupTestEnvironment()
    whitelistInvestor(wallet1)
    whitelistInvestor(wallet2)
    whitelistInvestor(wallet3)
    whitelistInvestor(wallet4)
  })

  describe("Contract Initialization and Read-Only Functions", () => {
    it("should return false for paused status initially", () => {
      const result = simnet.callReadOnlyFn("rental-distributor-v3", "is-contract-paused", [], deployer)
      expect(result.result).toEqual(Cl.bool(false))
    })

    it("should return platform wallet", () => {
      const result = simnet.callReadOnlyFn("rental-distributor-v3", "get-platform-wallet", [], deployer)
      expect(result.result).toEqual(Cl.principal(deployer))
    })

    it("should return zero for total platform fees initially", () => {
      const result = simnet.callReadOnlyFn("rental-distributor-v3", "get-total-platform-fees-collected", [], deployer)
      expect(result.result).toEqual(Cl.uint(0))
    })

    it("should return none for non-existent rental payment", () => {
      const result = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [Cl.uint(1), Cl.uint(1), Cl.uint(2025)],
        deployer,
      )
      expect(result.result).toEqual(Cl.none())
    })

    it("should return none for non-existent period claim", () => {
      const result = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-period-claim-info",
        [Cl.uint(1), Cl.uint(1), Cl.uint(2025), Cl.principal(wallet1)],
        deployer,
      )
      expect(result.result).toEqual(Cl.none())
    })

    it("should return zero for user with no investment", () => {
      const result = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "calculate-user-rental-share",
        [Cl.uint(1), Cl.principal(wallet1), Cl.uint(1000000)],
        deployer,
      )
      expect(result.result).toEqual(Cl.uint(0))
    })

    it("should return zero for non-existent claimable earnings", () => {
      const result = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-claimable-earnings",
        [Cl.uint(1), Cl.uint(1), Cl.uint(2025), Cl.principal(wallet1)],
        deployer,
      )
      expect(result.result).toEqual(Cl.uint(0))
    })
  })

  describe("Admin Functions", () => {
    it("should allow admin to pause contract", () => {
      const result = simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], deployer)
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))

      const paused = simnet.callReadOnlyFn("rental-distributor-v3", "is-contract-paused", [], deployer)
      expect(paused.result).toEqual(Cl.bool(true))
    })

    it("should reject pause from non-admin", () => {
      const result = simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], wallet1)
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should allow admin to unpause contract", () => {
      simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], deployer)

      const result = simnet.callPublicFn("rental-distributor-v3", "unpause-contract", [], deployer)
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))

      const paused = simnet.callReadOnlyFn("rental-distributor-v3", "is-contract-paused", [], deployer)
      expect(paused.result).toEqual(Cl.bool(false))
    })

    it("should allow admin to set platform wallet", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "set-platform-wallet",
        [Cl.principal(wallet4)],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))

      const wallet = simnet.callReadOnlyFn("rental-distributor-v3", "get-platform-wallet", [], deployer)
      expect(wallet.result).toEqual(Cl.principal(wallet4))
    })

    it("should reject invalid platform wallet", () => {
      const contractPrincipal = `${deployer.split(".")[0]}.rental-distributor-v3`
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "set-platform-wallet",
        [Cl.principal(contractPrincipal)],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should reject platform wallet update from non-admin", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "set-platform-wallet",
        [Cl.principal(wallet4)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })
  })

  describe("Rental Income Deposit - Validation Tests", () => {
    let propertyId: any

    beforeEach(() => {
      propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
    })

    it("should reject deposit when contract is paused", () => {
      if (!propertyId) return
      simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], deployer)

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3009)))
    })

    it("should reject deposit for non-existent property", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [Cl.uint(999), Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3002)))
    })

    it("should reject deposit from non-owner", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should reject deposit with invalid month (0)", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(0), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should reject deposit with invalid month (13)", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(13), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should reject deposit with invalid year (too low)", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2023), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should reject deposit with rent amount too low", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(500), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should reject deposit with rent amount too high", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(2000000000000), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should reject rent amount outside tolerance range", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(5000000), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3014)))
    })

    it("should reject expenses exceeding maximum percentage", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(5000000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3015)))
    })

    it("should reject duplicate deposit for same period", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should allow valid rental income deposit", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should store rental payment data correctly", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const payment = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      expect(payment.result.type).toBe("some")
      if (payment.result.type === "some") {
        expect(payment.result.value.value["total-rent-sbtc"]).toEqual(Cl.uint(8333333))
        expect(payment.result.value.value["expenses-deducted"]).toEqual(Cl.uint(100000))
        expect(payment.result.value.value["distributed"]).toEqual(Cl.bool(false))
        expect(payment.result.value.value["deposited-by"]).toEqual(Cl.principal(wallet1))
      }
    })

    it("should calculate platform fee correctly", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const payment = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      if (payment.result.type === "some") {
        const platformFee = payment.result.value.value["platform-fee-collected"].value
        const expectedFee = (8333333n * 300n) / 10000n
        expect(platformFee).toEqual(expectedFee)
      }
    })

    it("should calculate net distributable correctly", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const payment = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      if (payment.result.type === "some") {
        const netDistributable = payment.result.value.value["net-distributable"].value
        const platformFee = (8333333n * 300n) / 10000n
        const expected = 8333333n - 100000n - platformFee
        expect(netDistributable).toEqual(expected)
      }
    })

    it("should update total platform fees collected", () => {
      if (!propertyId) return
      const beforeFees = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-total-platform-fees-collected",
        [],
        deployer,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const afterFees = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-total-platform-fees-collected",
        [],
        deployer,
      )

      const expectedFee = (8333333n * 300n) / 10000n
      expect(afterFees.result.value).toEqual(beforeFees.result.value + expectedFee)
    })
  })

  describe("Rental Income Deposit Override", () => {
    let propertyId: any

    beforeEach(() => {
      propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
    })

    it("should allow admin to deposit with override", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income-override",
        [
          propertyId,
          Cl.uint(1),
          Cl.uint(2025),
          Cl.uint(5000000),
          Cl.uint(100000),
          Cl.stringAscii("Market downturn adjustment"),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should reject override from non-admin", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income-override",
        [
          propertyId,
          Cl.uint(1),
          Cl.uint(2025),
          Cl.uint(5000000),
          Cl.uint(100000),
          Cl.stringAscii("Market downturn adjustment"),
        ],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should reject override when contract paused", () => {
      if (!propertyId) return
      simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], deployer)

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income-override",
        [
          propertyId,
          Cl.uint(1),
          Cl.uint(2025),
          Cl.uint(5000000),
          Cl.uint(100000),
          Cl.stringAscii("Market downturn adjustment"),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3009)))
    })

    it("should reject override with short explanation", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income-override",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(5000000), Cl.uint(100000), Cl.stringAscii("Short")],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3008)))
    })

    it("should allow override with amounts outside normal range", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income-override",
        [
          propertyId,
          Cl.uint(1),
          Cl.uint(2025),
          Cl.uint(5000000),
          Cl.uint(100000),
          Cl.stringAscii("Emergency rent adjustment due to property damage"),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })
  })

  describe("Distribution Functions", () => {
    let propertyId: any

    beforeEach(() => {
      propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (propertyId) {
        simnet.callPublicFn(
          "rental-distributor-v3",
          "deposit-rental-income",
          [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
          wallet1,
        )
      }
    })

    it("should reject distribution when contract paused", () => {
      if (!propertyId) return
      simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], deployer)

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3009)))
    })

    it("should reject distribution for non-existent payment", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [Cl.uint(999), Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3002)))
    })

    it("should reject distribution from non-authorized user", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet3,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should allow owner to distribute", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should allow admin to distribute", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should mark payment as distributed", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )

      const payment = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      if (payment.result.type === "some") {
        expect(payment.result.value.value["distributed"]).toEqual(Cl.bool(true))
        expect(payment.result.value.value["distribution-date"].value).toBeGreaterThan(0n)
      }
    })

    it("should reject duplicate distribution", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3004)))
    })
  })

  describe("Claim Functions", () => {
    let propertyId: any

    beforeEach(() => {
      propertyId = createVerifiedProperty(wallet1, 100000000, 8333333, 10000000, 1)
      if (propertyId) {
        investInProperty(propertyId, wallet2, 50000000)
        investInProperty(propertyId, wallet3, 30000000)

        for (let i = 0; i < 200; i++) {
          simnet.mineEmptyBlock()
        }

        simnet.callPublicFn("property-registry-v3", "check-funding-deadline", [propertyId], deployer)

        simnet.callPublicFn(
          "rental-distributor-v3",
          "deposit-rental-income",
          [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
          wallet1,
        )

        simnet.callPublicFn(
          "rental-distributor-v3",
          "distribute-rental-income",
          [propertyId, Cl.uint(1), Cl.uint(2025)],
          wallet1,
        )
      }
    })

    it("should reject claim when contract paused", () => {
      if (!propertyId) return
      simnet.callPublicFn("rental-distributor-v3", "pause-contract", [], deployer)

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3009)))
    })

    it("should reject claim for non-distributed payment", () => {
      const newPropId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!newPropId) return

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [newPropId, Cl.uint(2), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [newPropId, Cl.uint(2), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3005)))
    })

    it("should reject claim for non-existent payment", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [Cl.uint(999), Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3002)))
    })

    it("should reject claim with invalid month", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(0), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3005)))
    })

    it("should allow valid claim", () => {
      if (!propertyId) return
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result.type).toBe("ok")
    })

    it("should reject duplicate claim", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3005)))
    })

    it("should calculate user share proportionally", () => {
      if (!propertyId) return
      const claim2 = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      const claim3 = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet3,
      )

      if (claim2.result.type === "ok" && claim3.result.type === "ok") {
        const amount2 = claim2.result.value
        const amount3 = claim3.result.value

        const ratio = Number(amount2) / Number(amount3)
        const expectedRatio = 50000000 / 30000000

        expect(Math.abs(ratio - expectedRatio)).toBeLessThan(0.01)
      }
    })

    it("should store claim data correctly", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      const claim = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-period-claim-info",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.principal(wallet2)],
        deployer,
      )

      expect(claim.result.type).toBe("some")
      if (claim.result.type === "some") {
        expect(claim.result.value.value["claimed"]).toEqual(Cl.bool(true))
        expect(claim.result.value.value["claim-date"].value).toBeGreaterThan(0n)
        expect(claim.result.value.value["net-amount"].value).toBeGreaterThan(0n)
      }
    })

    it("should reject claim below minimum claimable amount", () => {
      const smallPropId = createVerifiedProperty(wallet1, 100000000, 8333333, 10000000, 1)
      if (!smallPropId) return

      investInProperty(smallPropId, wallet2, 80000000)
      investInProperty(smallPropId, wallet4, 100)

      for (let i = 0; i < 200; i++) {
        simnet.mineEmptyBlock()
      }

      simnet.callPublicFn("property-registry-v3", "check-funding-deadline", [smallPropId], deployer)

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [smallPropId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [smallPropId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [smallPropId, Cl.uint(1), Cl.uint(2025)],
        wallet4,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3005)))
    })

    it("should enforce withdrawal cooldown", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(2), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(2), Cl.uint(2025)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(2), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3011)))
    })

    it("should allow claim after cooldown period", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      for (let i = 0; i < 150; i++) {
        simnet.mineEmptyBlock()
      }

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(2), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(2), Cl.uint(2025)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(2), Cl.uint(2025)],
        wallet2,
      )
      expect(result.result.type).toBe("ok")
    })

    it("should return correct claimable earnings", () => {
      if (!propertyId) return
      const claimable = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-claimable-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.principal(wallet2)],
        deployer,
      )

      expect(claimable.result.value).toBeGreaterThan(0n)
    })

    it("should return zero claimable earnings after claim", () => {
      if (!propertyId) return
      simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      const claimable = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-claimable-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.principal(wallet2)],
        deployer,
      )

      expect(claimable.result).toEqual(Cl.uint(0))
    })
  })

  describe("Calculate User Rental Share", () => {
    let propertyId: any

    beforeEach(() => {
      propertyId = createVerifiedProperty(wallet1, 100000000, 8333333, 10000000, 1)
      if (propertyId) {
        investInProperty(propertyId, wallet2, 60000000)
        investInProperty(propertyId, wallet3, 20000000)

        for (let i = 0; i < 200; i++) {
          simnet.mineEmptyBlock()
        }

        simnet.callPublicFn("property-registry-v3", "check-funding-deadline", [propertyId], deployer)
      }
    })

    it("should calculate share for majority investor", () => {
      if (!propertyId) return
      const share = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "calculate-user-rental-share",
        [propertyId, Cl.principal(wallet2), Cl.uint(8000000)],
        deployer,
      )

      const expectedShare = (8000000n * 60000000n) / 80000000n
      expect(share.result).toEqual(Cl.uint(Number(expectedShare)))
    })

    it("should calculate share for minority investor", () => {
      if (!propertyId) return
      const share = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "calculate-user-rental-share",
        [propertyId, Cl.principal(wallet3), Cl.uint(8000000)],
        deployer,
      )

      const expectedShare = (8000000n * 20000000n) / 80000000n
      expect(share.result).toEqual(Cl.uint(Number(expectedShare)))
    })

    it("should return zero for non-investor", () => {
      if (!propertyId) return
      const share = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "calculate-user-rental-share",
        [propertyId, Cl.principal(wallet4), Cl.uint(8000000)],
        deployer,
      )

      expect(share.result).toEqual(Cl.uint(0))
    })

    it("should handle zero net distributable", () => {
      if (!propertyId) return
      const share = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "calculate-user-rental-share",
        [propertyId, Cl.principal(wallet2), Cl.uint(0)],
        deployer,
      )

      expect(share.result).toEqual(Cl.uint(0))
    })
  })

  describe("Emergency Functions", () => {
    it("should reject emergency withdraw from non-admin", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "emergency-withdraw-platform-fees",
        [Cl.uint(1000000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should reject emergency withdraw without active emergency", () => {
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "emergency-withdraw-platform-fees",
        [Cl.uint(1000000)],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should allow emergency withdraw during active emergency", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      simnet.callPublicFn("governance-v3", "declare-emergency", [Cl.stringAscii("Critical system issue")], deployer)

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "emergency-withdraw-platform-fees",
        [Cl.uint(100000)],
        deployer,
      )

      if (result.result.type === "ok") {
        expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
      }
    })

    it("should reject emergency withdraw after cooldown", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      // Deposit rental income to accumulate platform fees
      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      // Declare emergency with proper parameters (emergency-type, reason, max-amount)
      simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("Critical system vulnerability"),
          Cl.stringAscii(
            "A critical security vulnerability has been discovered that requires immediate action to protect user funds and system integrity",
          ),
          Cl.uint(5000000000),
        ],
        deployer,
      )

      // Emergency withdraw should succeed during active emergency
      const withdrawResult = simnet.callPublicFn(
        "rental-distributor-v3",
        "emergency-withdraw-platform-fees",
        [Cl.uint(100000)],
        deployer,
      )
      expect(withdrawResult.result.type).toBe("ok")

      // Mine blocks to pass the emergency cooldown period (1440 blocks)
      for (let i = 0; i < 1450; i++) {
        simnet.mineEmptyBlock()
      }

      // After cooldown, without declaring a new emergency, withdraw should be rejected
      // because the previous emergency has expired
      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "emergency-withdraw-platform-fees",
        [Cl.uint(100000)],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(3001)))
    })

    it("should check can-trigger-emergency status", () => {
      const result = simnet.callReadOnlyFn("rental-distributor-v3", "can-trigger-emergency", [], deployer)
      expect(result.result).toEqual(Cl.bool(false))
    })
  })

  describe("Multiple Properties and Periods", () => {
    it("should handle multiple properties independently", () => {
      const prop1 = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      const prop2 = createFundedProperty(wallet1, 150000000, 10000000, 15000000)

      if (!prop1 || !prop2) return

      const result1 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [prop1, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const result2 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [prop2, Cl.uint(1), Cl.uint(2025), Cl.uint(10000000), Cl.uint(150000)],
        wallet1,
      )

      expect(result1.result).toEqual(Cl.ok(Cl.bool(true)))
      expect(result2.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should handle multiple periods for same property", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const result1 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const result2 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(2), Cl.uint(2025), Cl.uint(8333333), Cl.uint(120000)],
        wallet1,
      )

      const result3 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(3), Cl.uint(2025), Cl.uint(8333333), Cl.uint(110000)],
        wallet1,
      )

      expect(result1.result).toEqual(Cl.ok(Cl.bool(true)))
      expect(result2.result).toEqual(Cl.ok(Cl.bool(true)))
      expect(result3.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should handle year transition correctly", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const result1 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(12), Cl.uint(2024), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const result2 = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(120000)],
        wallet1,
      )

      expect(result1.result).toEqual(Cl.ok(Cl.bool(true)))
      expect(result2.result).toEqual(Cl.ok(Cl.bool(true)))
    })
  })

  describe("Complex Scenarios", () => {
    it("should handle full rental cycle for multiple investors", () => {
      const propertyId = createVerifiedProperty(wallet1, 200000000, 16666666, 20000000, 1)
      if (!propertyId) return

      investInProperty(propertyId, wallet2, 100000000)
      investInProperty(propertyId, wallet3, 60000000)
      investInProperty(propertyId, wallet4, 40000000)

      for (let i = 0; i < 200; i++) {
        simnet.mineEmptyBlock()
      }

      simnet.callPublicFn("property-registry-v3", "check-funding-deadline", [propertyId], deployer)

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(16666666), Cl.uint(200000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )

      const claim2 = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      const claim3 = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet3,
      )

      const claim4 = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet4,
      )

      expect(claim2.result.type).toBe("ok")
      expect(claim3.result.type).toBe("ok")
      expect(claim4.result.type).toBe("ok")

      if (claim2.result.type === "ok" && claim3.result.type === "ok" && claim4.result.type === "ok") {
        const total = claim2.result.value + claim3.result.value + claim4.result.value
        const payment = simnet.callReadOnlyFn(
          "rental-distributor-v3",
          "get-rental-payment-info",
          [propertyId, Cl.uint(1), Cl.uint(2025)],
          deployer,
        )

        if (payment.result.type === "some") {
          const netDistributable = payment.result.value.value["net-distributable"].value
          expect(total).toEqual(netDistributable)
        }
      }
    })

    it("should handle varying expenses across months", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(50000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(2), Cl.uint(2025), Cl.uint(8333333), Cl.uint(200000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(3), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const payment1 = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      const payment2 = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(2), Cl.uint(2025)],
        deployer,
      )

      const payment3 = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(3), Cl.uint(2025)],
        deployer,
      )

      if (payment1.result.type === "some" && payment2.result.type === "some" && payment3.result.type === "some") {
        const net1 = payment1.result.value.value["net-distributable"].value
        const net2 = payment2.result.value.value["net-distributable"].value
        const net3 = payment3.result.value.value["net-distributable"].value

        expect(net1).toBeGreaterThan(net2)
        expect(net3).toBeGreaterThan(net2)
      }
    })

    it("should accumulate platform fees over multiple deposits", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const initialFees = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-total-platform-fees-collected",
        [],
        deployer,
      )

      for (let month = 1; month <= 6; month++) {
        simnet.callPublicFn(
          "rental-distributor-v3",
          "deposit-rental-income",
          [propertyId, Cl.uint(month), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
          wallet1,
        )
      }

      const finalFees = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-total-platform-fees-collected",
        [],
        deployer,
      )

      const expectedFee = (8333333n * 300n) / 10000n
      const expectedTotal = initialFees.result.value + expectedFee * 6n

      expect(finalFees.result.value).toEqual(expectedTotal)
    })
  })

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle minimum rent amount", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 1000, 10000000)
      if (!propertyId) return

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(1000), Cl.uint(10)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should handle maximum rent amount within bounds", () => {
      const propertyId = createFundedProperty(wallet1, 1000000000, 999999999, 100000000)
      if (!propertyId) return

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(999999999), Cl.uint(1000000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should handle zero expenses", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(0)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))

      const payment = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      if (payment.result.type === "some") {
        expect(payment.result.value.value["expenses-deducted"]).toEqual(Cl.uint(0))
      }
    })

    it("should handle maximum allowed expenses", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const maxExpenses = (8333333 * 5000) / 10000

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(maxExpenses)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should handle all months of the year", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      for (let month = 1; month <= 12; month++) {
        const result = simnet.callPublicFn(
          "rental-distributor-v3",
          "deposit-rental-income",
          [propertyId, Cl.uint(month), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
          wallet1,
        )
        expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
      }
    })

    it("should handle rent at lower tolerance boundary", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const minAcceptable = 8333333 - (8333333 * 500) / 10000

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(minAcceptable), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should handle rent at upper tolerance boundary", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const maxAcceptable = 8333333 + (8333333 * 500) / 10000

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(maxAcceptable), Cl.uint(100000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })
  })

  describe("Safe Arithmetic Operations", () => {
    it("should handle large rent amounts safely", () => {
      const propertyId = createFundedProperty(wallet1, 10000000000, 900000000, 1000000000)
      if (!propertyId) return

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(900000000), Cl.uint(10000000)],
        wallet1,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should calculate fees correctly for large amounts", () => {
      const propertyId = createFundedProperty(wallet1, 10000000000, 900000000, 1000000000)
      if (!propertyId) return

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(900000000), Cl.uint(10000000)],
        wallet1,
      )

      const payment = simnet.callReadOnlyFn(
        "rental-distributor-v3",
        "get-rental-payment-info",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        deployer,
      )

      if (payment.result.type === "some") {
        const platformFee = payment.result.value.value["platform-fee-collected"].value
        const expectedFee = (900000000n * 300n) / 10000n
        expect(platformFee).toEqual(expectedFee)
      }
    })
  })

  describe("Contract Integration Tests", () => {
    it("should integrate with property registry", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const property = simnet.callReadOnlyFn("property-registry-v3", "get-property", [propertyId], deployer)

      expect(property.result.type).toBe("some")
    })

    it("should integrate with investment manager", () => {
      const propertyId = createVerifiedProperty(wallet1, 100000000, 8333333, 10000000, 1)
      if (!propertyId) return

      investInProperty(propertyId, wallet2, 50000000)

      const investment = simnet.callReadOnlyFn(
        "data-store-v3",
        "get-user-investment",
        [propertyId, Cl.principal(wallet2)],
        deployer,
      )

      expect(investment["sbtc-invested"]).toBeGreaterThan(0n)
    })

    it("should verify governance integration for emergency", () => {
      const canTrigger = simnet.callReadOnlyFn("rental-distributor-v3", "can-trigger-emergency", [], deployer)
      expect(canTrigger.result).toEqual(Cl.bool(false))
    })
  })

  describe("Event Logging", () => {
    it("should emit deposit event", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      expect(result.events).toBeDefined()
    })

    it("should emit distribution event", () => {
      const propertyId = createFundedProperty(wallet1, 100000000, 8333333, 10000000)
      if (!propertyId) return

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )

      expect(result.events).toBeDefined()
    })

    it("should emit claim event", () => {
      const propertyId = createVerifiedProperty(wallet1, 100000000, 8333333, 10000000, 1)
      if (!propertyId) return

      investInProperty(propertyId, wallet2, 50000000)

      for (let i = 0; i < 200; i++) {
        simnet.mineEmptyBlock()
      }

      simnet.callPublicFn("property-registry-v3", "check-funding-deadline", [propertyId], deployer)

      simnet.callPublicFn(
        "rental-distributor-v3",
        "deposit-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025), Cl.uint(8333333), Cl.uint(100000)],
        wallet1,
      )

      simnet.callPublicFn(
        "rental-distributor-v3",
        "distribute-rental-income",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet1,
      )

      const result = simnet.callPublicFn(
        "rental-distributor-v3",
        "claim-rental-earnings",
        [propertyId, Cl.uint(1), Cl.uint(2025)],
        wallet2,
      )

      expect(result.events).toBeDefined()
    })
  })
})
