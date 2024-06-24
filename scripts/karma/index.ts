import type AppCustomContext from "@slack/bolt/dist/App.d.ts";
import { deltaReputation, writeReputationToDynamoDB } from "./reputation";
import { generateKarmaMessages } from "./announce";
/**
 * This function controls the enabled
 * scripts for Albus, regardless of where
 * he is running (locally or in a lambda)
 */
const karma = async (app: AppCustomContext) => {
  // Listens to incoming messages that contain "hello"
  app.message(/([\w<@>]+)\s*([\+\-]{2})/g, async ({ message, say }) => {
    if (message.subtype === undefined || message.subtype === "bot_message") {
      if (
        message.text &&
        typeof message.text === "string" &&
        message.text.trim() !== "" &&
        message.user
      ) {
        const changes = deltaReputation(message.text);
        const totals = await writeReputationToDynamoDB(changes);
        await say(generateKarmaMessages(changes, totals, message.user));
      }
    }
  });
};

export default karma;
