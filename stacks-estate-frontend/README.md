# sBTC Property Investment Platform

A decentralized real estate investment platform built on Stacks blockchain that enables fractional property ownership through sBTC (synthetic Bitcoin) investments with multi-signature governance and transparent administration.

## Overview

This platform consists of five interconnected smart contracts that facilitate:
- Property listing and verification with governance oversight
- Fractional investment tracking with centralized data storage
- Automated rental income distribution
- Multi-signature governance with timelocks
- Transparent administrative processes

## Architecture

### Contract Structure

The platform is built using five core smart contracts working together:

1. **Data Store** (`data-store-v3.clar`)
   - Central data repository for all investment data
   - Stores user investments, property totals, and portfolio information
   - Provides read access to all contracts, write access to authorized contracts only
   - Ensures data consistency across the platform

2. **Governance** (`governance-v3.clar`)
   - Multi-signature admin council (minimum 3 admins)
   - Timelock mechanisms (10 days standard, 30 days critical)
   - Transparent proposal and approval system
   - Property verification criteria and scoring
   - Emergency powers with strict limits and cooldowns

3. **Property Registry** (`property-registry-v3.clar`)
   - Property listing and metadata management
   - Verification and ownership tracking
   - Funding deadline and threshold management
   - Governance proposal system for property changes
   - Secondary market for share trading

4. **Investment Manager** (`investment-manager-v3.clar`)
   - Investment tracking and ownership calculations
   - User portfolio management
   - Refund mechanisms for failed properties
   - Secondary market purchase execution
   - Voting power calculations

5. **Rental Distributor** (`rental-distributor-v3.clar`)
   - Monthly rental income collection
   - Proportional distribution to investors
   - Earnings claim management
   - Platform fee collection

## Deployed Contract Addresses
- ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.rental-distributor-v3
- ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.investment-manager-v3
- ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.property-registry-v3
- ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.governance-v3
- ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.data-store-v3

## Features

### Governance System

#### Multi-Signature Administration
- **Admin Council**: Minimum 3 administrators required
- **Approval Requirements**: 2 out of 3 admins must approve actions
- **Timelocks**: 
  - Standard actions: 10 days (1,440 blocks)
  - Critical actions: 30 days (4,320 blocks)
- **Action Expiry**: 60 days (8,640 blocks)

#### Verification System
- **Property Verification Criteria**:
  - Title verification (20 points)
  - Appraisal completion (20 points)
  - Insurance active (15 points)
  - Rental history checked (15 points)
  - Owner KYC completed (15 points)
  - Legal review passed (15 points)
- **Minimum Score**: 85 points required for verification
- **Multi-Admin Approval**: Verification requires governance action execution

#### Emergency Powers
- **Cooldown Period**: 10 days between emergency declarations
- **Amount Limits**: Maximum 100 sBTC per emergency withdrawal
- **Transparency**: All emergency actions logged on-chain
- **Tracking**: Total emergency withdrawals tracked

### Property Management

#### Listing Requirements
- Property value: 100 - 10,000,000 sBTC
- Realistic rent yield: 1.5% - 2.5% annual
- Minimum investment: Configurable per property
- Funding period: Up to 90 days
- Funding threshold: 50% - 100% of property value

#### Verification Process
1. Property owner submits listing
2. Governance council reviews documentation
3. Verification criteria scored (minimum 85/100)
4. Multi-sig approval required
5. Property activated for investments

### Investment System

#### Investment Features
- **Fractional Ownership**: Invest any amount above minimum
- **Real-time Tracking**: Ownership percentages calculated automatically
- **Portfolio Management**: Track investments across multiple properties
- **Investment Limits**: 
  - Maximum per user: 100,000,000 sBTC
  - Maximum properties per user: 100
  - Maximum investors per property: 100

#### Secondary Market
- **Share Listings**: Investors can list shares for sale
- **Holding Period**: 10 days (1,440 blocks) minimum before listing
- **Price Discovery**: Market-driven pricing
- **Instant Settlement**: Automated transfer on purchase

### Income Distribution

#### Rental Income Flow
1. Property owner deposits monthly rent
2. Platform fees deducted (configurable, max 10%)
3. Expenses deducted (max 50% of rent)
4. Net income distributed proportionally
5. Investors claim earnings individually

#### Claiming System
- **Minimum Claim**: 0.001 sBTC
- **Withdrawal Cooldown**: 1 day (144 blocks)
- **Batch Claims**: Claim multiple periods at once
- **Tax Reporting**: Comprehensive event logs for earnings

## Technical Specifications

### Token Standard
- Uses sBTC (synthetic Bitcoin) as the investment currency
- Contract address: `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`

### Security Features

#### Input Validation
- All monetary amounts validated for reasonable bounds
- String inputs length-checked
- Property IDs validated against registry
- Date values range-checked
- Principal addresses validated

#### Access Control
- Contract owner privileges clearly defined
- Inter-contract communication restricted to authorized addresses
- User-specific functions validate caller permissions
- Governance actions require multi-sig approval

#### Financial Safety
- Safe arithmetic operations with overflow protection
- Realistic yield validation (max 30% annual)
- Transfer operations include error handling
- Emergency withdrawal mechanism with strict limits
- Balance checks before all transfers

#### Governance Security
- Timelock delays prevent hasty decisions
- Action expiry prevents stale proposals
- Approval tracking prevents double-voting
- Emergency cooldowns prevent abuse

### Limits and Constraints

#### Property Limits
- Minimum property value: 100 sBTC
- Maximum property value: 10,000,000 sBTC
- Maximum annual yield: 30%
- Default funding period: 10 days (1,440 blocks)
- Minimum funding threshold: 50%

#### Investment Limits
- Minimum investment: 1 sBTC (configurable per property)
- Maximum investment per user: 100,000,000 sBTC
- Maximum properties per user: 100
- Maximum investors per property: 100

#### Governance Limits
- Minimum admins: 3
- Required approvals: 2 of 3
- Standard timelock: 10 days
- Critical timelock: 30 days
- Action expiry: 60 days
- Emergency cooldown: 10 days

## Contract Functions

### Data Store (data-store-v3.clar)

#### Read Functions
- `get-user-investment(property-id, investor)` - Get user's investment in property
- `get-property-investment-totals(property-id)` - Get property investment totals
- `get-user-portfolio(investor)` - Get user's complete portfolio

#### Write Functions (Authorized Contracts Only)
- `update-user-investment(property-id, investor, amount, date)` - Update user investment
- `update-property-totals(property-id, total, count)` - Update property totals
- `update-user-portfolio(investor, total, count, earnings)` - Update user portfolio

### Governance (governance-v3.clar)

#### Initialization
- `initialize-admins(admin1, admin2, admin3, name1, name2, name3)` - Set up admin council

#### Admin Management
- `is-admin(user)` - Check if user is admin
- `get-admin-info(admin)` - Get admin details
- `get-all-admins()` - List all admins

#### Action Management
- `propose-action(...)` - Create new governance action
- `approve-action(action-id)` - Approve pending action
- `execute-action(action-id)` - Execute approved action
- `get-action(action-id)` - Get action details
- `is-action-executable(action-id)` - Check if action can be executed

#### Verification
- `set-verification-criteria(...)` - Define verification requirements
- `record-verification-check(...)` - Record property verification
- `get-property-verification-score(property-id)` - Get verification score

#### Emergency Functions
- `declare-emergency(type, reason, max-amount)` - Declare emergency
- `record-emergency-withdrawal(amount)` - Track emergency withdrawal
- `get-emergency-stats()` - Get emergency status
- `can-trigger-emergency()` - Check if emergency can be triggered

### Property Registry (property-registry-v3.clar)

#### Admin Functions
- `pause-contract()` - Pause contract operations
- `unpause-contract()` - Resume contract operations
- `execute-governance-action(action-id)` - Execute governance decision
- `whitelist-investor(investor)` - Add investor to whitelist
- `blacklist-investor(investor)` - Add investor to blacklist
- `update-platform-fee-rate(new-rate)` - Update platform fees

#### User Functions
- `submit-property(...)` - Submit property for listing
- `check-funding-deadline(property-id)` - Check and update funding status
- `release-funds-to-owner(property-id)` - Release funds after successful funding
- `update-property-rent(property-id, new-rent)` - Update monthly rent

#### Governance Functions
- `create-governance-proposal(...)` - Create property governance proposal
- `record-vote(proposal-id, voter, vote-for, voting-power)` - Record vote
- `execute-proposal(proposal-id)` - Execute passed proposal

#### Secondary Market
- `list-shares-for-sale(property-id, shares, price)` - List shares for sale
- `cancel-share-listing(property-id)` - Cancel share listing
- `update-share-listing-price(property-id, new-price)` - Update listing price
- `update-listing-after-purchase(property-id, seller, shares)` - Update after purchase

#### Liquidation
- `claim-liquidation-proceeds(property-id)` - Claim liquidation proceeds

#### Read-Only Functions
- `get-property(property-id)` - Get property details
- `get-funding-info(property-id)` - Get funding status and deadline
- `is-whitelisted(investor)` - Check whitelist status
- `is-blacklisted(investor)` - Check blacklist status
- `get-proposal(proposal-id)` - Get proposal details
- `get-share-listing(property-id, seller)` - Get share listing details
- `can-execute-proposal(proposal-id)` - Check if proposal can be executed

### Investment Manager (investment-manager-v3.clar)

#### User Functions
- `invest-in-property(property-id, sbtc-amount)` - Invest sBTC in property
- `claim-refund-for-failed-property(property-id)` - Claim refund for failed funding
- `create-share-listing(property-id, shares, price)` - Create share listing
- `purchase-shares(property-id, seller, shares, max-price)` - Purchase shares
- `cast-vote-on-proposal(proposal-id, property-id, vote-for)` - Vote on proposal

#### Admin Functions
- `pause-contract()` - Pause contract
- `unpause-contract()` - Resume contract
- `emergency-withdraw(recipient, amount)` - Emergency withdrawal
- `update-user-earnings(investor, property-id, earnings)` - Update earnings

#### Read-Only Functions
- `get-user-investment(property-id, investor)` - Get user's investment details
- `get-user-ownership-percentage(property-id, investor)` - Get ownership percentage
- `get-property-investment-totals(property-id)` - Get property investment totals
- `get-user-portfolio(investor)` - Get user's complete portfolio
- `has-user-invested(property-id, investor)` - Check if user has invested
- `get-refund-claim(property-id, investor)` - Get refund claim status
- `get-available-shares(property-id, investor)` - Get available shares for listing
- `can-list-shares(property-id, investor)` - Check if can list shares

### Rental Distributor (rental-distributor-v3.clar)

#### Property Owner Functions
- `deposit-rental-income(property-id, month, year, rent, expenses)` - Deposit monthly rent
- `deposit-rental-income-override(...)` - Admin override for rent deposit
- `distribute-rental-income(property-id, month, year)` - Mark income for distribution

#### Investor Functions
- `claim-rental-earnings(property-id, month, year)` - Claim earnings for specific period
- `batch-claim-earnings(property-id, periods)` - Claim earnings for multiple periods

#### Admin Functions
- `pause-contract()` - Pause contract
- `unpause-contract()` - Resume contract
- `set-platform-wallet(new-wallet)` - Update platform wallet
- `emergency-withdraw-platform-fees(amount)` - Emergency fee withdrawal

#### Read-Only Functions
- `get-rental-payment-info(property-id, month, year)` - Get rental payment details
- `get-period-claim-info(property-id, month, year, investor)` - Get claim info
- `get-user-earnings(investor, property-id)` - Get user's earning history
- `get-claimable-earnings(property-id, month, year, investor)` - Check claimable amount
- `calculate-user-rental-share(property-id, investor, total-rent)` - Calculate share
- `get-total-platform-fees-collected()` - Get total fees collected

## Usage Workflow

### For Platform Administrators

#### 1. Initialize Governance
```clarity
(contract-call? .governance-v3 initialize-admins
  admin1-principal admin2-principal admin3-principal
  "Admin One" "Admin Two" "Admin Three")