import type { SayFn } from "@slack/bolt";
import { getBest5UsersByReputation } from "./queries/get-the-best";
import { getWorst5UsersByReputation } from "./queries/get-the-worst";
import { formatKarmaRecords } from "./utils";
import { getReputationByUsername } from "./queries/get-by-username";

export const handleKarmaCommand = async (
  command: string,
  argument: string | undefined,
  say: SayFn
) => {
  switch (command) {
    case "help":
      await say(`
        Available commands for karma:
- \`albus karma the best\`: Show the top 5 highest performing karma usernames
- \`albus karma the worst\`: Show the bottom 5 performing karma usernames
- \`albus karma lookup <username>\`: Query the karma for a specific username
- \`albus karma help\`: Display this help message
      `);
      break;
    case "the best":
      const best = await getBest5UsersByReputation();
      await say(formatKarmaRecords(best, "best"));
      break;
    case "the worst":
      const worst = await getWorst5UsersByReputation();
      await say(formatKarmaRecords(worst, "worst"));
      break;
    default:
      if (argument) {
        const total = await getReputationByUsername(argument);
        if (total) {
          await say(`Total karma for ${argument}: ${total}`);
        } else {
          await say(
            `I couldn't find that one, sorry about that. (Searched ${argument})`
          );
        }
      } else {
        await say(
          "Invalid command. Type `albus karma help` for available commands."
        );
      }
      break;
  }
};
