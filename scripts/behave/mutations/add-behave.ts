import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { getBehaveChannels } from "../queries/get-behave";

const behaveChannels = getBehaveChannels();

const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const region = process.env.DYNAMODB_REGION || "localhost";

// Initialize DynamoDB Client
const dynamoDBClient = new DynamoDBClient({
  region: region,
  endpoint: endpoint,
});

// Add a channel to the behave list in both in-memory store and DynamoDB
export const addBehaveChannel = async (channelId: string): Promise<void> => {
  // Add to in-memory store
  behaveChannels.add(channelId);

  // Add to DynamoDB
  const params = {
    TableName: "behave",
    Item: {
      channelId: { S: channelId },
    },
  };

  try {
    await dynamoDBClient.send(new PutItemCommand(params));
  } catch (error) {
    console.error("Error adding channel to DynamoDB:", error);
    // Remove from in-memory store if DB operation fails
    behaveChannels.delete(channelId);
    throw error;
  }
};

// Load initial channels from DynamoDB into in-memory store
export const loadBehaveChannels = async (): Promise<void> => {
  const params = {
    TableName: "behave",
  };

  try {
    const data = await dynamoDBClient.send(new ScanCommand(params));
    if (data.Items) {
      data.Items.forEach((item) => {
        if (item.channelId && item.channelId.S) {
          behaveChannels.add(item.channelId.S);
        }
      });
    }
  } catch (error) {
    console.error("Error loading channels from DynamoDB:", error);
    throw error;
  }
};
