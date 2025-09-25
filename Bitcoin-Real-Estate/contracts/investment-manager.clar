;; Investment Manager Smart Contract - Complete Version with Funding Deadlines
;; File: contracts/investment-manager.clar
;; Handles sBTC investments and ownership tracking

;; Constants
(define-constant ERR_NOT_AUTHORIZED (err u2001))
(define-constant ERR_PROPERTY_NOT_FOUND (err u2002))
(define-constant ERR_INSUFFICIENT_AMOUNT (err u2003))
(define-constant ERR_PROPERTY_NOT_ACTIVE (err u2004))
(define-constant ERR_TRANSFER_FAILED (err u2005))
(define-constant ERR_INVESTMENT_EXCEEDS_LIMIT (err u2006))
(define-constant ERR_INVALID_INPUT (err u2007))
(define-constant ERR_FUNDING_DEADLINE_PASSED (err u2008))
(define-constant ERR_FUNDING_FAILED (err u2009))

;; sBTC Contract Address
(define-constant SBTC_CONTRACT 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token)

;; Data Variables for authorized contracts
(define-data-var rental-distributor-contract (optional principal) none)

;; Investment tracking
(define-map user-property-investments
  { property-id: uint, investor: principal }
  { 
    sbtc-invested: uint,        ;; Amount invested in micro-units
    investment-date: uint,       ;; Block height when invested
    last-updated: uint          ;; Last update block
  }
)

;; Total investments per property
(define-map property-investment-totals
  { property-id: uint }
  { 
    total-sbtc-invested: uint,  ;; Total sBTC invested (micro-units)
    investor-count: uint,       ;; Number of unique investors
    last-updated: uint          ;; Last update block
  }
)

;; User's total portfolio across all properties
(define-map user-portfolio-totals
  { investor: principal }
  { 
    total-sbtc-invested: uint,  ;; Total invested across all properties
    property-count: uint,       ;; Number of properties invested in
    total-earnings: uint,       ;; Total rental earnings claimed
    last-updated: uint          ;; Last update block
  }
)

;; Investment history for tracking
(define-map investment-history
  { investment-id: uint }
  {
    property-id: uint,
    investor: principal,
    amount: uint,
    timestamp: uint,
    transaction-type: (string-ascii 20) ;; "investment", "withdrawal", "refund"
  }
)

(define-data-var investment-counter uint u0)

;; PRIVATE FUNCTIONS

(define-private (is-valid-contract-address (contract-address principal))
  ;; Basic validation for contract address
  (and 
    (not (is-eq contract-address 'SP000000000000000000002Q6VF78))
    (not (is-eq contract-address tx-sender))
  )
)

(define-private (is-valid-property-id (property-id uint))
  ;; Check if property exists in registry
  (is-some (contract-call? .property-registry get-property property-id))
)

(define-private (is-valid-principal (user principal))
  ;; Basic principal validation
  (not (is-eq user 'SP000000000000000000002Q6VF78))
)

(define-private (is-valid-amount (amount uint))
  ;; Validate amount is within reasonable bounds
  (and (> amount u0) (< amount u1000000000000)) ;; Max 1M sBTC
)

;; READ-ONLY FUNCTIONS

(define-read-only (get-user-investment (property-id uint) (investor principal))
  (default-to 
    { sbtc-invested: u0, investment-date: u0, last-updated: u0 }
    (map-get? user-property-investments { property-id: property-id, investor: investor })
  )
)

(define-read-only (get-user-ownership-percentage (property-id uint) (investor principal))
  (let ((property-totals (get-property-investment-totals property-id))
        (user-investment (get sbtc-invested (get-user-investment property-id investor)))
        (total-invested (get total-sbtc-invested property-totals)))
    (if (> total-invested u0)
      (/ (* user-investment u10000) total-invested) ;; Return basis points (10000 = 100%)
      u0
    )
  )
)

(define-read-only (get-property-investment-totals (property-id uint))
  (default-to 
    { total-sbtc-invested: u0, investor-count: u0, last-updated: u0 }
    (map-get? property-investment-totals { property-id: property-id })
  )
)

(define-read-only (get-user-portfolio (investor principal))
  (default-to
    { total-sbtc-invested: u0, property-count: u0, total-earnings: u0, last-updated: u0 }
    (map-get? user-portfolio-totals { investor: investor })
  )
)

(define-read-only (get-investment-counter)
  (var-get investment-counter)
)

;; Calculate user's potential monthly income from a property
(define-read-only (calculate-monthly-income (property-id uint) (investor principal))
  (let ((property (unwrap! (contract-call? .property-registry get-property property-id) u0))
        (ownership-percentage (get-user-ownership-percentage property-id investor)))
    (if (> ownership-percentage u0)
      (/ (* (get monthly-rent-sbtc property) ownership-percentage) u10000)
      u0
    )
  )
)

;; Get investment history entry
(define-read-only (get-investment-history (investment-id uint))
  (map-get? investment-history { investment-id: investment-id })
)

;; PUBLIC FUNCTIONS

;; Set authorized contract addresses (admin only)
(define-public (set-rental-distributor-contract (contract-address principal))
  (begin
    (asserts! (contract-call? .property-registry is-contract-owner tx-sender) ERR_NOT_AUTHORIZED)
    (asserts! (is-valid-contract-address contract-address) ERR_INVALID_INPUT)
    (var-set rental-distributor-contract (some contract-address))
    (ok true)
  )
)

;; Invest in property with sBTC - With funding deadline checks
(define-public (invest-in-property (property-id uint) (sbtc-amount uint))
  (let ((property (unwrap! (contract-call? .property-registry get-property property-id) ERR_PROPERTY_NOT_FOUND))
        (funding-info (contract-call? .property-registry get-funding-info property-id))
        (current-investment (get-user-investment property-id tx-sender))
        (property-totals (get-property-investment-totals property-id))
        (user-portfolio (get-user-portfolio tx-sender))
        (investment-id (+ (var-get investment-counter) u1)))
    (begin
      ;; Input validations - ENHANCED
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (is-valid-amount sbtc-amount) ERR_INVALID_INPUT)
      
      ;; Business logic validations
      (asserts! (get is-active property) ERR_PROPERTY_NOT_ACTIVE)
      (asserts! (get is-verified property) ERR_PROPERTY_NOT_ACTIVE)
      (asserts! (>= sbtc-amount (get min-investment-sbtc property)) ERR_INSUFFICIENT_AMOUNT)
      
      ;; NEW: Funding deadline and status checks
      (asserts! (> (get blocks-remaining funding-info) u0) ERR_FUNDING_DEADLINE_PASSED)
      (asserts! (is-eq (get funding-status funding-info) "active") ERR_FUNDING_FAILED)
      
      ;; Check if investment exceeds remaining property value
      (let ((remaining-value (- (get total-value-sbtc property) (get total-sbtc-invested property-totals))))
        (asserts! (<= sbtc-amount remaining-value) ERR_INVESTMENT_EXCEEDS_LIMIT))
      
      ;; Transfer sBTC from user to contract
      (unwrap! (contract-call? 
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token 
        transfer 
        sbtc-amount 
        tx-sender 
        (as-contract tx-sender) 
        (some 0x496e7665737474)) ERR_TRANSFER_FAILED)  ;; "Invest" in hex
      
      ;; Update user investment
      (map-set user-property-investments
        { property-id: property-id, investor: tx-sender }
        { 
          sbtc-invested: (+ (get sbtc-invested current-investment) sbtc-amount),
          investment-date: (if (is-eq (get sbtc-invested current-investment) u0) 
                            stacks-block-height 
                            (get investment-date current-investment)),
          last-updated: stacks-block-height
        })
      
      ;; Update property totals
      (map-set property-investment-totals
        { property-id: property-id }
        {
          total-sbtc-invested: (+ (get total-sbtc-invested property-totals) sbtc-amount),
          investor-count: (if (is-eq (get sbtc-invested current-investment) u0)
                           (+ (get investor-count property-totals) u1)
                           (get investor-count property-totals)),
          last-updated: stacks-block-height
        })
      
      ;; Update user's total portfolio
      (map-set user-portfolio-totals
        { investor: tx-sender }
        {
          total-sbtc-invested: (+ (get total-sbtc-invested user-portfolio) sbtc-amount),
          property-count: (if (is-eq (get sbtc-invested current-investment) u0)
                           (+ (get property-count user-portfolio) u1)
                           (get property-count user-portfolio)),
          total-earnings: (get total-earnings user-portfolio),
          last-updated: stacks-block-height
        })
      
      ;; Record investment history
      (map-set investment-history
        { investment-id: investment-id }
        {
          property-id: property-id,
          investor: tx-sender,
          amount: sbtc-amount,
          timestamp: stacks-block-height,
          transaction-type: "investment"
        })
      
      ;; Update investment counter
      (var-set investment-counter investment-id)
      
      ;; Update property registry with new investment total
      (unwrap! (contract-call? .property-registry update-property-investment property-id sbtc-amount) ERR_NOT_AUTHORIZED)
      
      ;; Emit event with funding status
      (let ((updated-funding-info (contract-call? .property-registry get-funding-info property-id)))
        (print { 
          event: "investment-made", 
          property-id: property-id, 
          investor: tx-sender, 
          amount: sbtc-amount,
          investment-id: investment-id,
          ownership-percentage: (get-user-ownership-percentage property-id tx-sender),
          funding-percentage: (get funding-percentage updated-funding-info),
          blocks-remaining: (get blocks-remaining updated-funding-info)
        }))
      
      (ok investment-id)
    )
  )
)

;; Update user's earnings when they claim rental income (called by authorized contracts only)
(define-public (update-user-earnings (investor principal) (property-id uint) (earnings-amount uint))
  (let ((current-portfolio (get-user-portfolio investor)))
    (begin
      ;; Input validation
      (asserts! (is-eq (some tx-sender) (var-get rental-distributor-contract)) ERR_NOT_AUTHORIZED)
      (asserts! (is-valid-principal investor) ERR_INVALID_INPUT)
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (is-valid-amount earnings-amount) ERR_INVALID_INPUT)
      
      ;; Update user's total earnings
      (map-set user-portfolio-totals
        { investor: investor }
        (merge current-portfolio {
          total-earnings: (+ (get total-earnings current-portfolio) earnings-amount),
          last-updated: stacks-block-height
        }))
      
      ;; Emit event
      (print {
        event: "earnings-updated",
        investor: investor,
        property-id: property-id,
        earnings-amount: earnings-amount
      })
      
      (ok true)
    )
  )
)

;; Emergency withdrawal (admin only - for testing purposes)
(define-public (emergency-withdraw (recipient principal) (amount uint))
  (begin
    ;; Input validation
    (asserts! (contract-call? .property-registry is-contract-owner tx-sender) ERR_NOT_AUTHORIZED)
    (asserts! (is-valid-principal recipient) ERR_INVALID_INPUT)
    (asserts! (is-valid-amount amount) ERR_INVALID_INPUT)
    
    (unwrap! (as-contract (contract-call? 
      'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token 
      transfer 
      amount 
      (as-contract tx-sender)
      recipient 
      (some 0x456d6572676e6379))) ERR_TRANSFER_FAILED)  ;; "Emergency" in hex
    
    (print { 
      event: "emergency-withdrawal", 
      recipient: recipient, 
      amount: amount 
    })
    
    (ok true)
  )
)

;; Get all investors for a property (helper function for analytics)
(define-read-only (get-property-investor-count (property-id uint))
  (get investor-count (get-property-investment-totals property-id))
)

;; Check if user has invested in a property
(define-read-only (has-user-invested (property-id uint) (investor principal))
  (> (get sbtc-invested (get-user-investment property-id investor)) u0)
)

;; Refund investor for failed property funding (public function)
(define-public (claim-refund-for-failed-property (property-id uint))
  (let ((property (unwrap! (contract-call? .property-registry get-property property-id) ERR_PROPERTY_NOT_FOUND))
        (funding-info (contract-call? .property-registry get-funding-info property-id))
        (user-investment (get-user-investment property-id tx-sender))
        (refund-amount (get sbtc-invested user-investment))
        (investment-id (+ (var-get investment-counter) u1)))
    (begin
      ;; Input validation
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (> refund-amount u0) ERR_INSUFFICIENT_AMOUNT)
      
      ;; Check that property funding failed
      (asserts! (is-eq (get funding-status funding-info) "failed") ERR_FUNDING_FAILED)
      
      ;; Transfer refund back to investor
      (unwrap! (as-contract (contract-call? 
        'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token 
        transfer 
        refund-amount 
        (as-contract tx-sender) 
        tx-sender 
        (some 0x526566756e64))) ERR_TRANSFER_FAILED)  ;; "Refund" in hex
      
      ;; Clear user's investment record
      (map-set user-property-investments
        { property-id: property-id, investor: tx-sender }
        { 
          sbtc-invested: u0,
          investment-date: (get investment-date user-investment),
          last-updated: stacks-block-height
        })
      
      ;; Update user's total portfolio (subtract refunded amount)
      (let ((current-portfolio (get-user-portfolio tx-sender)))
        (map-set user-portfolio-totals
          { investor: tx-sender }
          {
            total-sbtc-invested: (- (get total-sbtc-invested current-portfolio) refund-amount),
            property-count: (- (get property-count current-portfolio) u1),
            total-earnings: (get total-earnings current-portfolio),
            last-updated: stacks-block-height
          }))
      
      ;; Record refund in investment history
      (map-set investment-history
        { investment-id: investment-id }
        {
          property-id: property-id,
          investor: tx-sender,
          amount: refund-amount,
          timestamp: stacks-block-height,
          transaction-type: "refund"
        })
      
      ;; Update investment counter
      (var-set investment-counter investment-id)
      
      ;; Emit refund event
      (print { 
        event: "refund-claimed", 
        property-id: property-id, 
        investor: tx-sender, 
        refund-amount: refund-amount,
        refund-id: investment-id
      })
      
      (ok refund-amount)
    )
  )
)