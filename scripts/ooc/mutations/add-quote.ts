import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { generateUUID } from "../../../utils/generate-uuid";

export async function addOocQuote(
  username: string,
  quote: string
): Promise<void> {
  const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
  const region = process.env.DYNAMODB_REGION || "localhost";

  const dynamoDBClient = new DynamoDBClient({
    region: region,
    endpoint: endpoint,
  });

  const id = generateUUID(); // Generate a unique identifier for the quote

  const putItemParams: PutItemCommandInput = {
    TableName: "quotes",
    Item: {
      username: { S: username },
      id: { S: id },
      quote: { S: quote },
    },
  };

  try {
    await dynamoDBClient.send(new PutItemCommand(putItemParams));
  } catch (error) {
    console.error(`Failed to add quote for ${username}:`, error);
    throw error;
  }
}
