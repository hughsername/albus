import {
  DynamoDBClient,
  UpdateItemCommand,
  PutItemCommand,
  UpdateItemCommandInput,
  PutItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

// Function to parse the string and count word changes
export function deltaReputation(inputString: string): Record<string, number> {
  const regex = /([\w<@>]+)\s*([\+\-]{2})/g;
  const matches: RegExpMatchArray | null = inputString.match(regex);

  const changes: { [key: string]: number } = {};
  if (matches) {
    matches.forEach((match) => {
      const word: string = match.slice(0, -2); // Remove the '++' or '--' from the matched word
      const operator: string = match.slice(-2); // Get the operator '++' or '--'
      changes[word] = (changes[word] || 0) + (operator === '++' ? 1 : -1); // Increment or decrement the count for the word
    });
  }

  return changes;
}

// Function to determine if an error is a DynamoDB specific error
function isDynamoDBError(error: unknown): error is { name: string; message: string } {
  return typeof error === 'object' && error !== null && 'name' in error && 'message' in error;
}

// Function to update or insert word counts in DynamoDB
export async function writeReputationToDynamocDB(changes: Record<string, number>): Promise<{ [key: string]: string }> {
  const dynamoDBClient = new DynamoDBClient({ region: 'localhost', endpoint: 'http://localhost:8000' });
  const totals: { [key: string]: string } = {};

  for (const username in changes) {
    const countChange = changes[username];
    let karma = `¯\_(ツ)_/¯`;

    // Define the update parameters with proper typing
    const updateParams: UpdateItemCommandInput = {
      TableName: 'karma',
      Key: { username: { S: username } },
      UpdateExpression: 'SET #reputation = if_not_exists(#reputation, :zero) + :change',
      ExpressionAttributeNames: { '#reputation': 'reputation' },
      ExpressionAttributeValues: {
        ':change': { N: countChange.toString() }, // Directly use the number change
        ':zero': { N: '0' }, // Start with zero if the attribute doesn't exist
      },
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      // Try to update the item
      const updateOut: UpdateItemCommandOutput = await dynamoDBClient.send(new UpdateItemCommand(updateParams));
      karma = updateOut?.Attributes?.reputation?.N ?? `¯\_(ツ)_/¯`;
      console.log(`Successfully updated reputation for ${username}`);
    } catch (error) {
      // If the error is a DynamoDB specific error
      if (isDynamoDBError(error)) {
        if (error.name === 'ResourceNotFoundException' || error.message.includes('ConditionalCheckFailedException')) {
          console.log(`Item for ${username} not found, creating new item.`);
          const putItemParams: PutItemCommandInput = {
            TableName: 'karma',
            Item: {
              username: { S: username },
              reputation: { N: countChange.toString() }, // Use the initial count value directly
            },
          };
          const putOut = await dynamoDBClient.send(new PutItemCommand(putItemParams));
          karma = putOut?.Attributes?.reputation?.N ?? `¯\_(ツ)_/¯`;
          console.log(`Successfully created and updated reputation for ${username}`);
        } else {
          // Log or rethrow other errors
          console.error(`Failed to update reputation for ${username}:`, error);
          throw error;
        }
      } else {
        // Handle non-DynamoDB errors
        console.error(`An unexpected error occurred:`, error);
        throw error;
      }
    }

    totals[username] = `total: ${karma}`;
  }
  return totals;
}

// Example usage
const testString = 'noise anything++ noise anything++ anything++ anything++ boring-- noise boring-- animal++';
const changes: Record<string, number> = deltaReputation(testString);
//await writeReputationToDynamocDB(changes);
