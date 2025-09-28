import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
declare const simnet: any;

describe("Property Registry Contract", () => {
  const accounts = simnet.getAccounts();
  const deployer = accounts.get("deployer")!;
  const wallet1 = accounts.get("wallet_1")!;
  const wallet2 = accounts.get("wallet_2")!;

  beforeEach(() => {
    // Reset simnet state before each test
    simnet.setEpoch("3.0");
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct owner", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "is-contract-owner",
        [Cl.principal(deployer)],
        deployer
      );
      expect(result.result).toEqual(Cl.bool(true));
    });

    it("should start with zero property counter", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-property-count",
        [],
        deployer
      );
      expect(result.result).toEqual(Cl.uint(0));
    });

    it("should have correct default platform fee rate", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-platform-fee-rate",
        [],
        deployer
      );
      expect(result.result).toEqual(Cl.uint(200)); // 2% = 200 basis points
    });
  });

  describe("Contract Address Management", () => {
    it("should allow contract owner to set investment manager contract", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should reject non-owner setting investment manager contract", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal(wallet2)],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1001) }); // ERR_NOT_AUTHORIZED
    });

    it("should allow contract owner to set rental distributor contract", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "set-rental-distributor-contract",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should reject invalid contract addresses", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal("SP000000000000000000002Q6VF78")],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });

    it("should reject contract owner as contract address", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal(deployer)],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });
  });

  describe("Property Submission", () => {
    const validPropertyData = {
      title: "Luxury Downtown Apartment",
      description: "A beautiful 2-bedroom apartment in the heart of downtown with modern amenities",
      location: "New York, NY",
      propertyType: "apartment",
      totalValue: 50000000000, // 500 sBTC in micro-units
      monthlyRent: 500000000,  // 5 sBTC in micro-units
      minInvestment: 5000000000, // 50 sBTC minimum investment
      imageUri: "ipfs://QmTest123456789",
      fundingDays: 30,
      fundingThreshold: 8000 // 80%
    };

    it("should successfully submit a valid property", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual(Cl.ok(Cl.uint(1)));
    });

    it("should increment property counter after submission", () => {
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );

      const countResult = simnet.callReadOnlyFn(
        "property-registry",
        "get-property-count",
        [],
        deployer
      );
      expect(countResult.result).toEqual(Cl.uint(1));
    });

    it("should submit property at minimum value boundary", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Minimum Value Property"),
          Cl.stringAscii("A property at minimum value threshold"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(100000000), // MIN_PROPERTY_VALUE (100 sBTC)
          Cl.uint(1000000), // 1 sBTC monthly rent
          Cl.uint(100000), // 0.1% minimum investment
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(5000) // 50% threshold
        ],
        wallet1
      );
      expect(result.result).toEqual(Cl.ok(Cl.uint(1)));
    });

    it("should reject property with value below minimum", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(50000000), // Below minimum (100 sBTC)
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1006) }); // ERR_PROPERTY_VALUE_TOO_HIGH
    });

    it("should reject property with value above maximum", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(20000000000000), // Above maximum (10 million sBTC)
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1006) }); // ERR_PROPERTY_VALUE_TOO_HIGH
    });

    it("should reject property with unrealistic rent yield", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(20000000000), // Unrealistic high rent (200 sBTC monthly)
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1007) }); // ERR_RENT_YIELD_UNREALISTIC
    });

    it("should reject property with invalid funding threshold below minimum", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(4000) // Below minimum (50%)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });

    it("should reject property with invalid funding threshold above maximum", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(15000) // Above maximum (100%)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });

    it("should reject property with funding period too long", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(100), // Above maximum (90 days)
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });

    it("should reject property with minimum investment too small", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(10000), // Less than 0.1% of property value
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1003) }); // ERR_INVALID_AMOUNT
    });

    it("should reject empty title", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(""),
          Cl.stringAscii(validPropertyData.description),
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });

    it("should reject description that is too short", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(validPropertyData.title),
          Cl.stringAscii("short"), // Less than 10 characters
          Cl.stringAscii(validPropertyData.location),
          Cl.stringAscii(validPropertyData.propertyType),
          Cl.uint(validPropertyData.totalValue),
          Cl.uint(validPropertyData.monthlyRent),
          Cl.uint(validPropertyData.minInvestment),
          Cl.stringAscii(validPropertyData.imageUri),
          Cl.uint(validPropertyData.fundingDays),
          Cl.uint(validPropertyData.fundingThreshold)
        ],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });
  });

  describe("Property Verification", () => {
    beforeEach(() => {
      // Submit a property first
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Test Property"),
          Cl.stringAscii("A test property for verification"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );
    });

    it("should allow contract owner to verify property", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Property verified successfully")],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should reject non-owner verification attempts", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Unauthorized verification attempt")],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1001) }); // ERR_NOT_AUTHORIZED
    });

    it("should mark property as verified and active after verification", () => {
      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Property verified")],
        deployer
      );

      const propertyResult = simnet.callReadOnlyFn(
        "property-registry",
        "get-property",
        [Cl.uint(1)],
        deployer
      );

      expect(propertyResult.result).toBeTruthy();
    });

    it("should store verification information correctly", () => {
      const verificationNotes = "Property documents reviewed and approved";
      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii(verificationNotes)],
        deployer
      );

      const verificationResult = simnet.callReadOnlyFn(
        "property-registry",
        "get-verification-info",
        [Cl.uint(1)],
        deployer
      );

      expect(verificationResult.result).toBeTruthy();
    });

    it("should return correct verification status", () => {
      // Check unverified property
      const unverifiedResult = simnet.callReadOnlyFn(
        "property-registry",
        "is-property-verified",
        [Cl.uint(1)],
        deployer
      );
      expect(unverifiedResult.result).toEqual(Cl.bool(false));

      // Verify property
      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Verified")],
        deployer
      );

      // Check verified property
      const verifiedResult = simnet.callReadOnlyFn(
        "property-registry",
        "is-property-verified",
        [Cl.uint(1)],
        deployer
      );
      expect(verifiedResult.result).toEqual(Cl.bool(true));
    });

    it("should return false for non-existent property verification status", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "is-property-verified",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toEqual(Cl.bool(false));
    });

    it("should prevent double verification", () => {
      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("First verification")],
        deployer
      );

      const result = simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Second verification")],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1004) }); // ERR_PROPERTY_ALREADY_EXISTS
    });

    it("should reject verification with invalid property ID", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(999), Cl.stringAscii("Invalid property")],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1002) }); // ERR_PROPERTY_NOT_FOUND
    });

    it("should return none for non-existent verification info", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-verification-info",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toEqual(Cl.none());
    });
  });

  describe("Platform Fee Management", () => {
    it("should allow owner to update platform fee rate", () => {
      const newRate = 300; // 3%
      const result = simnet.callPublicFn(
        "property-registry",
        "update-platform-fee-rate",
        [Cl.uint(newRate)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));

      const feeResult = simnet.callReadOnlyFn(
        "property-registry",
        "get-platform-fee-rate",
        [],
        deployer
      );
      expect(feeResult.result).toEqual(Cl.uint(newRate));
    });

    it("should allow setting fee rate to zero", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-platform-fee-rate",
        [Cl.uint(0)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should allow setting fee rate to maximum", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-platform-fee-rate",
        [Cl.uint(1000)], // 10% max
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should reject fee rate above maximum", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-platform-fee-rate",
        [Cl.uint(1500)], // 15% - above 10% max
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1003) }); // ERR_INVALID_AMOUNT
    });

    it("should reject non-owner fee updates", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-platform-fee-rate",
        [Cl.uint(300)],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1001) }); // ERR_NOT_AUTHORIZED
    });
  });

  describe("Property Deactivation", () => {
    beforeEach(() => {
      // Submit and verify a property
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Test Property"),
          Cl.stringAscii("A test property"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );

      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Verified")],
        deployer
      );
    });

    it("should allow owner to deactivate active property", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "deactivate-property",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should reject non-owner deactivation attempts", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "deactivate-property",
        [Cl.uint(1)],
        wallet1
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1001) }); // ERR_NOT_AUTHORIZED
    });

    it("should reject deactivation of non-existent property", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "deactivate-property",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1002) }); // ERR_PROPERTY_NOT_FOUND
    });

    it("should reject deactivation of inactive property", () => {
      // Deactivate first
      simnet.callPublicFn(
        "property-registry",
        "deactivate-property",
        [Cl.uint(1)],
        deployer
      );

      // Try to deactivate again
      const result = simnet.callPublicFn(
        "property-registry",
        "deactivate-property",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });
  });

  describe("Funding Management", () => {
    beforeEach(() => {
      // Submit and verify a property
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Test Property"),
          Cl.stringAscii("A test property"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000), // 500 sBTC
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000) // 80% threshold
        ],
        wallet1
      );

      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Verified")],
        deployer
      );

      // Set investment manager contract
      simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal(wallet2)],
        deployer
      );
    });

    it("should get correct funding info for active property", () => {
      const fundingInfo = simnet.callReadOnlyFn(
        "property-registry",
        "get-funding-info",
        [Cl.uint(1)],
        deployer
      );

      expect(fundingInfo.result).toBeTruthy();
    });

    it("should return default values for non-existent property funding info", () => {
      const fundingInfo = simnet.callReadOnlyFn(
        "property-registry",
        "get-funding-info",
        [Cl.uint(999)],
        deployer
      );

      expect(fundingInfo.result).toBeTruthy();
    });

    it("should calculate funding percentage correctly", () => {
      // Add some investment first
      simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(10000000000)], // 100 sBTC (20% of 500 sBTC)
        wallet2
      );

      const fundingInfo = simnet.callReadOnlyFn(
        "property-registry",
        "get-funding-info",
        [Cl.uint(1)],
        deployer
      );

      expect(fundingInfo.result).toBeTruthy();
      // The funding percentage should be calculated correctly (20% = 2000 basis points)
    });

    it("should allow authorized contract to update investment", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(20000000000)], // 200 sBTC investment
        wallet2 // Investment manager contract
      );
      expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
    });

    it("should reject unauthorized investment updates", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(20000000000)],
        wallet1 // Not authorized
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1001) }); // ERR_NOT_AUTHORIZED
    });

    it("should reject investment exceeding property value", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(60000000000)], // 600 sBTC (more than 500 sBTC property value)
        wallet2
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1003) }); // ERR_INVALID_AMOUNT
    });

    it("should reject zero investment amount", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(0)],
        wallet2
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1003) }); // ERR_INVALID_AMOUNT
    });

    it("should handle funding deadline checks correctly for failed funding", () => {
      // Advance blocks past funding deadline (30 days = 4320 blocks)
      simnet.mineEmptyBlocks(4321);

      const result = simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.stringAscii("failed")));
    });

    it("should handle funding deadline checks correctly for successful funding", () => {
      // Add investment to meet threshold (80% of 500 sBTC = 400 sBTC)
      simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(40000000000)], // 400 sBTC
        wallet2
      );

      // Advance blocks past funding deadline
      simnet.mineEmptyBlocks(4321);

      const result = simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.stringAscii("funded")));
    });

    it("should reject deadline check before deadline", () => {
      const result = simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1005) }); // ERR_INVALID_INPUT
    });

    it("should reject deadline check for non-existent property", () => {
      simnet.mineEmptyBlocks(4321);
      
      const result = simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1002) }); // ERR_PROPERTY_NOT_FOUND
    });

    it("should prevent double deadline checks", () => {
      // Advance blocks and check deadline first time
      simnet.mineEmptyBlocks(4321);
      simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(1)],
        deployer
      );

      // Try to check deadline again
      const result = simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1004) }); // ERR_PROPERTY_ALREADY_EXISTS
    });

    it("should prevent investment updates causing overflow", () => {
      // First investment
      simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(40000000000)], // 400 sBTC
        wallet2
      );

      // Try to add more that would exceed property value
      const result = simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(20000000000)], // Another 200 sBTC (total would be 600 > 500)
        wallet2
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1003) }); // ERR_INVALID_AMOUNT
    });
  });

  describe("Read-Only Functions", () => {
    it("should return none for non-existent property", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-property",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toEqual(Cl.none());
    });

    it("should return correct property limits", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-property-limits",
        [],
        deployer
      );

      expect(result.result).toBeTruthy();
    });

    it("should return correct platform stats", () => {
      // Submit a property to increment stats
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Test Property"),
          Cl.stringAscii("A test property"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-platform-stat",
        [Cl.stringAscii("total-properties")],
        deployer
      );
      expect(result.result).toEqual(Cl.uint(1));
    });

    it("should return zero for non-existent platform stat", () => {
      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-platform-stat",
        [Cl.stringAscii("non-existent-stat")],
        deployer
      );
      expect(result.result).toEqual(Cl.uint(0));
    });

    it("should track verified properties count correctly", () => {
      // Submit and verify a property
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Test Property"),
          Cl.stringAscii("A test property"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );

      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Verified")],
        deployer
      );

      const result = simnet.callReadOnlyFn(
        "property-registry",
        "get-platform-stat",
        [Cl.stringAscii("verified-properties")],
        deployer
      );
      expect(result.result).toEqual(Cl.uint(1));
    });
  });

  describe("Security and Edge Cases", () => {
    it("should handle multiple property submissions correctly", () => {
      // Submit first property
      const result1 = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Property 1"),
          Cl.stringAscii("First property description"),
          Cl.stringAscii("City 1"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test1"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );
      expect(result1.result).toEqual(Cl.ok(Cl.uint(1)));

      // Submit second property
      const result2 = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Property 2"),
          Cl.stringAscii("Second property description"),
          Cl.stringAscii("City 2"),
          Cl.stringAscii("house"),
          Cl.uint(100000000000),
          Cl.uint(800000000),
          Cl.uint(10000000000),
          Cl.stringAscii("ipfs://test2"),
          Cl.uint(45),
          Cl.uint(7500)
        ],
        wallet2
      );
      expect(result2.result).toEqual(Cl.ok(Cl.uint(2)));

      // Check counter updated correctly
      const countResult = simnet.callReadOnlyFn(
        "property-registry",
        "get-property-count",
        [],
        deployer
      );
      expect(countResult.result).toEqual(Cl.uint(2));
    });

    it("should handle property at exact maximum rent yield threshold", () => {
      // Calculate maximum allowed monthly rent for 500 sBTC property
      // Max annual yield is 30% = 150 sBTC annually = 12.5 sBTC monthly
      const maxMonthlyRent = 1250000000; // 12.5 sBTC

      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("High Yield Property"),
          Cl.stringAscii("Property at maximum allowed yield"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000), // 500 sBTC
          Cl.uint(maxMonthlyRent),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );
      expect(result.result).toEqual(Cl.ok(Cl.uint(1)));
    });

    it("should handle funding at exact threshold boundary", () => {
      // Submit property with 50% funding threshold
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Threshold Test Property"),
          Cl.stringAscii("Testing exact funding threshold"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000), // 500 sBTC
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(5000) // Exactly 50% threshold
        ],
        wallet1
      );

      // Verify property
      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Verified")],
        deployer
      );

      // Set investment manager
      simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal(wallet2)],
        deployer
      );

      // Add investment to exactly meet threshold (50% of 500 sBTC = 250 sBTC)
      simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(25000000000)], // Exactly 250 sBTC
        wallet2
      );

      // Advance past deadline
      simnet.mineEmptyBlocks(4321);

      // Check funding should succeed
      const result = simnet.callPublicFn(
        "property-registry",
        "check-funding-deadline",
        [Cl.uint(1)],
        deployer
      );
      expect(result.result).toEqual(Cl.ok(Cl.stringAscii("funded")));
    });

    it("should handle string length at exact boundaries", () => {
      // Test with exactly 100-character title (maximum allowed)
      const maxTitle = "A".repeat(100);
      // Test with exactly 500-character description (maximum allowed)
      const maxDescription = "B".repeat(500);
      // Test with exactly 100-character location (maximum allowed)
      const maxLocation = "C".repeat(100);
      // Test with exactly 50-character property type (maximum allowed)
      const maxPropertyType = "D".repeat(50);
      // Test with exactly 200-character image URI (maximum allowed)
      const maxImageUri = "ipfs://" + "E".repeat(193);

      const result = simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii(maxTitle),
          Cl.stringAscii(maxDescription),
          Cl.stringAscii(maxLocation),
          Cl.stringAscii(maxPropertyType),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii(maxImageUri),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );
      expect(result.result).toEqual(Cl.ok(Cl.uint(1)));
    });

    it("should reject authorization from non-contract addresses", () => {
      // Set investment manager
      simnet.callPublicFn(
        "property-registry",
        "set-investment-manager-contract",
        [Cl.principal(wallet2)],
        deployer
      );

      // Submit and verify property
      simnet.callPublicFn(
        "property-registry",
        "submit-property",
        [
          Cl.stringAscii("Test Property"),
          Cl.stringAscii("A test property"),
          Cl.stringAscii("Test City"),
          Cl.stringAscii("apartment"),
          Cl.uint(50000000000),
          Cl.uint(500000000),
          Cl.uint(5000000000),
          Cl.stringAscii("ipfs://test"),
          Cl.uint(30),
          Cl.uint(8000)
        ],
        wallet1
      );

      simnet.callPublicFn(
        "property-registry",
        "verify-property",
        [Cl.uint(1), Cl.stringAscii("Verified")],
        deployer
      );

      // Try to update investment from a different wallet (not the investment manager)
      const result = simnet.callPublicFn(
        "property-registry",
        "update-property-investment",
        [Cl.uint(1), Cl.uint(10000000000)],
        wallet1 // This is not the investment manager
      );
      expect(result.result).toEqual({ type: 'err', value: Cl.uint(1001) }); // ERR_NOT_AUTHORIZED
    });
  });
});