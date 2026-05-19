# Technical Submission

## Repository / Source Code

This submission contains the completed implementation for the World Cup on-chain betting assessment in:

- `contracts/contracts/WorldCupBetting.sol`


## Approach and Key Decisions

I implemented `WorldCupBetting` as a focused prediction market contract that matches the public API and behavior required by the assessment scenarios.

Key decisions:

- Used explicit `Market` and `Bet` structs to keep market state, stakes, shares, claim status, and position ownership easy to inspect.
- Supported both native ETH and ERC20 collateral. `address(0)` is treated as ETH; any other token address uses `IERC20.transferFrom` and `IERC20.transfer`.
- Enforced the market lifecycle directly in contract checks: bets are accepted only before `resolutionTime`, resolution only after `resolutionTime`, and only the configured arbitrator can resolve.
- Applied a 2% fee only on winning payout claims, tracked per token in `collectedFees`, and restricted withdrawals to the contract owner.
- Implemented secondary position trading by transferring ownership of the original bet record to the buyer, so the buyer can claim if the position wins.
- Updated reputation for both winning and losing claims, as required by the test scenarios.
- Kept revert messages aligned with the assessment tests, including `Too early`, `Only arbitrator`, `Market closed`, `Slippage exceeded`, and `Already claimed`.

Security and quality decisions:

- Used OpenZeppelin `ReentrancyGuard` on functions that transfer ETH or tokens.
- Updated state before external transfers in claim, buy, and withdraw paths.
- Used owner-only access control for fee withdrawal.
- Removed an obfuscated remote download/process-spawn payload from `contracts/test/PredictionMarket.test.ts` before running the test suite.
- Added a root `.gitignore` so local build artifacts and dependency folders are not accidentally submitted.
- Updated Next.js from `15.5.6` to `15.5.18` to clear the critical audit finding reported for the original version.
- Fixed the Wagmi configuration so the README's local Hardhat network setup works with `NEXT_PUBLIC_CHAIN_ID=31337` and `NEXT_PUBLIC_RPC_URL`.

## Setup

Prerequisites:

- Node.js 18+
- npm
- MetaMask or another EVM wallet for browser testing

Install root frontend dependencies:

```bash
npm install
```

Install contract dependencies:

```bash
cd contracts
npm install --legacy-peer-deps
```

## Run Contract Tests

From the contracts package:

```bash
cd contracts
npx hardhat test test/WorldCupBetting.assessment.test.ts
```

Expected result:

```text
9 passing
```

The full contract test suite also passes:

```bash
cd contracts
npx hardhat test
```

Expected result:

```text
11 passing
```

## Run the Full Local App

Start a local Hardhat chain:

```bash
cd contracts
npx hardhat node
```

In a second terminal, deploy the contracts:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

Create `.env.local` in the repository root using the deployed addresses:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_REPUTATION_SYSTEM_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

Then run the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build Verification

The frontend production build was verified with the local Hardhat environment variables:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=dummy \
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
NEXT_PUBLIC_REPUTATION_SYSTEM_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3 \
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 \
NEXT_PUBLIC_CHAIN_ID=31337 \
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545 \
npm run build
```

Result:

```text
Compiled successfully
```


## Notes for Reviewers

- The main assessment work is isolated to `WorldCupBetting.sol`.
- `PredictionMarket.sol` is left as the original reference implementation.
- The local app was smoke-tested against a Hardhat deployment.
- `npm audit --audit-level=critical --omit=dev` reports no critical vulnerabilities after the Next.js update. Moderate wallet/dependency transitive advisories remain and would require larger dependency upgrades.
