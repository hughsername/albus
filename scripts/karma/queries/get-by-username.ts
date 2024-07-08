import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || "localhost",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

export const getReputationByUsername = async (
  username: string
): Promise<number | null> => {
  try {
    const params: QueryCommand = new QueryCommand({
      TableName: "karma",
      KeyConditionExpression: "username = :u",
      ExpressionAttributeValues: {
        ":u": { S: username },
      },
    });

    const result = await dynamoDBClient.send(params);
    if (result.Items && result.Items.length > 0) {
      const reputation = parseInt(result.Items[0].reputation.N || "0");
      return reputation;
    }
    return null; // No reputation found for the username
  } catch (error) {
    console.error("Error fetching reputation for username:", error);
    throw error;
  }
};
