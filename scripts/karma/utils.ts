import type { KarmaRecord } from "./types";

// Function to parse the string and count word changes
export function deltaReputation(inputString: string): Record<string, number> {
  const regex = /([\w<@>]+)\s*([\+\-]{2})/g;
  const matches: RegExpMatchArray | null = inputString.match(regex);

  const changes: { [key: string]: number } = {};
  if (matches) {
    matches.forEach((match) => {
      const word: string = match.slice(0, -2); // Remove the '++' or '--' from the matched word
      const operator: string = match.slice(-2); // Get the operator '++' or '--'
      changes[word] = (changes[word] || 0) + (operator === "++" ? 1 : -1); // Increment or decrement the count for the word
    });
  }

  return changes;
}

// Utility function to convert KarmaRecords to Slack message format
export const formatKarmaRecords = (
  records: KarmaRecord[],
  type: "best" | "worst"
): string => {
  let message = `*Top 5 ${type} karma users:*\n`;

  // Iterate through the records and format each entry
  records.forEach((record, index) => {
    message += `${index + 1}. ${record.username} - Reputation: ${
      record.reputation
    }\n`;
  });

  return message;
};
