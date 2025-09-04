/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb']
  },
  env: {
    REGION: process.env.REGION,
    DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME,
    THRESHOLDS_TABLE_NAME: process.env.THRESHOLDS_TABLE_NAME,
    SPECIES_TABLE_NAME: process.env.SPECIES_TABLE_NAME,
  }
};

export default nextConfig;
