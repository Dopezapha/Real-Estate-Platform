// data-store-v3.test.ts
import { describe, expect, it, beforeEach } from "vitest"
import { Cl } from "@stacks/transactions"
declare const simnet: any

describe("Data Store v3 Contract - Comprehensive Tests", () => {
  const accounts = simnet.getAccounts()
  const deployer = accounts.get("deployer")!
  const wallet1 = accounts.get("wallet_1")!
  const wallet2 = accounts.get("wallet_2")!
  const wallet3 = accounts.get("wallet_3")!

  beforeEach(() => {
    simnet.setEpoch("3.0")
  })

  describe("Read-Only Functions", () => {
    it("should return default investment data for non-existent investment", () => {
      const result = simnet.callReadOnlyFn(
        "data-store-v3",
        "get-user-investment",
        [Cl.uint(1), Cl.principal(wallet1)],
        deployer,
      )

      expect(result.result).toEqual(
        Cl.tuple({
          "sbtc-invested": Cl.uint(0),
          "investment-date": Cl.uint(0),
          "last-updated": Cl.uint(0),
        }),
      )
    })

    it("should return default property totals for non-existent property", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "get-property-investment-totals", [Cl.uint(1)], deployer)

      expect(result.result).toEqual(
        Cl.tuple({
          "total-sbtc-invested": Cl.uint(0),
          "investor-count": Cl.uint(0),
          "last-updated": Cl.uint(0),
        }),
      )
    })

    it("should return default user portfolio for non-existent user", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "get-user-portfolio", [Cl.principal(wallet1)], deployer)

      expect(result.result).toEqual(
        Cl.tuple({
          "total-sbtc-invested": Cl.uint(0),
          "property-count": Cl.uint(0),
          "total-earnings": Cl.uint(0),
          "last-updated": Cl.uint(0),
        }),
      )
    })

    it("should allow anyone to read data", () => {
      const result = simnet.callReadOnlyFn(
        "data-store-v3",
        "get-user-investment",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet3,
      )

      expect(result.result).toBeTruthy()
    })
  })

  describe("Authorization Checks", () => {
    it("should reject unauthorized caller updating user investment", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-investment",
        [Cl.uint(1), Cl.principal(wallet1), Cl.uint(100000000), Cl.uint(7)],
        wallet2,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1001)))
    })

    it("should reject unauthorized caller updating property totals", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-property-totals",
        [Cl.uint(1), Cl.uint(500000000), Cl.uint(5)],
        wallet2,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1001)))
    })

    it("should reject unauthorized caller updating user portfolio", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-portfolio",
        [Cl.principal(wallet1), Cl.uint(200000000), Cl.uint(3), Cl.uint(5000000)],
        wallet2,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1001)))
    })
  })

  describe("Input Validation", () => {
    it("should reject zero property ID", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-investment",
        [Cl.uint(0), Cl.principal(wallet1), Cl.uint(100000000), Cl.uint(7)],
        deployer,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1002)))
    })

    it("should reject invalid principal", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-investment",
        [Cl.uint(1), Cl.principal("ST000000000000000000002AMW42H"), Cl.uint(100000000), Cl.uint(7)],
        deployer,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1002)))
    })

    it("should reject excessive sBTC amount", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-investment",
        [Cl.uint(1), Cl.principal(wallet1), Cl.uint(2000000000000), Cl.uint(7)],
        deployer,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1002)))
    })

    it("should reject future investment date", () => {
      const futureBlock = 999999999
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-investment",
        [Cl.uint(1), Cl.principal(wallet1), Cl.uint(100000000), Cl.uint(futureBlock)],
        deployer,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1002)))
    })

    it("should reject excessive investor count", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-property-totals",
        [Cl.uint(1), Cl.uint(500000000), Cl.uint(2000)],
        deployer,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1002)))
    })

    it("should reject excessive property count", () => {
      const result = simnet.callPublicFn(
        "data-store-v3",
        "update-user-portfolio",
        [Cl.principal(wallet1), Cl.uint(200000000), Cl.uint(2000), Cl.uint(5000000)],
        deployer,
      )

      expect(result.result).toEqual(Cl.error(Cl.uint(1002)))
    })
  })

  describe("Data Consistency", () => {
    it("should maintain consistent data across multiple reads", () => {
      const result1 = simnet.callReadOnlyFn(
        "data-store-v3",
        "get-user-investment",
        [Cl.uint(1), Cl.principal(wallet1)],
        deployer,
      )

      const result2 = simnet.callReadOnlyFn(
        "data-store-v3",
        "get-user-investment",
        [Cl.uint(1), Cl.principal(wallet1)],
        wallet2,
      )

      expect(result1.result).toEqual(result2.result)
    })

    it("should return consistent portfolio data", () => {
      const result1 = simnet.callReadOnlyFn("data-store-v3", "get-user-portfolio", [Cl.principal(wallet1)], deployer)

      const result2 = simnet.callReadOnlyFn("data-store-v3", "get-user-portfolio", [Cl.principal(wallet1)], wallet2)

      expect(result1.result).toEqual(result2.result)
    })

    it("should return consistent property totals", () => {
      const result1 = simnet.callReadOnlyFn("data-store-v3", "get-property-investment-totals", [Cl.uint(1)], deployer)

      const result2 = simnet.callReadOnlyFn("data-store-v3", "get-property-investment-totals", [Cl.uint(1)], wallet2)

      expect(result1.result).toEqual(result2.result)
    })
  })

  describe("Edge Cases", () => {
    it("should handle property ID of 1", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "get-property-investment-totals", [Cl.uint(1)], deployer)

      expect(result.result).toBeTruthy()
    })

    it("should handle large property IDs", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "get-property-investment-totals", [Cl.uint(999)], deployer)

      expect(result.result).toBeTruthy()
    })

    it("should handle multiple different users", () => {
      const users = [wallet1, wallet2, wallet3]

      users.forEach((user) => {
        const result = simnet.callReadOnlyFn("data-store-v3", "get-user-portfolio", [Cl.principal(user)], deployer)

        expect(result.result).toBeTruthy()
      })
    })

    it("should handle multiple different properties", () => {
      const properties = [1, 2, 3, 4, 5]

      properties.forEach((propId) => {
        const result = simnet.callReadOnlyFn(
          "data-store-v3",
          "get-property-investment-totals",
          [Cl.uint(propId)],
          deployer,
        )

        expect(result.result).toBeTruthy()
      })
    })
  })

  describe("Utility Functions", () => {
    it("should return zero for total properties tracked", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "get-total-properties-tracked", [], deployer)

      expect(result.result).toEqual(Cl.uint(0))
    })

    it("should verify caller correctly", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "verify-caller", [Cl.principal(deployer)], deployer)

      expect(result.result.type).toBe("ok")
    })
  })

  describe("Authorization Read-Only Check", () => {
    it("should return authorization status", () => {
      const result = simnet.callReadOnlyFn("data-store-v3", "is-authorized-caller", [], deployer)

      expect(result.result).toEqual(Cl.bool(false))
    })
  })
})