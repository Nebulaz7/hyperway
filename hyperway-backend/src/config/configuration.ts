import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Blockchain
  CONTRACT_ADDRESS: Joi.string().required(),
  RPC_URL: Joi.string().uri().required(),
  START_BLOCK: Joi.number().required(),
  POLL_INTERVAL_MS: Joi.number().default(10000),

  // Supabase
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),
});

export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV,

  blockchain: {
    contractAddress: process.env.CONTRACT_ADDRESS as `0x${string}`,
    rpcUrl: process.env.RPC_URL,
    startBlock: BigInt(process.env.START_BLOCK ?? '0'),
    pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS ?? '10000', 10),
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
});