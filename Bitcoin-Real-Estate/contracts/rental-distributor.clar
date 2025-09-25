;; Rental Income Distributor Smart Contract
;; File: contracts/rental-distributor.clar
;; Manages monthly rental income distribution to property investors

;; Constants
(define-constant ERR_NOT_AUTHORIZED (err u3001))
(define-constant ERR_PROPERTY_NOT_FOUND (err u3002))
(define-constant ERR_INSUFFICIENT_FUNDS (err u3003))
(define-constant ERR_ALREADY_DISTRIBUTED (err u3004))
(define-constant ERR_NOT_DISTRIBUTED (err u3005))
(define-constant ERR_NO_INVESTMENT (err u3006))
(define-constant ERR_ALREADY_CLAIMED (err u3007))
(define-constant ERR_INVALID_INPUT (err u3008))

;; sBTC Contract Address
(define-constant SBTC_CONTRACT 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token)

;; Rental payment tracking by property, month, year
(define-map rental-payments
  { property-id: uint, month: uint, year: uint }
  {
    total-rent-sbtc: uint,      ;; Total rent deposited (micro-units)
    distributed: bool,          ;; Whether distribution has been triggered
    distribution-date: uint,    ;; Block height when distributed
    deposited-by: principal,    ;; Who deposited the rent
    deposit-date: uint          ;; Block height when deposited
  }
)

;; Track individual user earnings per property per period
(define-map user-rental-earnings
  { investor: principal, property-id: uint }
  { 
    total-earned-sbtc: uint,    ;; Total earned across all periods
    last-claim-period: uint,    ;; Last period claimed (YYYYMM format)
    claim-count: uint           ;; Number of times user has claimed
  }
)

;; Track claims per user per period
(define-map period-claims
  { property-id: uint, month: uint, year: uint, investor: principal }
  {
    amount-earned: uint,        ;; Amount earned this period
    claimed: bool,              ;; Whether user has claimed
    claim-date: uint            ;; Block height when claimed
  }
)

;; Platform rental statistics
(define-map rental-stats
  { property-id: uint }
  {
    total-rent-collected: uint, ;; Total rent ever collected for this property
    total-distributions: uint,  ;; Number of rental distributions
    last-distribution: uint     ;; Last distribution date
  }
)

;; Temporary property storage for batch operations
(define-data-var temp-property-id uint u0)

;; PRIVATE FUNCTIONS

(define-private (is-valid-property-id (property-id uint))
  ;; Check if property exists in registry
  (is-some (contract-call? .property-registry get-property property-id))
)

(define-private (is-valid-month (month uint))
  ;; Validate month is between 1-12
  (and (>= month u1) (<= month u12))
)

(define-private (is-valid-year (year uint))
  ;; Validate year is reasonable (2024 onwards)
  (and (>= year u2024) (<= year u2100))
)

(define-private (is-valid-amount (amount uint))
  ;; Validate amount is within reasonable bounds
  (and (> amount u0) (< amount u1000000000000)) ;; Max 1M sBTC
)

(define-private (is-valid-principal (user principal))
  ;; Basic principal validation
  (not (is-eq user 'SP000000000000000000002Q6VF78))
)

;; READ-ONLY FUNCTIONS

(define-read-only (get-rental-payment-info (property-id uint) (month uint) (year uint))
  (map-get? rental-payments { property-id: property-id, month: month, year: year })
)

(define-read-only (get-user-earnings (investor principal) (property-id uint))
  (default-to 
    { total-earned-sbtc: u0, last-claim-period: u0, claim-count: u0 }
    (map-get? user-rental-earnings { investor: investor, property-id: property-id })
  )
)

(define-read-only (get-period-claim-info (property-id uint) (month uint) (year uint) (investor principal))
  (map-get? period-claims { property-id: property-id, month: month, year: year, investor: investor })
)

(define-read-only (calculate-user-rental-share (property-id uint) (investor principal) (total-rent-sbtc uint))
  (let ((ownership-percentage (contract-call? .investment-manager get-user-ownership-percentage property-id investor)))
    (if (> ownership-percentage u0)
      (/ (* total-rent-sbtc ownership-percentage) u10000) ;; Convert from basis points
      u0
    )
  )
)

(define-read-only (get-claimable-earnings (property-id uint) (month uint) (year uint) (investor principal))
  (let ((rental-info (get-rental-payment-info property-id month year))
        (claim-info (get-period-claim-info property-id month year investor)))
    (match rental-info
      payment-data 
        (if (and (get distributed payment-data) (is-none claim-info))
          (calculate-user-rental-share property-id investor (get total-rent-sbtc payment-data))
          u0)
      u0
    )
  )
)

(define-read-only (get-rental-stats (property-id uint))
  (default-to
    { total-rent-collected: u0, total-distributions: u0, last-distribution: u0 }
    (map-get? rental-stats { property-id: property-id })
  )
)

;; PUBLIC FUNCTIONS

;; Deposit monthly rental income (property owner only)
(define-public (deposit-rental-income 
    (property-id uint) 
    (month uint) 
    (year uint) 
    (rent-amount-sbtc uint))
  (let ((property (unwrap! (contract-call? .property-registry get-property property-id) ERR_PROPERTY_NOT_FOUND))
        (period-key { property-id: property-id, month: month, year: year })
        (current-stats (get-rental-stats property-id)))
    (begin
      ;; Input validations
      (asserts! (is-eq tx-sender (get owner property)) ERR_NOT_AUTHORIZED)
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (is-valid-month month) ERR_INVALID_INPUT)
      (asserts! (is-valid-year year) ERR_INVALID_INPUT)
      (asserts! (is-valid-amount rent-amount-sbtc) ERR_INVALID_INPUT)
      
      ;; Check if already deposited for this period
      (asserts! (is-none (map-get? rental-payments period-key)) ERR_ALREADY_DISTRIBUTED)
      
      ;; Transfer sBTC from property owner to contract
      (try! (contract-call? 
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token 
        transfer 
        rent-amount-sbtc 
        tx-sender 
        (as-contract tx-sender) 
        (some 0x52656e74616c)))  ;; "Rental" in hex
      
      ;; Record rental payment
      (map-set rental-payments period-key
        {
          total-rent-sbtc: rent-amount-sbtc,
          distributed: false,
          distribution-date: u0,
          deposited-by: tx-sender,
          deposit-date: stacks-block-height
        })
      
      ;; Update rental stats
      (map-set rental-stats
        { property-id: property-id }
        {
          total-rent-collected: (+ (get total-rent-collected current-stats) rent-amount-sbtc),
          total-distributions: (get total-distributions current-stats),
          last-distribution: (get last-distribution current-stats)
        })
      
      ;; Emit event
      (print { 
        event: "rental-income-deposited", 
        property-id: property-id, 
        month: month, 
        year: year, 
        amount: rent-amount-sbtc,
        deposited-by: tx-sender
      })
      
      (ok true)
    )
  )
)

;; Mark rental income as ready for distribution (property owner or admin)
(define-public (distribute-rental-income (property-id uint) (month uint) (year uint))
  (let ((period-key { property-id: property-id, month: month, year: year })
        (rental-info (unwrap! (map-get? rental-payments period-key) ERR_PROPERTY_NOT_FOUND))
        (property (unwrap! (contract-call? .property-registry get-property property-id) ERR_PROPERTY_NOT_FOUND))
        (current-stats (get-rental-stats property-id)))
    (begin
      ;; Input validations
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (is-valid-month month) ERR_INVALID_INPUT)
      (asserts! (is-valid-year year) ERR_INVALID_INPUT)
      
      ;; Check authorization
      (asserts! (or (is-eq tx-sender (get owner property)) 
                    (contract-call? .property-registry is-contract-owner tx-sender)) 
                ERR_NOT_AUTHORIZED)
      
      ;; Check if not already distributed
      (asserts! (not (get distributed rental-info)) ERR_ALREADY_DISTRIBUTED)
      
      ;; Mark as distributed
      (map-set rental-payments period-key
        (merge rental-info { 
          distributed: true, 
          distribution-date: stacks-block-height 
        }))
      
      ;; Update rental stats
      (map-set rental-stats
        { property-id: property-id }
        (merge current-stats {
          total-distributions: (+ (get total-distributions current-stats) u1),
          last-distribution: stacks-block-height
        }))
      
      ;; Emit event
      (print { 
        event: "rental-income-distributed", 
        property-id: property-id, 
        month: month, 
        year: year,
        total-amount: (get total-rent-sbtc rental-info)
      })
      
      (ok true)
    )
  )
)

;; Claim individual rental earnings for a specific period
(define-public (claim-rental-earnings (property-id uint) (month uint) (year uint))
  (let ((period-key { property-id: property-id, month: month, year: year })
        (rental-info (unwrap! (map-get? rental-payments period-key) ERR_PROPERTY_NOT_FOUND))
        (claim-key { property-id: property-id, month: month, year: year, investor: tx-sender })
        (user-share (calculate-user-rental-share property-id tx-sender (get total-rent-sbtc rental-info)))
        (current-earnings (get-user-earnings tx-sender property-id))
        (period-value (+ (* year u100) month))) ;; YYYYMM format
    (begin
      ;; Input validations
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (is-valid-month month) ERR_INVALID_INPUT)
      (asserts! (is-valid-year year) ERR_INVALID_INPUT)
      
      ;; Business logic validations
      (asserts! (get distributed rental-info) ERR_NOT_DISTRIBUTED)
      (asserts! (is-none (map-get? period-claims claim-key)) ERR_ALREADY_CLAIMED)
      (asserts! (> user-share u0) ERR_NO_INVESTMENT)
      
      ;; Transfer sBTC earnings to user
      (try! (as-contract (contract-call? 
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token 
        transfer 
        user-share 
        (as-contract tx-sender) 
        tx-sender 
        (some 0x436c61696d))))  ;; "Claim" in hex
      
      ;; Record the claim
      (map-set period-claims claim-key
        {
          amount-earned: user-share,
          claimed: true,
          claim-date: stacks-block-height
        })
      
      ;; Update user's total earnings
      (map-set user-rental-earnings
        { investor: tx-sender, property-id: property-id }
        {
          total-earned-sbtc: (+ (get total-earned-sbtc current-earnings) user-share),
          last-claim-period: period-value,
          claim-count: (+ (get claim-count current-earnings) u1)
        })
      
      ;; Update investment manager with earnings info
      (unwrap! (contract-call? .investment-manager update-user-earnings tx-sender property-id user-share) ERR_NOT_AUTHORIZED)
      
      ;; Emit event
      (print { 
        event: "rental-earnings-claimed", 
        property-id: property-id, 
        month: month,
        year: year,
        investor: tx-sender, 
        amount: user-share,
        ownership-percentage: (contract-call? .investment-manager get-user-ownership-percentage property-id tx-sender)
      })
      
      (ok user-share)
    )
  )
)

;; Batch claim earnings for multiple periods (convenience function)
(define-public (batch-claim-earnings (property-id uint) (periods (list 12 { month: uint, year: uint })))
  (begin
    ;; Input validation
    (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
    
    ;; Store property-id for batch operations
    (var-set temp-property-id property-id)
    (let ((results (map claim-single-period periods)))
      (ok (len (filter is-ok-value results)))
    )
  )
)

;; Helper function for batch claiming
(define-private (claim-single-period (period { month: uint, year: uint }))
  (claim-rental-earnings 
    (var-get temp-property-id)
    (get month period) 
    (get year period))
)

;; Helper to check if result is ok
(define-private (is-ok-value (result (response uint uint)))
  (is-ok result)
)

;; Get contract's sBTC balance (for monitoring)
(define-read-only (get-contract-sbtc-balance)
  (unwrap-panic (contract-call? 
    'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token 
    get-balance 
    (as-contract tx-sender)))
)