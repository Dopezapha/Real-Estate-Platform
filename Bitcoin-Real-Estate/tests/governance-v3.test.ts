// governance-v3.test.ts
import { describe, expect, it, beforeEach } from "vitest"
import { Cl } from "@stacks/transactions"

declare const simnet: any

describe("Governance v3 Contract - Comprehensive Tests", () => {
  const accounts = simnet.getAccounts()
  const deployer = accounts.get("deployer")!
  const wallet1 = accounts.get("wallet_1")!
  const wallet2 = accounts.get("wallet_2")!
  const wallet3 = accounts.get("wallet_3")!
  const wallet4 = accounts.get("wallet_4")!

  beforeEach(() => {
    simnet.setEpoch("3.0")
  })

  describe("Contract Initialization", () => {
    it("should initialize with three admins", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))

      const isAdmin1 = simnet.callReadOnlyFn("governance-v3", "is-admin", [Cl.principal(deployer)], deployer)
      const isAdmin2 = simnet.callReadOnlyFn("governance-v3", "is-admin", [Cl.principal(wallet1)], deployer)
      const isAdmin3 = simnet.callReadOnlyFn("governance-v3", "is-admin", [Cl.principal(wallet2)], deployer)

      expect(isAdmin1.result).toEqual(Cl.bool(true))
      expect(isAdmin2.result).toEqual(Cl.bool(true))
      expect(isAdmin3.result).toEqual(Cl.bool(true))
    })

    it("should start with zero action counter", () => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )

      const result = simnet.callReadOnlyFn("governance-v3", "get-action-counter", [], deployer)
      expect(result.result).toEqual(Cl.uint(0))
    })

    it("should have default approval requirement of 2", () => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )

      const result = simnet.callReadOnlyFn("governance-v3", "get-required-approvals", [], deployer)
      expect(result.result).toEqual(Cl.uint(2))
    })

    it("should return correct admin count", () => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )

      const result = simnet.callReadOnlyFn("governance-v3", "get-admin-count", [], deployer)
      expect(result.result).toEqual(Cl.uint(3))
    })

    it("should reject duplicate admins during initialization", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(deployer),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5011)))
    })

    it("should reject invalid admin names", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("A"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5008)))
    })
  })

  describe("Action Proposal and Approval", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should allow admin to propose action", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.uint(1)))
    })

    it("should reject non-admin proposing action", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Unauthorized proposal attempt by non-admin"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        wallet3,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5001)))
    })

    it("should reject proposal with short description", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Short"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5008)))
    })

    it("should reject invalid action type", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("invalid-action-type"),
          Cl.stringAscii("This action type is not recognized by the system"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5008)))
    })

    it("should allow admin to approve proposed action", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      const result = simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should reject double approval from same admin", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      const result = simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)
      expect(result.result).toEqual(Cl.error(Cl.uint(5007)))
    })

    it("should track approval count correctly", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      const actionInfo = simnet.callReadOnlyFn("governance-v3", "get-action", [Cl.uint(1)], deployer)

      expect(actionInfo.result.type).toBe("some")
      if (actionInfo.result.type === "some") {
        const approvalCount = actionInfo.result.value.data["approval-count"]
        expect(approvalCount).toEqual(Cl.uint(2))
      }
    })
  })

  describe("Action Execution", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should allow execution of approved action after timelock", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      simnet.mineEmptyBlocks(1441)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      expect(result.result.type).toBe("ok")
    })

    it("should reject execution before timelock expires", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      expect(result.result).toEqual(Cl.error(Cl.uint(5005)))
    })

    it("should reject execution of unapproved action", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.mineEmptyBlocks(1441)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      expect(result.result).toEqual(Cl.error(Cl.uint(5003)))
    })

    it("should reject double execution", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)
      simnet.mineEmptyBlocks(1441)
      simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      expect(result.result).toEqual(Cl.error(Cl.uint(5004)))
    })

    it("should enforce longer timelock for critical actions", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("add-admin"),
          Cl.stringAscii("Add new admin to governance council for expanded oversight"),
          Cl.stringAscii("governance-v3"),
          Cl.some(Cl.principal(wallet3)),
          Cl.uint(0),
          Cl.uint(0),
          Cl.uint(0),
          Cl.some(Cl.stringAscii("New Admin Name")),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      simnet.mineEmptyBlocks(1441)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      // Should fail because critical actions need 30 days
      expect(result.result).toEqual(Cl.error(Cl.uint(5005)))
    })

    it("should allow critical action execution after 30 days", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("add-admin"),
          Cl.stringAscii("Add new admin to governance council for expanded oversight"),
          Cl.stringAscii("governance-v3"),
          Cl.some(Cl.principal(wallet3)),
          Cl.uint(0),
          Cl.uint(0),
          Cl.uint(0),
          Cl.some(Cl.stringAscii("New Admin Name")),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      simnet.mineEmptyBlocks(4321)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      expect(result.result.type).toBe("ok")
    })

    it("should reject execution of expired action", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)

      simnet.mineEmptyBlocks(8641)

      const result = simnet.callPublicFn("governance-v3", "execute-action", [Cl.uint(1)], deployer)
      expect(result.result).toEqual(Cl.error(Cl.uint(5006)))
    })
  })

  describe("Emergency Powers", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should allow admin to declare emergency", () => {
      // First declare an emergency to set last-emergency-block
      simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("system-breach"),
          Cl.stringAscii(
            "Critical security vulnerability detected requiring immediate action to protect user funds and data",
          ),
          Cl.uint(5000000000),
        ],
        deployer,
      )

      // Mine blocks to pass cooldown
      simnet.mineEmptyBlocks(1441)

      // Now declare another emergency
      const result = simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("second-breach"),
          Cl.stringAscii(
            "Another critical security vulnerability detected requiring immediate action to protect user funds",
          ),
          Cl.uint(5000000000),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should enforce emergency amount limit", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("system-breach"),
          Cl.stringAscii(
            "Critical security vulnerability detected requiring immediate action to protect user funds and data",
          ),
          Cl.uint(20000000000),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5008)))
    })

    it("should reject emergency with short reason", () => {
      // First declare an emergency
      simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("system-breach"),
          Cl.stringAscii(
            "Critical security vulnerability detected requiring immediate action to protect user funds and data",
          ),
          Cl.uint(5000000000),
        ],
        deployer,
      )

      // Mine blocks to pass cooldown
      simnet.mineEmptyBlocks(1441)

      // Now try with short reason
      const result = simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [Cl.stringAscii("system-breach"), Cl.stringAscii("Short reason"), Cl.uint(5000000000)],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5008)))
    })

    it("should check can-trigger-emergency status", () => {
      // Initially can trigger
      let result = simnet.callReadOnlyFn("governance-v3", "can-trigger-emergency", [], deployer)
      expect(result.result).toEqual(Cl.bool(true))

      // Declare emergency
      simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("system-breach"),
          Cl.stringAscii(
            "Critical security vulnerability detected requiring immediate action to protect user funds and data",
          ),
          Cl.uint(5000000000),
        ],
        deployer,
      )

      // Now can't trigger (cooldown active)
      result = simnet.callReadOnlyFn("governance-v3", "can-trigger-emergency", [], deployer)
      expect(result.result).toEqual(Cl.bool(false))
    })

    it("should reject non-admin emergency declaration", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "declare-emergency",
        [
          Cl.stringAscii("system-breach"),
          Cl.stringAscii(
            "Critical security vulnerability detected requiring immediate action to protect user funds and data",
          ),
          Cl.uint(5000000000),
        ],
        wallet3,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5001)))
    })

    it("should return emergency stats", () => {
      const result = simnet.callReadOnlyFn("governance-v3", "get-emergency-stats", [], deployer)
      expect(result.result.type).toBe("tuple")
    })
  })

  describe("Verification Criteria Management", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should allow admin to set verification criteria", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "set-verification-criteria",
        [
          Cl.uint(1),
          Cl.stringAscii("min-property-value"),
          Cl.stringAscii("Minimum property value requirement for investment eligibility"),
          Cl.bool(true),
          Cl.uint(50),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))
    })

    it("should retrieve verification criteria", () => {
      simnet.callPublicFn(
        "governance-v3",
        "set-verification-criteria",
        [
          Cl.uint(1),
          Cl.stringAscii("min-property-value"),
          Cl.stringAscii("Minimum property value requirement for investment eligibility"),
          Cl.bool(true),
          Cl.uint(50),
        ],
        deployer,
      )

      const result = simnet.callReadOnlyFn("governance-v3", "get-verification-criteria", [Cl.uint(1)], deployer)

      expect(result.result.type).toBe("some")
      if (result.result.type === "some") {
        const weight = result.result.value.data["weight"]
        expect(weight).toEqual(Cl.uint(50))
      }
    })

    it("should reject non-admin setting criteria", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "set-verification-criteria",
        [
          Cl.uint(1),
          Cl.stringAscii("min-property-value"),
          Cl.stringAscii("Unauthorized attempt to set verification criteria"),
          Cl.bool(true),
          Cl.uint(50),
        ],
        wallet3,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5001)))
    })

    it("should reject invalid weight", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "set-verification-criteria",
        [
          Cl.uint(1),
          Cl.stringAscii("min-property-value"),
          Cl.stringAscii("Minimum property value requirement for investment eligibility"),
          Cl.bool(true),
          Cl.uint(150),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5008)))
    })

    it("should allow updating existing criteria", () => {
      simnet.callPublicFn(
        "governance-v3",
        "set-verification-criteria",
        [
          Cl.uint(1),
          Cl.stringAscii("min-property-value"),
          Cl.stringAscii("Initial minimum property value requirement"),
          Cl.bool(true),
          Cl.uint(50),
        ],
        deployer,
      )

      const result = simnet.callPublicFn(
        "governance-v3",
        "set-verification-criteria",
        [
          Cl.uint(1),
          Cl.stringAscii("min-property-value-updated"),
          Cl.stringAscii("Updated minimum property value requirement with new threshold"),
          Cl.bool(true),
          Cl.uint(75),
        ],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)))

      const criteria = simnet.callReadOnlyFn("governance-v3", "get-verification-criteria", [Cl.uint(1)], deployer)

      if (criteria.result.type === "some") {
        const weight = criteria.result.value.data["weight"]
        expect(weight).toEqual(Cl.uint(75))
      }
    })
  })

  describe("Property Verification", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should allow admin to record verification check", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "record-verification-check",
        [Cl.uint(1), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true)],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.uint(100)))
    })

    it("should calculate correct verification score", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "record-verification-check",
        [Cl.uint(1), Cl.bool(true), Cl.bool(true), Cl.bool(false), Cl.bool(true), Cl.bool(false), Cl.bool(true)],
        deployer,
      )
      expect(result.result).toEqual(Cl.ok(Cl.uint(70)))
    })

    it("should retrieve property verification score", () => {
      simnet.callPublicFn(
        "governance-v3",
        "record-verification-check",
        [Cl.uint(1), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true)],
        deployer,
      )

      const result = simnet.callReadOnlyFn("governance-v3", "get-property-verification-score", [Cl.uint(1)], deployer)

      expect(result.result.type).toBe("some")
      if (result.result.type === "some") {
        const totalScore = result.result.value.data["total-score"]
        expect(totalScore).toEqual(Cl.uint(100))
      }
    })

    it("should reject non-admin recording verification", () => {
      const result = simnet.callPublicFn(
        "governance-v3",
        "record-verification-check",
        [Cl.uint(1), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true), Cl.bool(true)],
        wallet3,
      )
      expect(result.result).toEqual(Cl.error(Cl.uint(5001)))
    })
  })

  describe("Read-Only Functions", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should return none for non-existent action", () => {
      const result = simnet.callReadOnlyFn("governance-v3", "get-action", [Cl.uint(999)], deployer)
      expect(result.result).toEqual(Cl.none())
    })

    it("should return admin info", () => {
      const result = simnet.callReadOnlyFn("governance-v3", "get-admin-info", [Cl.principal(deployer)], deployer)
      expect(result.result.type).toBe("some")
    })

    it("should return all admins", () => {
      const result = simnet.callReadOnlyFn("governance-v3", "get-all-admins", [], deployer)
      expect(result.result.type).toBe("list")
    })

    it("should check if action is executable", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      const result = simnet.callReadOnlyFn("governance-v3", "is-action-executable", [Cl.uint(1)], deployer)
      expect(result.result).toEqual(Cl.ok(Cl.bool(false)))
    })

    it("should return none for non-existent verification criteria", () => {
      const result = simnet.callReadOnlyFn("governance-v3", "get-verification-criteria", [Cl.uint(999)], deployer)
      expect(result.result).toEqual(Cl.none())
    })
  })

  describe("Complex Multi-Admin Scenarios", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "governance-v3",
        "initialize-admins",
        [
          Cl.principal(deployer),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.stringAscii("Admin 1"),
          Cl.stringAscii("Admin 2"),
          Cl.stringAscii("Admin 3"),
        ],
        deployer,
      )
    })

    it("should handle multiple concurrent proposals", () => {
      const proposal1 = simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("First action to update platform fee structure"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      const proposal2 = simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("whitelist-investor"),
          Cl.stringAscii("Second action to whitelist new investor for platform access"),
          Cl.stringAscii("investment-manager-v3"),
          Cl.some(Cl.principal(wallet4)),
          Cl.uint(0),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        wallet1,
      )

      expect(proposal1.result).toEqual(Cl.ok(Cl.uint(1)))
      expect(proposal2.result).toEqual(Cl.ok(Cl.uint(2)))

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)
      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(2)], wallet2)

      const action1Info = simnet.callReadOnlyFn("governance-v3", "get-action", [Cl.uint(1)], deployer)

      const action2Info = simnet.callReadOnlyFn("governance-v3", "get-action", [Cl.uint(2)], deployer)

      expect(action1Info.result.type).toBe("some")
      expect(action2Info.result.type).toBe("some")
    })

    it("should track multiple approvals correctly", () => {
      simnet.callPublicFn(
        "governance-v3",
        "propose-action",
        [
          Cl.stringAscii("update-platform-fee"),
          Cl.stringAscii("Update platform fee to 3% for better sustainability"),
          Cl.stringAscii("rental-distributor-v3"),
          Cl.none(),
          Cl.uint(300),
          Cl.uint(0),
          Cl.uint(0),
          Cl.none(),
        ],
        deployer,
      )

      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet1)
      simnet.callPublicFn("governance-v3", "approve-action", [Cl.uint(1)], wallet2)

      const actionInfo = simnet.callReadOnlyFn("governance-v3", "get-action", [Cl.uint(1)], deployer)

      if (actionInfo.result.type === "some") {
        const approvalCount = actionInfo.result.value.data["approval-count"]
        expect(approvalCount).toEqual(Cl.uint(3))
      }
    })
  })
})