import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.REGION;

// Create DynamoDB client with proper configuration
export const createDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: REGION,
  });
  
  return DynamoDBDocumentClient.from(client);
};

// Export the configured client
export const dynamoClient = createDynamoDBClient();

// Environment variables validation
export const validateEnvironmentVariables = () => {
  const requiredVars = [
    'REGION',
    'DYNAMO_TABLE_NAME',
    'THRESHOLDS_TABLE_NAME', 
    'SPECIES_TABLE_NAME'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};
