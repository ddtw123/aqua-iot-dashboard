# Environment Variables for AWS Amplify Deployment

This document outlines the environment variables that need to be configured in your AWS Amplify app for proper DynamoDB access.

## Required Environment Variables

Configure these in your AWS Amplify Console under **App settings > Environment variables**:

### AWS Configuration
- `REGION`: AWS region where your DynamoDB tables are located (e.g., `us-east-1`, `us-west-2`)

### DynamoDB Table Names
- `DYNAMO_TABLE_NAME`: Name of your main sensor data table
- `THRESHOLDS_TABLE_NAME`: Name of your thresholds table (defaults to "thresholds" if not set)
- `SPECIES_TABLE_NAME`: Name of your species mapping table

## Example Configuration

```
REGION=us-east-1
DYNAMO_TABLE_NAME=iot-sensor-data
THRESHOLDS_TABLE_NAME=iot-thresholds
SPECIES_TABLE_NAME=iot-species-map
```

## IAM Permissions Required

Ensure your Amplify service role has the following permissions:

1. **AdministratorAccess-Amplify** (already added)
2. **AmazonDynamoDBFullAccess** (already added)

## Additional Permissions (if needed)

If you're still experiencing access issues, you may need to add these specific permissions to your IAM role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:*:table/*"
            ]
        }
    ]
}
```

## Troubleshooting

1. **Check CloudWatch Logs**: Monitor your application logs in AWS CloudWatch for detailed error messages
2. **Verify Table Names**: Ensure the table names in your environment variables match exactly with your DynamoDB table names
3. **Region Mismatch**: Make sure the REGION variable matches the region where your DynamoDB tables are located
4. **IAM Role**: Verify that the Amplify service role has the correct permissions attached
