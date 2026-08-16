# sdk-examples

Integration examples for the Arctos settlement SDK. Each example is a self-contained project demonstrating a specific use case.

> **Note:** The Arctos SDK is currently in private beta. Contact us at [info@arctoslabs.io](mailto:info@arctoslabs.io) for access.

## Examples

### `/basic-payment`
Simple cross-chain payment between two addresses. Demonstrates the core `initiate → settle → confirm` flow.

```typescript
import { ArctosClient } from '@arctoslabs/sdk';

const arctos = new ArctosClient({
  apiKey: process.env.ARCTOS_API_KEY,
  environment: 'testnet',
});

const payment = await arctos.payments.create({
  sourceChain: 'ethereum',
  destinationChain: 'polygon',
  amount: '100.00',
  currency: 'USDC',
  recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
});

console.log(`Payment ${payment.id} settled in ${payment.latencyMs}ms`);
// → Payment pay_8f2ac41d settled in 142ms
```

### `/batch-settlement`
Batch multiple payments into a single settlement for reduced costs.

```typescript
const batch = await arctos.payments.createBatch([
  { sourceChain: 'ethereum', destinationChain: 'arbitrum', amount: '500', currency: 'USDC', recipient: addr1 },
  { sourceChain: 'ethereum', destinationChain: 'polygon', amount: '250', currency: 'USDT', recipient: addr2 },
  { sourceChain: 'ethereum', destinationChain: 'base', amount: '1000', currency: 'USDC', recipient: addr3 },
]);

console.log(`Batch ${batch.id}: ${batch.payments.length} payments, avg ${batch.avgLatencyMs}ms`);
```

### `/webhook-listener`
Express.js server that listens for settlement confirmation webhooks.

```typescript
app.post('/webhooks/arctos', arctos.webhooks.verify(), (req, res) => {
  const { type, payment } = req.body;

  if (type === 'payment.settled') {
    console.log(`Settled: ${payment.id} on ${payment.destinationChain}`);
    // Update your database, notify user, etc.
  }

  if (type === 'payment.failed') {
    console.log(`Failed: ${payment.id} — ${payment.failureReason}`);
    // Handle refund logic
  }

  res.sendStatus(200);
});
```

### `/multi-chain-monitor`
Real-time monitoring dashboard for settlement status across chains.

### `/liquidity-check`
Query available liquidity on a route before initiating payment.

```typescript
const liquidity = await arctos.routes.getLiquidity({
  sourceChain: 'ethereum',
  destinationChain: 'solana',
  currency: 'USDC',
});

console.log(`Available: ${liquidity.available} USDC`);
console.log(`Estimated latency: ${liquidity.estimatedLatencyMs}ms`);
console.log(`Fee: ${liquidity.feePercent}%`);
```

## Setup

```bash
git clone https://github.com/arctoslabs-io/sdk-examples.git
cd sdk-examples/<example>
npm install
cp .env.example .env  # Add your API key
npm start
```

## SDK Documentation

Full SDK documentation is available to beta partners at [docs.arctoslabs.io](https://docs.arctoslabs.io) (access required).

## Support

- Email: [info@arctoslabs.io](mailto:info@arctoslabs.io)
- SDK issues: Open an issue in this repo

## License

MIT
