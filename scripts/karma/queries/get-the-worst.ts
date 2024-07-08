import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import type { KarmaRecord } from "../types";

// Initialize DynamoDB Client
const dynamoDBClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || "localhost",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

// Retrieve the 5 usernames with the lowest reputation using GSI
export const getWorst5UsersByReputation = async (): Promise<KarmaRecord[]> => {
  try {
    const params: QueryCommand = new QueryCommand({
      TableName: "karma",
      IndexName: "ReputationIndex", // Use the GSI we created
      KeyConditionExpression: "#staticKey = :staticValue", // Static key condition to query the GSI
      ExpressionAttributeNames: {
        "#staticKey": "staticKey", // Alias for the attribute name
      },
      ExpressionAttributeValues: {
        ":staticValue": { S: "scoreboard" }, // Static key value to match
      },
      ProjectionExpression: "username, reputation",
      ScanIndexForward: true, // Sort in ascending order to get the worst 5 by reputation
      Limit: 5,
    });

    const result = await dynamoDBClient.send(params);
    if (result.Items) {
      return result.Items.map((item) => ({
        username: item.username.S || "",
        reputation: parseInt(item.reputation.N || "0"),
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching worst 5 users by reputation:", error);
    throw error;
  }
};
