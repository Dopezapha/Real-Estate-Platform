# sBTC Property Investment Platform

A decentralized real estate investment platform built on Stacks blockchain that enables fractional property ownership through sBTC (synthetic Bitcoin) investments.

## Overview

This platform consists of three interconnected smart contracts that facilitate:
- Property listing and verification
- Fractional investment tracking
- Automated rental income distribution

## Architecture

### Contract Structure

The platform is built using three core smart contracts:

1. **Property Registry** (`property-registry.clar`)
   - Property listing and metadata management
   - Verification and ownership tracking
   - Funding deadline and threshold management

2. **Investment Manager** (`investment-manager.clar`)
   - Investment tracking and ownership calculations
   - User portfolio management
   - Refund mechanisms for failed properties

3. **Rental Distributor** (`rental-distributor.clar`)
   - Monthly rental income collection
   - Proportional distribution to investors
   - Earnings claim management

## Features

### Property Management
- Submit property listings with comprehensive metadata
- Administrative verification system
- Funding deadlines and minimum thresholds
- Automatic funding failure handling

### Investment System
- Fractional property ownership through sBTC
- Minimum investment requirements
- Real-time ownership percentage calculations
- Investment history tracking

### Income Distribution
- Monthly rental income deposits by property owners
- Proportional distribution based on ownership stakes
- Individual claim mechanism for investors
- Batch claiming for multiple periods

## Technical Specifications

### Token Standard
- Uses sBTC (synthetic Bitcoin) as the investment currency
- Contract address: `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`

### Security Features
- Input validation for all user inputs
- Overflow protection on financial calculations
- Access control for administrative functions
- Realistic yield validation (max 30% annual)

### Limits and Constraints
- Minimum property value: 100 sBTC
- Maximum property value: 10,000,000 sBTC
- Maximum annual yield: 30%
- Default funding period: 10 days (1,440 blocks)
- Minimum funding threshold: 50%

## Contract Functions

### Property Registry

#### Admin Functions
- `set-investment-manager-contract(contract-address)` - Set authorized investment manager
- `set-rental-distributor-contract(contract-address)` - Set authorized rental distributor
- `verify-property(property-id, verification-notes)` - Verify submitted property
- `deactivate-property(property-id)` - Deactivate property
- `update-platform-fee-rate(new-rate)` - Update platform fees

#### User Functions
- `submit-property(...)` - Submit property for listing
- `check-funding-deadline(property-id)` - Check and update funding status

#### Read-Only Functions
- `get-property(property-id)` - Get property details
- `get-funding-info(property-id)` - Get funding status and deadline
- `is-property-verified(property-id)` - Check verification status
- `get-verification-info(property-id)` - Get verification details

### Investment Manager

#### User Functions
- `invest-in-property(property-id, sbtc-amount)` - Invest sBTC in property
- `claim-refund-for-failed-property(property-id)` - Claim refund for failed funding

#### Admin Functions
- `set-rental-distributor-contract(contract-address)` - Set authorized distributor
- `emergency-withdraw(recipient, amount)` - Emergency withdrawal
- `update-user-earnings(investor, property-id, earnings-amount)` - Update earnings

#### Read-Only Functions
- `get-user-investment(property-id, investor)` - Get user's investment details
- `get-user-ownership-percentage(property-id, investor)` - Get ownership percentage
- `get-property-investment-totals(property-id)` - Get property investment totals
- `get-user-portfolio(investor)` - Get user's complete portfolio
- `calculate-monthly-income(property-id, investor)` - Calculate potential monthly income

### Rental Distributor

#### Property Owner Functions
- `deposit-rental-income(property-id, month, year, rent-amount-sbtc)` - Deposit monthly rent
- `distribute-rental-income(property-id, month, year)` - Mark income for distribution

#### Investor Functions
- `claim-rental-earnings(property-id, month, year)` - Claim earnings for specific period
- `batch-claim-earnings(property-id, periods)` - Claim earnings for multiple periods

#### Read-Only Functions
- `get-rental-payment-info(property-id, month, year)` - Get rental payment details
- `get-user-earnings(investor, property-id)` - Get user's earning history
- `get-claimable-earnings(property-id, month, year, investor)` - Check claimable amount
- `calculate-user-rental-share(property-id, investor, total-rent-sbtc)` - Calculate share

## Usage Workflow

### For Property Owners

1. **Submit Property**
   ```clarity
   (contract-call? .property-registry submit-property
     title description location property-type
     total-value-sbtc monthly-rent-sbtc min-investment-sbtc
     image-uri funding-days funding-threshold)
   ```

2. **Wait for Verification**
   - Admin reviews and verifies the property
   - Property becomes active for investments

3. **Deposit Monthly Rent**
   ```clarity
   (contract-call? .rental-distributor deposit-rental-income
     property-id month year rent-amount-sbtc)
   ```

4. **Distribute Income**
   ```clarity
   (contract-call? .rental-distributor distribute-rental-income
     property-id month year)
   ```

### For Investors

1. **Invest in Property**
   ```clarity
   (contract-call? .investment-manager invest-in-property
     property-id sbtc-amount)
   ```

2. **Monitor Investment**
   ```clarity
   (contract-call? .investment-manager get-user-ownership-percentage
     property-id investor)
   ```

3. **Claim Rental Earnings**
   ```clarity
   (contract-call? .rental-distributor claim-rental-earnings
     property-id month year)
   ```

## Error Codes

### Property Registry (1xxx)
- `1001` - Not authorized
- `1002` - Property not found
- `1003` - Invalid amount
- `1004` - Property already exists
- `1005` - Invalid input
- `1006` - Property value too high
- `1007` - Rent yield unrealistic

### Investment Manager (2xxx)
- `2001` - Not authorized
- `2002` - Property not found
- `2003` - Insufficient amount
- `2004` - Property not active
- `2005` - Transfer failed
- `2006` - Investment exceeds limit
- `2007` - Invalid input
- `2008` - Funding deadline passed
- `2009` - Funding failed

### Rental Distributor (3xxx)
- `3001` - Not authorized
- `3002` - Property not found
- `3003` - Insufficient funds
- `3004` - Already distributed
- `3005` - Not distributed
- `3006` - No investment
- `3007` - Already claimed
- `3008` - Invalid input

## Events

The contracts emit comprehensive events for off-chain tracking:

### Property Events
- `property-submitted` - New property submitted
- `property-verified` - Property verified by admin
- `funding-successful` - Property fully funded
- `funding-failed` - Property funding failed

### Investment Events
- `investment-made` - New investment recorded
- `refund-claimed` - Refund claimed for failed property

### Rental Events
- `rental-income-deposited` - Monthly rent deposited
- `rental-income-distributed` - Income ready for claims
- `rental-earnings-claimed` - Earnings claimed by investor

## Security Considerations

### Input Validation
- All monetary amounts are validated for reasonable bounds
- String inputs are length-checked
- Property IDs are validated against registry
- Date values are range-checked

### Access Control
- Contract owner privileges are clearly defined
- Inter-contract communication is restricted to authorized addresses
- User-specific functions validate caller permissions

### Financial Safety
- Overflow protection on all calculations
- Realistic yield validation prevents unreasonable returns
- Transfer operations include error handling
- Emergency withdrawal mechanism for admin recovery

## Development and Testing

### Prerequisites
- Stacks CLI
- Clarinet testing framework
- sBTC token contract deployed

### Deployment Sequence
1. Deploy Property Registry contract
2. Deploy Investment Manager contract
3. Deploy Rental Distributor contract
4. Configure contract addresses in each contract
5. Set initial platform parameters

### Configuration
After deployment, configure contract relationships:

```clarity
;; In property-registry
(contract-call? .property-registry set-investment-manager-contract .investment-manager)
(contract-call? .property-registry set-rental-distributor-contract .rental-distributor)

;; In investment-manager
(contract-call? .investment-manager set-rental-distributor-contract .rental-distributor)
```

## Limitations and Considerations

### Current Limitations
- Single token support (sBTC only)
- Manual property verification process
- Fixed funding period structure
- No automated rent collection