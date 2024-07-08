import {
  DynamoDBClient,
  UpdateItemCommand,
  PutItemCommand,
  UpdateItemCommandInput,
  PutItemCommandInput,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { isDynamoDBError } from "../../../utils/typeguards";

// Function to update or insert reputation counts in DynamoDB
export async function writeReputationToDynamoDB(
  changes: Record<string, number>
): Promise<{ [key: string]: string }> {
  // Read the endpoint URL from environment variables
  const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
  const region = process.env.DYNAMODB_REGION || "localhost";

  const dynamoDBClient = new DynamoDBClient({
    region: region,
    endpoint: endpoint,
  });
  const totals: { [key: string]: string } = {};

  for (const username in changes) {
    const countChange = changes[username];
    let karma = `¯\_(ツ)_/¯`;

    // Define the update parameters with proper typing
    const updateParams: UpdateItemCommandInput = {
      TableName: "karma",
      Key: { username: { S: username } },
      UpdateExpression:
        "SET #reputation = if_not_exists(#reputation, :zero) + :change, #staticKey = :staticVal",
      ExpressionAttributeNames: {
        "#reputation": "reputation",
        "#staticKey": "staticKey",
      },
      ExpressionAttributeValues: {
        ":change": { N: countChange.toString() }, // Directly use the number change
        ":zero": { N: "0" }, // Start with zero if the attribute doesn't exist
        ":staticVal": { S: "scoreboard" }, // Static key value
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      // Try to update the item
      const updateOut: UpdateItemCommandOutput = await dynamoDBClient.send(
        new UpdateItemCommand(updateParams)
      );
      karma = updateOut?.Attributes?.reputation?.N ?? `¯\_(ツ)_/¯`;
    } catch (error) {
      // If the error is a DynamoDB specific error
      if (isDynamoDBError(error)) {
        if (
          error.name === "ResourceNotFoundException" ||
          error.message.includes("ConditionalCheckFailedException")
        ) {
          const putItemParams: PutItemCommandInput = {
            TableName: "karma",
            Item: {
              username: { S: username },
              reputation: { N: countChange.toString() }, // Use the initial count value directly
              staticKey: { S: "scoreboard" }, // Static key value for GSI
            },
          };
          const putOut = await dynamoDBClient.send(
            new PutItemCommand(putItemParams)
          );
          karma = putOut?.Attributes?.reputation?.N ?? `¯\_(ツ)_/¯`;
        } else {
          // Log or rethrow other errors
          console.error(`Failed to update reputation for ${username}:`, error);
          throw error;
        }
      } else {
        // Handle non-DynamoDB errors
        console.error(`An unexpected error occurred:`, error);
        throw error;
      }
    }

    totals[username] = `total: ${karma}`;
  }
  return totals;
}
