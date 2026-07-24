const { SePayPgClient } = require('sepay-pg-node');

// env=sandbox khi test, đổi SEPAY_ENV=production trên Vercel khi lên thật.
const createSepayClient = () =>
  new SePayPgClient({
    env: process.env.SEPAY_ENV === 'production' ? 'production' : 'sandbox',
    merchant_id: process.env.SEPAY_MERCHANT_ID,
    secret_key: process.env.SEPAY_SECRET_KEY,
  });

module.exports = { createSepayClient };
