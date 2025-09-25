;; Property Registry Smart Contract - Security Enhanced
;; File: contracts/property-registry.clar
;; Manages property listings, verification, and metadata

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u1001))
(define-constant ERR_PROPERTY_NOT_FOUND (err u1002))
(define-constant ERR_INVALID_AMOUNT (err u1003))
(define-constant ERR_PROPERTY_ALREADY_EXISTS (err u1004))
(define-constant ERR_INVALID_INPUT (err u1005))
(define-constant ERR_PROPERTY_VALUE_TOO_HIGH (err u1006))
(define-constant ERR_RENT_YIELD_UNREALISTIC (err u1007))

;; Security constants
(define-constant MAX_PROPERTY_VALUE u10000000000000) ;; 10 million sBTC max
(define-constant MIN_PROPERTY_VALUE u100000000) ;; 100 sBTC minimum
(define-constant MAX_ANNUAL_YIELD u3000) ;; 30% max annual yield (basis points)
(define-constant DEFAULT_FUNDING_PERIOD u1440) ;; 10 days in blocks (144 blocks/day)
(define-constant MIN_FUNDING_THRESHOLD u5000) ;; 50% minimum funding (basis points)
(define-constant MAX_FUNDING_THRESHOLD u10000) ;; 100% maximum funding

;; Data Variables
(define-data-var property-counter uint u0)
(define-data-var platform-fee-rate uint u200) ;; 2% = 200 basis points
(define-data-var investment-manager-contract (optional principal) none)
(define-data-var rental-distributor-contract (optional principal) none)

;; Property storage
(define-map properties
  { property-id: uint }
  {
    owner: principal,
    title: (string-ascii 100),
    description: (string-ascii 500),
    location: (string-ascii 100),
    property-type: (string-ascii 50),
    total-value-sbtc: uint,              ;; Total property value in sBTC (micro-units)
    total-invested-sbtc: uint,           ;; Total sBTC invested so far (micro-units)
    monthly-rent-sbtc: uint,             ;; Expected monthly rent in sBTC (micro-units)
    min-investment-sbtc: uint,           ;; Minimum investment amount in sBTC (micro-units)
    is-verified: bool,
    is-active: bool,
    created-at: uint,
    image-uri: (string-ascii 200),       ;; IPFS hash for property images
    funding-deadline: uint,              ;; Block height deadline for funding
    funding-threshold: uint,             ;; Minimum funding percentage (basis points)
    funding-status: (string-ascii 20)    ;; "active", "funded", "failed", "refunded"
  }
)

;; Property verification tracking
(define-map property-verification
  { property-id: uint }
  {
    verified-by: principal,
    verification-date: uint,
    verification-notes: (string-ascii 200)
  }
)

;; Platform stats
(define-map platform-stats
  { stat-key: (string-ascii 20) }
  { stat-value: uint }
)

;; PRIVATE FUNCTIONS

(define-private (is-authorized-caller)
  (or 
    (is-eq tx-sender CONTRACT_OWNER)
    (is-eq (some tx-sender) (var-get investment-manager-contract))
    (is-eq (some tx-sender) (var-get rental-distributor-contract))
  )
)

(define-private (is-valid-contract-address (contract-address principal))
  ;; Enhanced validation for contract address
  (and 
    (not (is-eq contract-address 'SP000000000000000000002Q6VF78))
    (not (is-eq contract-address CONTRACT_OWNER))
    (not (is-eq contract-address (as-contract tx-sender)))
  )
)

(define-private (is-valid-property-id (property-id uint))
  (and (> property-id u0) (<= property-id (var-get property-counter)))
)

(define-private (is-valid-property-value (value uint))
  ;; Enhanced property value validation
  (and 
    (>= value MIN_PROPERTY_VALUE)
    (<= value MAX_PROPERTY_VALUE)
  )
)

(define-private (is-realistic-rent-yield (monthly-rent uint) (property-value uint))
  ;; Check if monthly rent yields reasonable annual return (max 30%)
  (let ((annual-rent (* monthly-rent u12))
        (annual-yield-basis-points (/ (* annual-rent u10000) property-value)))
    (<= annual-yield-basis-points MAX_ANNUAL_YIELD)
  )
)

(define-private (is-valid-string-input (str (string-ascii 500)) (min-len uint) (max-len uint))
  ;; Enhanced string validation
  (and 
    (>= (len str) min-len)
    (<= (len str) max-len)
  )
)

;; READ-ONLY FUNCTIONS

(define-read-only (get-property (property-id uint))
  (map-get? properties { property-id: property-id })
)

(define-read-only (get-property-count)
  (var-get property-counter)
)

(define-read-only (get-platform-fee-rate)
  (var-get platform-fee-rate)
)

(define-read-only (is-property-verified (property-id uint))
  (match (get-property property-id)
    property (get is-verified property)
    false
  )
)

(define-read-only (get-verification-info (property-id uint))
  (map-get? property-verification { property-id: property-id })
)

(define-read-only (is-contract-owner (user principal))
  (is-eq user CONTRACT_OWNER)
)

(define-read-only (get-platform-stat (stat-key (string-ascii 20)))
  (default-to 
    u0 
    (get stat-value (map-get? platform-stats { stat-key: stat-key }))
  )
)

;; New security read-only functions
(define-read-only (get-property-limits)
  { 
    min-value: MIN_PROPERTY_VALUE, 
    max-value: MAX_PROPERTY_VALUE,
    max-annual-yield: MAX_ANNUAL_YIELD
  }
)

;; PUBLIC FUNCTIONS

;; Set authorized contract addresses (admin only - Access control)
(define-public (set-investment-manager-contract (contract-address principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (asserts! (is-valid-contract-address contract-address) ERR_INVALID_INPUT)
    (var-set investment-manager-contract (some contract-address))
    (ok true)
  )
)

(define-public (set-rental-distributor-contract (contract-address principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (asserts! (is-valid-contract-address contract-address) ERR_INVALID_INPUT)
    (var-set rental-distributor-contract (some contract-address))
    (ok true)
  )
)

;; Submit property for listing (property owner) - Validation with funding terms
(define-public (submit-property 
    (title (string-ascii 100))
    (description (string-ascii 500))
    (location (string-ascii 100))
    (property-type (string-ascii 50))
    (total-value-sbtc uint)
    (monthly-rent-sbtc uint)
    (min-investment-sbtc uint)
    (image-uri (string-ascii 200))
    (funding-days uint)
    (funding-threshold uint))
  (let ((property-id (+ (var-get property-counter) u1))
        (funding-deadline (+ stacks-block-height (* funding-days u144)))) ;; 144 blocks per day
    (begin
      ;; Enhanced Input validation
      (asserts! (is-valid-property-value total-value-sbtc) ERR_PROPERTY_VALUE_TOO_HIGH)
      (asserts! (and (> min-investment-sbtc u0) (<= min-investment-sbtc total-value-sbtc)) ERR_INVALID_AMOUNT)
      (asserts! (> monthly-rent-sbtc u0) ERR_INVALID_AMOUNT)
      
      ;; Funding validation
      (asserts! (and (> funding-days u0) (<= funding-days u90)) ERR_INVALID_INPUT) ;; Max 90 days
      (asserts! (and (>= funding-threshold MIN_FUNDING_THRESHOLD) (<= funding-threshold MAX_FUNDING_THRESHOLD)) ERR_INVALID_INPUT)
      
      ;; Enhanced string validation
      (asserts! (is-valid-string-input title u1 u100) ERR_INVALID_INPUT)
      (asserts! (is-valid-string-input description u10 u500) ERR_INVALID_INPUT)
      (asserts! (is-valid-string-input location u1 u100) ERR_INVALID_INPUT)
      (asserts! (is-valid-string-input property-type u1 u50) ERR_INVALID_INPUT)
      (asserts! (<= (len image-uri) u200) ERR_INVALID_INPUT)
      
      ;; Enhanced business logic validation - realistic rent yield
      (asserts! (is-realistic-rent-yield monthly-rent-sbtc total-value-sbtc) ERR_RENT_YIELD_UNREALISTIC)
      
      ;; Minimum investment should be reasonable (at least 0.1% of property value)
      (asserts! (>= min-investment-sbtc (/ total-value-sbtc u1000)) ERR_INVALID_AMOUNT)
      
      ;; Store property
      (map-set properties 
        { property-id: property-id }
        {
          owner: tx-sender,
          title: title,
          description: description,
          location: location,
          property-type: property-type,
          total-value-sbtc: total-value-sbtc,
          total-invested-sbtc: u0,
          monthly-rent-sbtc: monthly-rent-sbtc,
          min-investment-sbtc: min-investment-sbtc,
          is-verified: false,
          is-active: false,
          created-at: stacks-block-height,
          image-uri: image-uri,
          funding-deadline: funding-deadline,
          funding-threshold: funding-threshold,
          funding-status: "pending"
        })
      
      ;; Update counter
      (var-set property-counter property-id)
      
      ;; Update platform stats
      (map-set platform-stats 
        { stat-key: "total-properties" }
        { stat-value: property-id })
      
      ;; Emit event
      (print { 
        event: "property-submitted", 
        property-id: property-id, 
        owner: tx-sender,
        title: title,
        total-value-sbtc: total-value-sbtc,
        funding-deadline: funding-deadline,
        funding-threshold: funding-threshold
      })
      
      (ok property-id)
    )
  )
)

;; Verify property (admin only)
(define-public (verify-property 
    (property-id uint) 
    (verification-notes (string-ascii 200)))
  (let ((property (unwrap! (get-property property-id) ERR_PROPERTY_NOT_FOUND)))
    (begin
      ;; Enhanced access control
      (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (<= (len verification-notes) u200) ERR_INVALID_INPUT)
      
      ;; Business logic - can't verify already verified property
      (asserts! (not (get is-verified property)) ERR_PROPERTY_ALREADY_EXISTS)
      
      ;; Update property verification status and activate funding
      (map-set properties 
        { property-id: property-id }
        (merge property { 
          is-verified: true, 
          is-active: true,
          funding-status: "active"
        }))
      
      ;; Store verification details
      (map-set property-verification
        { property-id: property-id }
        {
          verified-by: tx-sender,
          verification-date: stacks-block-height,
          verification-notes: verification-notes
        })
      
      ;; Update platform stats
      (let ((verified-count (+ (get-platform-stat "verified-properties") u1)))
        (map-set platform-stats 
          { stat-key: "verified-properties" }
          { stat-value: verified-count }))
      
      ;; Emit event
      (print { 
        event: "property-verified", 
        property-id: property-id, 
        verified-by: tx-sender,
        funding-deadline: (get funding-deadline property)
      })
      
      (ok true)
    )
  )
)

;; Update property investment total (called by authorized contracts only)
(define-public (update-property-investment 
    (property-id uint) 
    (additional-investment uint))
  (let ((property (unwrap! (get-property property-id) ERR_PROPERTY_NOT_FOUND)))
    (begin
      ;; Enhanced access control
      (asserts! (is-eq (some tx-sender) (var-get investment-manager-contract)) ERR_NOT_AUTHORIZED)
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      (asserts! (> additional-investment u0) ERR_INVALID_AMOUNT)
      
      ;; Security check - prevent overflow in total invested
      (let ((new-total (+ (get total-invested-sbtc property) additional-investment)))
        (asserts! (<= new-total (get total-value-sbtc property)) ERR_INVALID_AMOUNT)
        (asserts! (< new-total u340282366920938463463374607431768211455) ERR_PROPERTY_VALUE_TOO_HIGH)
        
        ;; Update total invested
        (map-set properties 
          { property-id: property-id }
          (merge property { total-invested-sbtc: new-total }))
      )
      
      ;; Emit event
      (print { 
        event: "investment-updated", 
        property-id: property-id, 
        new-total: (+ (get total-invested-sbtc property) additional-investment)
      })
      
      (ok true)
    )
  )
)

;; Update platform fee rate (admin only)
(define-public (update-platform-fee-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (asserts! (<= new-rate u1000) ERR_INVALID_AMOUNT) ;; Max 10%
    (asserts! (>= new-rate u0) ERR_INVALID_AMOUNT) ;; Min 0%
    
    (let ((old-rate (var-get platform-fee-rate)))
      (var-set platform-fee-rate new-rate)
      
      (print { 
        event: "platform-fee-updated", 
        old-rate: old-rate,
        new-rate: new-rate 
      })
    )
    
    (ok true)
  )
)

;; Deactivate property (admin only)
(define-public (deactivate-property (property-id uint))
  (let ((property (unwrap! (get-property property-id) ERR_PROPERTY_NOT_FOUND)))
    (begin
      ;; Enhanced access control
      (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      
      ;; Business logic - only deactivate active properties
      (asserts! (get is-active property) ERR_INVALID_INPUT)
      
      (map-set properties 
        { property-id: property-id }
        (merge property { is-active: false }))
      
      (print { 
        event: "property-deactivated", 
        property-id: property-id,
        reason: "admin-action"
      })
      
      (ok true)
    )
  )
)

;; Check funding deadline and mark as failed if underfunded (public function)
(define-public (check-funding-deadline (property-id uint))
  (let ((property (unwrap! (get-property property-id) ERR_PROPERTY_NOT_FOUND)))
    (begin
      ;; Input validation
      (asserts! (is-valid-property-id property-id) ERR_INVALID_INPUT)
      
      ;; Check if funding period has expired
      (asserts! (>= stacks-block-height (get funding-deadline property)) ERR_INVALID_INPUT)
      
      ;; Check if property is still in active funding state
      (asserts! (is-eq (get funding-status property) "active") ERR_PROPERTY_ALREADY_EXISTS)
      
      ;; Calculate funding percentage
      (let ((funding-percentage (/ (* (get total-invested-sbtc property) u10000) (get total-value-sbtc property))))
        
        ;; Check if funding threshold was met
        (if (>= funding-percentage (get funding-threshold property))
          ;; Funding successful
          (begin
            (map-set properties 
              { property-id: property-id }
              (merge property { funding-status: "funded" }))
            
            (print { 
              event: "funding-successful", 
              property-id: property-id,
              final-funding-percentage: funding-percentage,
              total-invested: (get total-invested-sbtc property)
            })
            
            (ok "funded")
          )
          ;; Funding failed
          (begin
            (map-set properties 
              { property-id: property-id }
              (merge property { 
                funding-status: "failed",
                is-active: false 
              }))
            
            (print { 
              event: "funding-failed", 
              property-id: property-id,
              final-funding-percentage: funding-percentage,
              required-threshold: (get funding-threshold property),
              total-invested: (get total-invested-sbtc property)
            })
            
            (ok "failed")
          )
        )
      )
    )
  )
)

;; Get funding status and deadline info
(define-read-only (get-funding-info (property-id uint))
  (let ((property (unwrap! (get-property property-id) 
                   { funding-deadline: u0, funding-threshold: u0, funding-status: "not-found", 
                     current-funding: u0, funding-percentage: u0, blocks-remaining: u0 })))
    (let ((current-funding (get total-invested-sbtc property))
          (funding-percentage (if (> (get total-value-sbtc property) u0)
                                (/ (* current-funding u10000) (get total-value-sbtc property))
                                u0))
          (blocks-remaining (if (> (get funding-deadline property) stacks-block-height)
                              (- (get funding-deadline property) stacks-block-height)
                              u0)))
      {
        funding-deadline: (get funding-deadline property),
        funding-threshold: (get funding-threshold property),
        funding-status: (get funding-status property),
        current-funding: current-funding,
        funding-percentage: funding-percentage,
        blocks-remaining: blocks-remaining
      }
    )
  )
)