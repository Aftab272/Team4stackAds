# Team4StackAds - Earning Packages + Reward Ads MVP Plan (Low/No Investment)

## 0) Important Reality Check (profit + withdrawals)
- A “profit system” needs **source of funds**. Earning users cannot be paid from nothing.
- This plan supports **two payout models**:
  - **Model A (Low investment / safest MVP)**: User package payment funds rewards. Withdrawals are paid from the platform’s reserve (escrow-like logic).
  - **Model B (Ad-network rewarded ads)**: Use a rewarded-ads provider (they pay the platform). This usually needs SDK + verification and has payout minimums.
- For “without investment / low investment”, start with **Model A**.

## 1) Goal (what you want)
You want a system where:
1. Users create an account.
2. Show “Packages” (tomorrow’s / today’s package list).
3. User buys a package with supported payment methods.
4. After purchase, a **pending approval** process runs (example: admin approval within ~3 hours).
5. Approved package activates user access.
6. User watches reward content (“ads/videos”) for the allowed time and quotas.
7. Earnings go into the user **wallet**.
8. After earnings reach a valid min amount, user can **request withdrawal**.
9. Admin checks withdrawal and approves/rejects, then funds are released (manual payout or payout provider).
10. Packages expire after the duration; after expiry, ads access stops.

## 2) Roles
1. **User**
   - Register/login
   - Buy packages
   - Watch reward content
   - Earn wallet credits
   - Request withdrawal
2. **Admin**
   - Approve/reject package purchases
   - Manage package catalog
   - Monitor suspicious activity
   - Approve/reject withdrawals
3. **System (backend jobs/controllers)**
   - Issues session tokens for watch verification
   - Finalizes reward credits atomically
   - Expires active packages automatically
   - Processes payment webhooks and updates DB

## 3) Recommended MVP Feature List (build order)
### Phase 1: Packages + Wallet + Admin approval (core money flow)
- Create package catalog UI (User side)
- Payment flow (User buys package -> records pending purchase)
- Admin approval (within 3 hours)
- When approved: activate user package for duration
- Earnings credit to wallet (basic reward rule)
- Wallet screen (balance + ledger)
- Withdraw request (min amount rule)
- Admin approves withdraw and sets final status

### Phase 2: Reward watching + anti-fraud
- Reward content listing to user (only when active package exists)
- Start watch session endpoint (backend issues session_token)
- Complete watch session endpoint (backend verifies rules)
- Credit wallet based on verified completion
- Abuse protection:
  - session uniqueness
  - cooldown rules
  - max completion per day per package
  - optional manual review queue

### Phase 3: Integrations upgrade
- Payments integration (webhooks)
- Payout integration (or manual payouts)
- Rewarded ads provider (optional, only if you want external ad revenue)

## 4) Database Design (Supabase) - Additions
Your current `schema.sql` includes:
- `users`, `wallet`, `wallet_transactions`
- `withdraw_requests`
- `tasks`, `user_tasks`
- `team_referrals`, `earnings`, `notifications`

For this new system, you should add new tables. Names are examples:

### 4.1 Package Catalog
- `packages`:
  - `id`
  - `name`
  - `price_amount` + `currency`
  - `duration_hours` (example: 72 hours / 3 hours approval window is separate)
  - `ad_quota_per_day` (how many rewarded completions per day)
  - `ad_reward_amount` (how much wallet credit per completion)
  - `min_withdraw_amount`
  - `withdraw_fee_percent`
  - `status` (active/inactive)

### 4.2 Purchase & Approval Flow
- `package_purchases`:
  - `id`
  - `user_id`
  - `package_id`
  - `amount_paid`
  - `payment_method` (card, paypal, bank_transfer, etc)
  - `payment_provider` (stripe, paypal, etc)
  - `provider_reference` (transaction id)
  - `status` (pending/approved/rejected/expired)
  - `created_at`
  - `approved_at`
  - `expires_at` (for “admin approval within ~3 hours”)

- `user_packages` (active assignment):
  - `id`
  - `user_id`
  - `purchase_id`
  - `package_id`
  - `started_at`
  - `ends_at`
  - `status` (active/expired/paused)

### 4.3 Reward Content
For MVP “Low investment”, you can use internal reward content:
- `reward_content`:
  - `id`
  - `title`
  - `content_url` (video link / page link)
  - `source` (internal)
  - `is_active`

### 4.4 Watch Sessions & Verification
To prevent fake credits:
- `watch_sessions`:
  - `id`
  - `user_id`
  - `user_package_id`
  - `content_id`
  - `session_token` (random, short-lived)
  - `started_at`
  - `completed_at`
  - `client_report` (store watch time, but treat as untrusted)
  - `server_verified` boolean
  - `status` (pending/completed/invalid)

### 4.5 Wallet Credits
You already have:
- `wallet_transactions`
You can use it directly by writing credits/debits with descriptions:
- `credit`: “package_ad_reward”
- `debit`: “withdraw_fee”
- Keep it as the ledger of truth.

## 5) Economics Model (how much money, how min withdraw, how fee works)
### 5.1 Profit / reward conversion
You need formulas that are always safe:
1. Every package payment must reserve enough funds for maximum possible rewards.
2. You can compute max rewards:
   - `max_rewards = ad_quota_per_day * duration_days * ad_reward_amount`
3. Platform fee and withdrawal fee must ensure reserve covers:
   - `platform_buffer = package_price - (max_rewards + withdraw_processing_cost)`

Example (conceptual):
- Package price: 100
- duration: 7 days
- quota: 20 completions/day
- total completions: 140
- reward per completion: 0.50 => rewards = 70
- withdraw fee: 5% => deducted at withdraw time
- You keep reserve: 100 - 70 = 30 (platform buffer)

This avoids situations where users withdraw more than reserved.

### 5.2 Platform withdraw fee
On withdraw approval:
- `payout_amount = requested_amount - requested_amount * withdraw_fee_percent`
- Record:
  - debit from wallet: total requested amount
  - credit of fee to platform reserve (if you implement a reserve wallet table)
  - payout to user via admin or payout provider

### 5.3 Minimum withdraw validation
Use:
- `packages.min_withdraw_amount`
or
- `global_min_withdraw_amount`

Wallet check on withdraw creation:
- if `wallet.balance < min_amount` => reject early

## 6) “Ads” (where do ads/videos come from?)
### Model A: Internal sponsored reward content (low investment)
- You host/prepare videos yourself or use free/royalty-safe content.
- Users “watch” for reward credits.
- Revenue is from package purchases (user pays -> rewards paid from reserve).
- “Ads monitoring” becomes “watch verification” not “ad network revenue”.

### Model B: Rewarded ads provider (if you want external revenue)
- Use a rewarded video provider (platform dependent).
- You need:
  - front-end SDK to play rewarded ads
  - backend confirmation (server-to-server)
- This typically has setup requirements and may have minimum payout.

## 7) Anti-fraud / security (critical)
Assume the client is malicious.

### 7.1 Session token approach
1. User opens a “watch” page.
2. Frontend calls backend: `POST /api/watch/start`
3. Backend issues `session_token` and stores it in `watch_sessions` as pending.
4. Frontend reports completion with time and session_token.
5. Backend enforces rules:
  - session_token must exist and be pending
  - user must have an active package
  - user must be under daily quota
  - completion must satisfy minimum watch duration threshold
6. Backend marks session as completed and credits wallet.

### 7.2 Idempotency
- Ensure the same session completion cannot credit multiple times:
  - enforce unique `session_token`
  - in code, credit only when status is pending -> completed transition

### 7.3 Rate limits & abuse checks
- Add limits:
  - max sessions per minute
  - max invalid completions
  - per-device/cookie throttle (optional)
- Consider admin “review queue” for suspicious users.

### 7.4 Captcha / bot protection (low-cost)
- Add Turnstile/hcaptcha equivalent if possible.
- Even free Tier solutions help stop bots.

## 8) Admin Approval within ~3 hours (exact behavior)
### Flow
1. User buys package => create `package_purchases` status = `pending`
2. Set `expires_at = now + 3 hours`
3. Admin checks pending list and approves:
   - status pending -> approved
   - create row in `user_packages`
   - set `started_at = now`, `ends_at = now + duration_hours`
4. If admin does not respond before `expires_at`:
   - purchase status -> expired
   - user package not activated
   - optionally refund logic (depends on payment gateway)

## 9) Withdraw Flow (methods + fee + admin control)
### Withdraw methods
Start MVP with at least one method:
- Manual payout by admin:
  - Bank transfer (manual)
  - Mobile transfer (manual)
  - PayPal payout (if supported)

Later add payout provider integrations (webhooks).

### Withdraw validation
When user submits:
1. Ensure user has active package or completed package still allows withdraw
2. Check wallet balance
3. Check min withdraw amount
4. Apply withdraw fee percent
5. Record `withdraw_requests.status = pending`

### Admin approval
1. Admin reviews:
   - user identity
   - payout details correctness
   - verify no suspicious activity
2. Approve:
   - status pending -> approved
   - mark wallet debited and fee recorded
   - payout executed manually or by provider
3. Reject:
   - status pending -> rejected
   - refund logic depends on model

## 10) API Endpoints (proposal aligned with your current backend style)
Your backend already has:
- `/api/wallet`, `/api/withdraw`, `/api/tasks`, `/api/team`, `/api/contact`, `/api/announcements`
- Admin endpoints under `/api/admin/*`

Add endpoints like:

User APIs
- `GET /api/packages` (list active packages)
- `POST /api/packages/purchase` (create purchase record, payment initiation reference)
- `GET /api/packages/my` (active user packages + history)
- `POST /api/watch/start` (issue session_token, create watch_sessions row)
- `POST /api/watch/complete` (validate completion and credit wallet)
- `POST /api/withdraw` (already exists, add validation for min amount by active/eligible package)

Admin APIs
- `GET /api/admin/packages/purchases?status=pending`
- `POST /api/admin/packages/purchases/:id/approve`
- `POST /api/admin/packages/purchases/:id/reject`
- `CRUD /api/admin/packages` (create/edit package catalog)
- `GET /api/admin/watch-sessions?filter=suspicious`

Payment Integration Webhooks
- `POST /api/payments/webhook` (verify provider events, update purchase status)

## 11) Frontend Integration (pages/components)
### User pages
- `Packages.jsx`
  - shows package cards, price, duration, quota, reward per view, min withdraw
- `BuyPackage.jsx`
  - payment UI
- `MyPackage.jsx`
  - shows active package timer + remaining quota
- `WatchRewards.jsx`
  - show reward content list and “Watch” button
- `Wallet.jsx`
  - shows balance and transaction ledger (credit/debit)
- `Withdraw.jsx`
  - withdraw form + methods + min amount validation

### Admin pages
- `AdminPackages.jsx` / `PendingPurchases.jsx`
  - approve/reject purchases
- `AdminWithdraws.jsx`
  - approve/reject withdrawals
- `AdminContent.jsx`
  - manage reward content list

## 12) Low/No Investment Implementation Strategy (practical)
### Step-by-step (fastest MVP)
1. Implement **package catalog** + **purchase pending** + **admin approve**.
2. Implement **active user package** with expiry.
3. Implement **watch sessions** with internal reward content.
4. Credit wallet on verified completion.
5. Implement withdrawals with admin approval and fee deduction.
6. Add basic anti-fraud (sessions, quotas, rate limits).

### How to “get ads content” without cost
- Start with:
  - your own videos
  - public videos with permission
  - or internal video pages
- Treat them as “reward content” rather than monetized ads.

## 13) Business / Compliance notes (short but necessary)
- Add terms, privacy policy, and age restrictions if needed.
- “Reward” systems must be transparent about how credits are earned and how withdrawals work.
- Use KYC only later if payout provider requires it.

## 14) Delivery Timeline (example 2-3 weeks MVP)
Week 1:
1. DB schema additions
2. Backend endpoints for packages, approvals, watch sessions, wallet credits
3. User UI: packages list + purchase + watch + wallet ledger

Week 2:
1. Admin UI approvals + withdrawals UI
2. Security hardening and anti-fraud rules
3. Payment integration webhook (if Model A uses prepaid, you can still start with single gateway)

Week 3 (optional):
1. Reward content management
2. Suspicious review queue
3. External rewarded-ads provider (Model B) if desired

## 15) What I need from you to finalize the numbers
Reply with these:
1. Package price range (example: 5, 10, 20 USD)
2. Duration per package (example: 3 days / 7 days)
3. Daily watch quota per package
4. Reward per completion you want to offer
5. Withdraw fee percent you want
6. Minimum withdraw amount
7. Which payment method(s) you can support first (card only, bank transfer, PayPal, etc)

Then I can compute safe reward formulas and propose exact payout thresholds.

