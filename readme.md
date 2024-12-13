# Story Protocol Article Generator

This project generates articles based on Farcaster interactions and registers them with Story Protocol. It uses AI to analyze your Farcaster activity and create personalized articles.

## Overview

The system:
1. Fetches your Farcaster casts and reactions
2. Processes them as "memories" (short-term and long-term)
3. Generates an article using Gaia's LLM
4. Registers the article with Story Protocol

## Setup

1. Clone the repository
```bash
git clone [your-repo-url]
cd storyprompts§
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your credentials:
     ```env
     # Neynar API Configuration
     NEYNAR_API_KEY=your_neynar_api_key
     
     # Story Protocol Wallet Configuration
     WALLET_ADDRESS=your_wallet_address
     WALLET_PRIVATE_KEY=your_wallet_private_key
     
     # Pinata Configuration
     PINATA_JWT=your_pinata_jwt
     
     # RPC Configuration
     RPC_PROVIDER_URL=your_rpc_provider_url
     ```

## Usage

### Generate and Register an Article
```bash
npm run start "Your Article Title"
```

### Run Tests
```bash
# Test article generation only
npm run test:generatearticle

# Test memory processing
npm run test:memory

# Test full flow (generation + registration)
npm run test:main "Test Article Title"
```

## API Endpoints Used

- Neynar API: `https://api.neynar.com/v2`
- Gaia Node: `https://llama8b.gaia.domains/v1`

## Current Limitations

1. **Farcaster Data**:
   - Limited to 100 reactions
   - Hardcoded to user ID 12021
   - Only processes parent URLs (not channel IDs)

2. **Article Generation**:
   - Token limit: 81,920 tokens
   - Currently limited to:
     - 3 long-term memory posts
     - 5 core interest casts
     - 3 related topic casts
     - 2 outer space casts

## Project Structure

```
src/
├── services/
│   ├── article.ts     # Article generation logic
│   ├── feed.ts        # Farcaster feed fetching
│   ├── memory.ts      # Memory processing
│   └── reactions.ts   # Farcaster reactions handling
├── test/
│   ├── test-article.ts
│   ├── test-main.ts
│   └── test-memory.ts
└── utils/            # Utility functions
```

## Known Issues

1. Channel ID handling needs improvement
2. URL metadata is not currently processed

## Future Improvements

- [ ] Support multiple user IDs
- [ ] Add time range filtering (30 days limit)
- [ ] Improve channel handling
- [ ] Add URL metadata processing
- [ ] Add image description capabilities
- [ ] Include source URLs in article sections
- [ ] Improve error handling for API responses

## Technical Details

- Uses Gaia's LLM for article generation
- Implements Story Protocol for IP registration
- Uses Pinata for IPFS storage
- Processes Farcaster data through Neynar API

## License

ISC




