import type AppCustomContext from "@slack/bolt/dist/App.d.ts";
import { getRandomOocQuote } from "./queries/get-random-quote";
import { handleOocCommand } from "./commands";

// OOC command handler
const ooc = async (app: AppCustomContext) => {
  // Listen to messages containing "albus ooc"
  app.message(
    /^albus ooc\s+(add|list|delete|help)(\s+<@[\w]+>)?\s*(.+)?$/i,
    async ({ message, context, say }) => {
      const subCommand = context.matches[1]?.toLowerCase();
      const username = context.matches[2].trim();
      const quoteOrId = context.matches[3]?.trim();

      await handleOocCommand(subCommand, username, quoteOrId, say);
    }
  );

  // Add a chance to respond with a random OOC quote
  app.message(async ({ message, say }) => {
    if (message.subtype === undefined || message.subtype === "bot_message") {
      if (
        message.text &&
        typeof message.text === "string" &&
        message.text.trim() !== "" &&
        message.user
      ) {
        const username = `<@${message.user}>`;
        if (Math.random() < 0.04) {
          const randomQuote = await getRandomOocQuote(username);
          if (randomQuote) {
            await say(`"${randomQuote}" -${username}`);
          }
        } else {
          // do nothing
          // console.log(
          //   `Randomized quote: "${await getRandomOocQuote(
          //     username
          //   )}" -${username}`
          // );
        }
      }
    }
  });
};

export default ooc;
