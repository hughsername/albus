import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";

export async function getRandomOocQuote(
  username: string
): Promise<string | null> {
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
    if (result.Items && result.Items.length > 0) {
      const randomIndex = Math.floor(Math.random() * result.Items.length);
      return result.Items[randomIndex].quote.S || null;
    }
    return null;
  } catch (error) {
    console.error(`Failed to retrieve quote for ${username}:`, error);
    throw error;
  }
}
