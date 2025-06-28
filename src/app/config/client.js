import { createPublicClient, http } from 'viem'
import { bsc, mainnet, polygon, base, bscTestnet } from 'viem/chains'
 

// Define the supported chains with their specific configurations
const mainnetClient = createPublicClient({
    chain: mainnet,
    transport:http(`https://eth-mainnet.g.alchemy.com/v2/7MhrOFJdbrpHzDB8yhYw9mD0zjzGPeux`),
  });
  
  const polygonClient = createPublicClient({
    chain: polygon,
    transport: http(`https://polygon-mainnet.g.alchemy.com/v2/7MhrOFJdbrpHzDB8yhYw9mD0zjzGPeux`),
  });
  
  const bscClient = createPublicClient({
    chain: bsc,
    transport:http(`https://bnb-mainnet.g.alchemy.com/v2/7MhrOFJdbrpHzDB8yhYw9mD0zjzGPeux`),
  });

  const baseClient = createPublicClient({
    chain: base,
    transport:http(`https://base-mainnet.g.alchemy.com/v2/7MhrOFJdbrpHzDB8yhYw9mD0zjzGPeux`),
  });

  const bscTestnetClient = createPublicClient({
    chain: bscTestnet,
    transport:http(`https://bnb-testnet.g.alchemy.com/v2/7MhrOFJdbrpHzDB8yhYw9mD0zjzGPeux`),
  });

// Create a client map or array for managing multiple chains
const clients = {
    1: mainnetClient,
    137: polygonClient,
    56: bscClient,
    97: bscTestnetClient,
    8453: baseClient,
  };

  // Example function to retrieve the appropriate client based on chainId
export const getClient = (chainId) => clients[chainId] || null;