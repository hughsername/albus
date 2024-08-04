import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import type { SayFn } from "@slack/bolt";

const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
const region = process.env.DYNAMODB_REGION || "localhost";

// Initialize DynamoDB Client
const dynamoDBClient = new DynamoDBClient({
  region: region,
  endpoint: endpoint,
});

// In-memory store for channels
const behaveChannels: Set<string> = new Set();

// Function to get the current in-memory list of behave channels
export const getBehaveChannels = (): Set<string> => {
  return behaveChannels;
};

// Utility function to check if Albus should behave
export const shouldBehave = (channelId: string | null | undefined): boolean => {
  if (!channelId) {
    return true; // Albus should always behave if channelId is nullish
  }
  return behaveChannels.has(channelId);
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

export const listBehaveChannels = async (say: SayFn) => {
  const behaveChannels = getBehaveChannels();

  if (behaveChannels.size === 0) {
    await say("There are no channels on the behave list.");
    return;
  }

  let channelList = "Channels on the behave list:\n";
  behaveChannels.forEach((channelId) => {
    channelList += `• <#${channelId}>\n`;
  });

  await say(channelList);
};
