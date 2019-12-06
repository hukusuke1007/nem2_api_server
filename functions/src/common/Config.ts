export type BlockchainConfigType = {
  network: number,
  endpoint: string,
  generationHash: string
};

export const blockchainConfig: BlockchainConfigType = {
  network: Number(process.env.NODE_NETWORK),
  endpoint: `${process.env.NODE_URL_SCHEME}://${process.env.NODE_DOMAIN}:${process.env.NODE_PORT}`,
  generationHash: process.env.NODE_GENERATION_HASH,
};
