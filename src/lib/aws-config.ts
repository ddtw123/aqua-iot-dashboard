import { REGION } from "@/util/constant";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const createDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: REGION,
  });
  
  return DynamoDBDocumentClient.from(client);
};

export const dynamoClient = createDynamoDBClient();

export const createBedrockClient = () => {
  const client = new BedrockRuntimeClient({
    region: REGION,
  });
  
  return client;
};

export const bedrockClient = createBedrockClient();
