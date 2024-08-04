import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { getBehaveChannels } from "../queries/get-behave";

const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const region = process.env.DYNAMODB_REGION || "localhost";

const behaveChannels = getBehaveChannels();

// Initialize DynamoDB Client
const dynamoDBClient = new DynamoDBClient({
  region: region,
  endpoint: endpoint,
});

// Delete a channel from the behave list in both in-memory store and DynamoDB
export const deleteBehaveChannel = async (channelId: string): Promise<void> => {
  // Remove from in-memory store
  behaveChannels.delete(channelId);

  // Remove from DynamoDB
  const params = {
    TableName: "behave",
    Key: {
      channelId: { S: channelId },
    },
  };

  try {
    await dynamoDBClient.send(new DeleteItemCommand(params));
  } catch (error) {
    console.error("Error deleting channel from DynamoDB:", error);
    // Re-add to in-memory store if DB operation fails
    behaveChannels.add(channelId);
    throw error;
  }
};
