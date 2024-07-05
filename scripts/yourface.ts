import type AppCustomContext from "@slack/bolt/dist/App.d.ts";

const yourface = async (app: AppCustomContext) => {
  // Define your regex pattern for matching sentences
  const regexPattern =
    /\b((?:am|is|are|was|were|been|have|has|had|having|isn't|aren't|wasn't|weren't|'s|I'm|'re|hasn't|haven't|hadn't))\b([^.!?]*)/i;

  app.message(async ({ message, say }) => {
    if (
      message.type === "message" &&
      (message.subtype === undefined || message.subtype === "bot_message") &&
      message.text
    ) {
      const match = message.text.match(regexPattern);
      if (match) {
        // Generate a random number to determine if the bot should respond
        const shouldRespond = Math.random() <= 0.07; // 7% chance

        // Capture the verb and the rest of the sentence
        const verb = match[1]; // e.g., "am", "is", "are", etc.
        const restOfSentence = match[2]; // The rest of the sentence after the verb

        // Determine the adjusted verb for the "your face" joke
        let adjustedVerb: string;
        switch (verb?.toLowerCase()) {
          case undefined:
          case "are":
          case "am":
          case "'s":
          case "'re":
          case "i'm":
            adjustedVerb = "is";
            break;
          case "aren't":
            adjustedVerb = "is not";
            break;
          case "were":
            adjustedVerb = "was";
            break;
          case "weren't":
            adjustedVerb = "wasn't";
            break;
          case "'ve":
          case "have":
            adjustedVerb = "has";
            break;
          case "haven't":
            adjustedVerb = "hasn't";
            break;
          default:
            adjustedVerb = verb.toLowerCase();
            break;
        }

        // Construct the response
        const response = `Your face ${adjustedVerb}${restOfSentence}`;

        // Send the response back to Slack
        if (shouldRespond) {
          await say(response);
        } else {
          // do nothing. Uncomment this for testing, don't commit messages to the logs.
          // console.info(response);
        }
      }
    }
  });
};

export default yourface;
