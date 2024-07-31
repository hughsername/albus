import type { SayFn } from "@slack/bolt";
import { addOocQuote } from "./mutations/add-quote";
import { removeOocQuote } from "./mutations/delete-quote";
import { listQuotes } from "./queries/get-by-username";
import { getRandomOocQuote } from "./queries/get-random-quote";

// Helper function to format the list of quotes
const formatQuotes = (quotes: any[]): string => {
  return quotes.map((quote) => `${quote.id}: "${quote.quote}"`).join("\n");
};

export const handleOocCommand = async (
  subCommand: string,
  username: string,
  argument: string | undefined,
  say: SayFn
) => {
  switch (subCommand) {
    case "help":
      await say(`
        Available commands for karma:
- \`albus ooc add @username <quote>\`: Add an ooc quote for @username
- \`albus ooc list @username\`: Show all quotes for @username
- \`albus ooc delete @username <quote-id>\`: Delete an ooc quote 
- \`albus ooc help\`: Display this help message
      `);
      break;
    case "add":
      if (username && argument) {
        await addOocQuote(username, argument);
        await say(`Added OOC quote for ${username}: "${argument}"`);
      } else {
        await say("Invalid command. Usage: `albus ooc add @username <quote>`");
      }
      break;
    case "list":
      if (username) {
        const quotes = await listQuotes(username);
        if (quotes.length > 0) {
          await say(`Quotes for ${username}:\n${formatQuotes(quotes)}`);
        } else {
          await say(`No quotes found for ${username}`);
        }
      } else {
        await say("Invalid command. Usage: `albus ooc list @username`");
      }
      break;
    case "delete":
      if (username && argument) {
        await removeOocQuote(username, argument);
        await say(`Deleted OOC quote with ID ${argument} for ${username}`);
      } else {
        await say("Invalid command. Usage: `albus ooc delete @username <id>`");
      }
      break;
    default:
      await say(
        "Invalid command. Type `albus ooc help` for available commands."
      );
      break;
  }
};
