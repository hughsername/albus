import {
  DynamoDBClient,
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";

export async function removeOocQuote(
  username: string,
  id: string
): Promise<void> {
  const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
  const region = process.env.DYNAMODB_REGION || "localhost";

  const dynamoDBClient = new DynamoDBClient({
    region: region,
    endpoint: endpoint,
  });

  const deleteItemParams: DeleteItemCommandInput = {
    TableName: "quotes",
    Key: {
      username: { S: username },
      id: { S: id },
    },
  };

  try {
    await dynamoDBClient.send(new DeleteItemCommand(deleteItemParams));
  } catch (error) {
    console.error(`Failed to remove quote for ${username}:`, error);
    throw error;
  }
}
