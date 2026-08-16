import { ArctosClient } from '@arctoslabs/sdk';
import 'dotenv/config';

async function main() {
  const arctos = new ArctosClient({
    apiKey: process.env.ARCTOS_API_KEY!,
    environment: 'testnet',
  });

  const routes = await arctos.routes.list({
    sourceChain: 'ethereum',
    destinationChain: 'polygon',
    currency: 'USDC',
  });

  console.log(`Found ${routes.length} routes`);
  console.log(`Best route: ${routes[0].provider} — est. ${routes[0].estimatedLatencyMs}ms`);

  const payment = await arctos.payments.create({
    sourceChain: 'ethereum',
    destinationChain: 'polygon',
    amount: '100.00',
    currency: 'USDC',
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    metadata: {
      orderId: 'order_12345',
      customer: 'demo',
    },
  });

  console.log(`Payment created: ${payment.id}`);
  console.log(`Status: ${payment.status}`);
  console.log(`Settled in: ${payment.latencyMs}ms`);
  console.log(`Fee: ${payment.fee} ${payment.feeCurrency}`);
  console.log(`TX (source): ${payment.sourceTxHash}`);
  console.log(`TX (destination): ${payment.destinationTxHash}`);
}

main().catch(console.error);
