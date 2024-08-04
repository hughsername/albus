import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  CreateTableCommandInput,
  DescribeTableCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { isDynamoDBError } from "../../utils/typeguards";

export default async function createBehaveTableIfNotExists() {
  const endpoint = process.env.DYNAMODB_ENDPOINT || "http://localhost:8000";
  const region = process.env.DYNAMODB_REGION || "localhost";

  // Initialize DynamoDB Client
  const dynamoDBClient = new DynamoDBClient({
    region: region,
    endpoint: endpoint,
  });

  // Define table creation parameters
  const tableParams: CreateTableCommandInput = {
    TableName: "behave",
    KeySchema: [
      { AttributeName: "channelId", KeyType: "HASH" }, // Partition key
    ],
    AttributeDefinitions: [{ AttributeName: "channelId", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    // Check if the table already exists
    const describeTableCommand = new DescribeTableCommand({
      TableName: "behave",
    });
    let tableExists = false;

    try {
      const describeTableOutput: DescribeTableCommandOutput =
        await dynamoDBClient.send(describeTableCommand);
      tableExists = describeTableOutput.Table !== undefined;
    } catch (error) {
      // Use the type guard to check if the error is a DynamoDB error
      if (isDynamoDBError(error)) {
        if (error.name === "ResourceNotFoundException") {
          tableExists = false;
        } else {
          console.error("Failed to describe table:", error);
          throw error;
        }
      } else {
        // Handle non-DynamoDB errors
        console.error("An unexpected error occurred:", error);
        throw error;
      }
    }

    // Create table if it does not exist
    if (!tableExists) {
      console.log(
        "\x1b[33;1m%s\x1b[0m",
        "[MIGRATION] Behave table does not exist. Creating table..."
      );
      const createTableCommand = new CreateTableCommand(tableParams);
      const createTableOutput = await dynamoDBClient.send(createTableCommand);
      console.log(
        "\x1b[33;1m%s\x1b[0m",
        `[MIGRATION] Behave table creation successful: ${createTableOutput.TableDescription?.TableName}`
      );
    } else {
      console.log(
        "\x1b[32m%s\x1b[0m",
        "[MIGRATION] behave-v1: Behave table already exists"
      );
    }
  } catch (error) {
    console.error("Failed to create or check behave table:", error);
    throw error;
  }
}
