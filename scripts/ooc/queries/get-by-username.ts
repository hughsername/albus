import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";

export async function listQuotes(
  username: string
): Promise<{ id: string; quote: string }[]> {
  const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
  const region = process.env.DYNAMODB_REGION || "localhost";

  const dynamoDBClient = new DynamoDBClient({
    region: region,
    endpoint: endpoint,
  });

  const queryParams: QueryCommandInput = {
    TableName: "quotes",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": { S: username },
    },
  };

  try {
    const result = await dynamoDBClient.send(new QueryCommand(queryParams));
    if (result.Items) {
      return result.Items.map((item) => ({
        id: item.id.S || "",
        quote: item.quote.S || "",
      }));
    }
    return [];
  } catch (error) {
    console.error(`Failed to list quotes for ${username}:`, error);
    throw error;
  }
}
