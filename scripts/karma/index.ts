import type AppCustomContext from "@slack/bolt/dist/App.d.ts";
import { writeReputationToDynamoDB } from "./mutations/update-reputation";
import { handleKarmaCommand } from "./commands";
import { randomizeKarmaResponse } from "./responses";
import { deltaReputation } from "./utils";
/**
 * This function controls the enabled
 * scripts for Albus, regardless of where
 * he is running (locally or in a lambda)
 */
const karma = async (app: AppCustomContext) => {
  // Listens to incoming messages that contain "++" or "--"
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
        await say(randomizeKarmaResponse(changes, totals, message.user));
      }
    }
  });

  // Listen to messages containing "albus karma"
  app.message(
    /^albus karma\s+(lookup\s+([\w<@>]+)|help|the\s+(best|worst))$/i,
    async ({ message, context, say }) => {
      const command = context.matches[1].toLowerCase(); // Extract the command from the regex match
      let argument: string | undefined;

      // If the command is not 'help', check if there's an additional argument (username)
      if (command !== "help" && context.matches[2]) {
        argument = context.matches[2]; // Extract additional argument (username)
      }

      // Call the handler with the extracted command and argument
      await handleKarmaCommand(command, argument, say);
    }
  );
};

export default karma;
