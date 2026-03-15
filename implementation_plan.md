# Hyperway Track 2: PVM "Superpowers" Technical Refinement

This refined plan focuses on the most impactful **Track 2** features: raw XCM V5 instructions and native USDT (Asset ID 1984) integration. This ensures the project is technically superior but delivered with 100% polish before the deadline.

## User Review Required

> [!NOTE]
> **Scope Optimization**: We have removed the "Cross-Chain Identity" feature to avoid asynchronous complexity. This allows us to focus entirely on the **XCM V5** and **USDT Escrow**, which are the primary "Superpowers" requested for Track 2.
> 
> **Raw XCM V5 (No Wrappers)**: We are switching from `VersionedXcm` enums to raw instructions. This is more efficient but requires strict adherence to SCALE encoding rules.

## Proposed Changes

### [Component] Smart Contracts (`hyperway-contracts`)

#### [MODIFY] [IXCM.sol](file:///c:/Users/PC/Desktop/Coding/hyperway/hyperway-contracts/src/interfaces/IXCM.sol)
- **New Selectors**: Update `send` to `0x7f0a3bf9` and `execute` to `0xd3b7e04d`.
- **Instruction sets**: Define helper constants for raw XCM V5 opcodes (e.g., `WithdrawAsset = 0x00`, `DepositAsset = 0x02`).

#### [MODIFY] [HyperwayMarketplace.sol](file:///c:/Users/PC/Desktop/Coding/hyperway/hyperway-contracts/src/HyperwayMarketplace.sol)
- **System Precompile (`0x...0900`)**: Use `ISystem.toAccountId()` to map the H160 `_msgSender()` to its native Substrate `AccountId32` for authentic XCM interactions.
- **USDT Escrow (`0x...0120...`)**: Map the genuine USDT (Asset ID 1984) to its deterministic precompile `0x000007C000000000000000000000000001200000` for professional stablecoin payments.

### [Component] Frontend (`hyperway-frontend`)

#### [MODIFY] [useMarketplace.ts](file:///c:/Users/PC/Desktop/Coding/hyperway/hyperway-frontend/hooks/useMarketplace.ts)
- Update XCM payload generation to strip the `VersionedXcm` wrapper and send raw SCALE bytes.
- Handle USDT (Asset ID 1984) as the preferred payment asset in the XCM toggle.

---

## Verification Plan

### Automated Tests (Foundry)
- `forge test`: Mock the `System` precompile and verify the `XCM` instruction buffer generation.

### Manual Verification
1. **USDT Payment**: Submit a job paying with native USDT precompile. Verify the contract holds the tokens on the Hub.
2. **XCM V5 Flow**: Verify the job submission using the XCM toggle correctly calculates weight and executes instructions.
